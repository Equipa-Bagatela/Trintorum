import { useEffect, useRef } from 'react'
import { isMobile, reducedMotion, tier } from '../lib/device'
import { stepTheme } from '../three/themeState'

// Vinho a correr atrás do título: fluido procedural (shader WebGL2) + rasto do rato/dedo.
// Camada própria, abaixo do título e da garrafa 3D. Sem bibliotecas.
const VERT = `#version 300 es
in vec2 p; out vec2 uv;
void main(){ uv = p*.5+.5; gl_Position = vec4(p,0.,1.); }`

const FRAG = `#version 300 es
precision highp float;
in vec2 uv; out vec4 o;
uniform sampler2D uTrail;
uniform float uTime, uIntro, uAspect, uLight;
uniform vec2 uTexel;
float h(vec2 p){ return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453); }
float n(vec2 p){ vec2 i=floor(p),f=fract(p); f=f*f*(3.-2.*f);
  return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y); }
float fbm(vec2 p){ float s=0.,a=.5; for(int i=0;i<OCT;i++){ s+=a*n(p); p=p*2.03+vec2(1.7,9.2); a*=.5; } return s; }
void main(){
  vec2 p = vec2(uv.x*uAspect, uv.y)*1.5;
  float t = uTime;
  // corrente lenta, a descer
  vec2 q = vec2(fbm(p + vec2(0.,-t*.05)), fbm(p + vec2(5.2,1.3) + vec2(t*.02,-t*.03)));
  float flow = fbm(p + 2.2*q + vec2(0.,-t*.045));
  vec2 tuv = uv + (q-.5)*.012;
  vec2 d = uTexel*3.;
  float trail = texture(uTrail,tuv).r;
  float tl = texture(uTrail,tuv-vec2(d.x,0.)).r, tr = texture(uTrail,tuv+vec2(d.x,0.)).r;
  float tb = texture(uTrail,tuv-vec2(0.,d.y)).r, tt = texture(uTrail,tuv+vec2(0.,d.y)).r;
  float height = flow*.56 + trail*1.0;

  // relevo: fluxo (derivadas do ecrã, é de baixa frequência) + rasto (diferenças finitas, sem degraus)
  vec2 g = vec2(tr-tl, tt-tb);
  vec3 N = normalize(vec3(-dFdx(flow)*30. - g.x*2.2, -dFdy(flow)*30. - g.y*2.2, 1.));
  vec3 L = normalize(vec3(-.45,.55,.7));
  float diff = clamp(dot(N,L),0.,1.);
  float spec = pow(clamp(dot(reflect(-L,N),vec3(0,0,1)),0.,1.), 28.);

  vec3 c0 = vec3(.05,.010,.020);
  vec3 c1 = vec3(.38,.04,.11);
  vec3 c2 = vec3(.80,.10,.24);
  vec3 wine = mix(c0, c1, smoothstep(.16,.7,height));
  wine = mix(wine, c2, smoothstep(.6,1.2,height)*.9);
  wine *= .45 + diff*.8;
  wine += vec3(1.,.72,.55)*spec*(.22 + trail*.6);
  wine += c2*trail*.28;

  // vinho branco (modo claro): palha e ouro pálido, luz suave
  vec3 w0 = vec3(.935,.905,.745);
  vec3 w1 = vec3(.90,.81,.47);
  vec3 w2 = vec3(.76,.60,.17);
  vec3 white = mix(w0, w1, smoothstep(.16,.7,height));
  white = mix(white, w2, smoothstep(.6,1.2,height)*.9);
  white *= .86 + diff*.24;
  white += vec3(1.,.98,.9)*spec*(.35 + trail*.5);
  white += w2*trail*.22;
  wine = mix(wine, white, uLight);

  // entrada: o vinho desce do topo, com gotas
  float drip = n(vec2(uv.x*26., 3.))*.16 + n(vec2(uv.x*9., 1.))*.10 + sin(uv.x*7.+t*.6)*.015;
  float front = uIntro*1.35 - drip;
  float fill = 1. - smoothstep(front-.045, front+.045, 1.-uv.y);
  vec3 base = mix(vec3(.03,.02,.02), vec3(.957,.933,.851), uLight);
  o = vec4(mix(base, wine, fill), 1.);
}`

export default function WineFlow({ entered }) {
  const canvas = useRef(null)
  const enteredRef = useRef(entered)
  useEffect(() => {
    enteredRef.current = entered
  }, [entered])

  useEffect(() => {
    const cv = canvas.current
    const gl = cv.getContext('webgl2', { antialias: false, alpha: false, powerPreference: 'low-power' })
    if (!gl) return

    const compile = (type, src) => {
      const s = gl.createShader(type)
      gl.shaderSource(s, src)
      gl.compileShader(s)
      return gl.getShaderParameter(s, gl.COMPILE_STATUS) ? s : null
    }
    const oct = tier.level === 2 ? 5 : 3
    const vs = compile(gl.VERTEX_SHADER, VERT)
    const fs = compile(gl.FRAGMENT_SHADER, `#version 300 es\n#define OCT ${oct}\n` + FRAG.replace('#version 300 es', ''))
    if (!vs || !fs) return
    const prog = gl.createProgram()
    gl.attachShader(prog, vs)
    gl.attachShader(prog, fs)
    gl.linkProgram(prog)
    if (!gl.getProgramParameter(prog, gl.LINK_STATUS)) return
    gl.useProgram(prog)

    const buf = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, buf)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW)
    const loc = gl.getAttribLocation(prog, 'p')
    gl.enableVertexAttribArray(loc)
    gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0)

    const u = (k) => gl.getUniformLocation(prog, k)
    const uTime = u('uTime'), uIntro = u('uIntro'), uAspect = u('uAspect'), uTexel = u('uTexel'), uLightU = u('uLight')
    gl.uniform1i(u('uTrail'), 0)

    // textura do rasto (canvas 2D pequeno)
    const TW = 512
    let TH = 288
    const trail = document.createElement('canvas')
    const tctx = trail.getContext('2d')
    const tex = gl.createTexture()
    gl.activeTexture(gl.TEXTURE0)
    gl.bindTexture(gl.TEXTURE_2D, tex)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE)
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE)
    gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true)

    const resize = () => {
      const scale = (isMobile ? 0.5 : 0.75) * Math.min(window.devicePixelRatio || 1, tier.level === 2 ? 1.25 : 1)
      const w = Math.max(2, Math.round(cv.clientWidth * scale))
      const hh = Math.max(2, Math.round(cv.clientHeight * scale))
      if (cv.width !== w || cv.height !== hh) {
        cv.width = w
        cv.height = hh
        gl.viewport(0, 0, w, hh)
      }
      const nh = Math.max(32, Math.round((TW * cv.clientHeight) / Math.max(1, cv.clientWidth)))
      if (nh !== TH || !trail.width) {
        TH = nh
        trail.width = TW
        trail.height = TH
        tctx.fillStyle = '#000'
        tctx.fillRect(0, 0, TW, TH)
      }
      gl.uniform1f(uAspect, cv.clientWidth / Math.max(1, cv.clientHeight))
      gl.uniform2f(uTexel, 1 / TW, 1 / TH)
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(cv)

    // rasto: segue o ponteiro, engrossa com a velocidade, escorre devagar para baixo
    let last = null
    let active = true
    const onMove = (e) => {
      if (!active || reducedMotion) return
      const r = cv.getBoundingClientRect()
      const x = ((e.clientX - r.left) / r.width) * TW
      const y = ((e.clientY - r.top) / r.height) * TH
      if (y < -10 || y > TH + 10) return
      if (last) {
        const d = Math.hypot(x - last.x, y - last.y)
        const r = Math.min(26, 9 + d * 0.9)
        const alpha = Math.min(0.55, 0.16 + d * 0.012)
        const steps = Math.max(1, Math.ceil(d / (r * 0.3)))
        tctx.globalCompositeOperation = 'lighter'
        for (let i = 1; i <= steps; i++) {
          const px = last.x + ((x - last.x) * i) / steps
          const py = last.y + ((y - last.y) * i) / steps
          const gr = tctx.createRadialGradient(px, py, 0, px, py, r)
          gr.addColorStop(0, `rgba(255,255,255,${alpha})`)
          gr.addColorStop(0.5, `rgba(255,255,255,${alpha * 0.45})`)
          gr.addColorStop(1, 'rgba(255,255,255,0)')
          tctx.fillStyle = gr
          tctx.fillRect(px - r, py - r, r * 2, r * 2)
        }
      }
      last = { x, y }
    }
    const onLeave = () => (last = null)
    window.addEventListener('pointermove', onMove, { passive: true })
    window.addEventListener('pointerleave', onLeave)
    window.addEventListener('pointerup', onLeave)

    // só desenha quando visível
    let inView = true
    const io = new IntersectionObserver(([e]) => (inView = e.isIntersecting))
    io.observe(cv)

    let raf = 0
    let t0 = performance.now()
    let introStart = null
    const frame = (now) => {
      raf = requestAnimationFrame(frame)
      active = inView && !document.hidden
      if (!active) return
      const t = (now - t0) / 1000
      if (enteredRef.current && introStart === null) introStart = now
      const k = introStart === null ? 0 : Math.min(1, (now - introStart) / 4200)
      const intro = reducedMotion ? 1 : 1 - Math.pow(1 - k, 2.2)

      // desvanece e escorre o rasto
      tctx.globalCompositeOperation = 'source-over'
      tctx.fillStyle = 'rgba(0,0,0,0.014)'
      tctx.fillRect(0, 0, TW, TH)
      tctx.globalAlpha = 0.985
      tctx.drawImage(trail, 0, 0.35)
      tctx.globalAlpha = 1

      gl.bindTexture(gl.TEXTURE_2D, tex)
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, trail)
      gl.uniform1f(uTime, reducedMotion ? 12 : t)
      gl.uniform1f(uIntro, intro)
      gl.uniform1f(uLightU, stepTheme())
      gl.drawArrays(gl.TRIANGLES, 0, 3)
    }
    raf = requestAnimationFrame(frame)

    return () => {
      cancelAnimationFrame(raf)
      ro.disconnect()
      io.disconnect()
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerleave', onLeave)
      window.removeEventListener('pointerup', onLeave)
      gl.deleteTexture(tex)
      gl.deleteBuffer(buf)
      gl.deleteProgram(prog)
      gl.deleteShader(vs)
      gl.deleteShader(fs)
    }
  }, [])

  return <canvas ref={canvas} className="hero__flow" aria-hidden="true" />
}
