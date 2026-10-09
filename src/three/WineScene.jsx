import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import Bottle from './Bottle'
import Terrain from './Terrain'
import Particles from './Particles'
import Studio from './Studio'
import Atmosphere from './Atmosphere'
import Glow from './Glow'
import { tier, reducedMotion } from '../lib/device'
import { scroll, pointer, sample, smooth, damp } from './scrollState'
import { stepTheme } from './themeState'

const warmA = new THREE.Color('#ffefd9')
const warmB = new THREE.Color('#ff7a4a')
const wineC = new THREE.Color('#9b1f3a')
const fogDark = new THREE.Color('#080605')
const fogLight = new THREE.Color('#f4eed9')

function Rig({ entered }) {
  const bottle = useRef()
  const rim = useRef()
  const key = useRef()
  const fill = useRef()
  const halo = useRef()
  const pool = useRef()
  const world = useRef({ p: 0, intro: 0 })
  const size = useThree((s) => s.size)
  const mobile = size.width < 768

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const w = world.current
    w.p = damp(w.p, scroll.hero, 3.2, dt)
    // introdução cinematográfica: lenta, começa quando o age gate fecha
    if (entered) w.intro = Math.min(1, w.intro + dt / 4.2)
    const intro = smooth(0, 1, w.intro)
    const p = w.p

    const x = mobile ? 0 : sample([[0, 1.45], [0.2, 1.45], [0.3, -1.5], [0.46, -1.5], [0.56, 1.5], [0.72, 1.5], [0.84, 1.25], [1, 1.25]], p)
    const baseY = mobile ? 0.55 : 0
    const scale = (mobile ? 0.95 : 1) * (0.92 + 0.08 * intro)
    if (bottle.current) {
      bottle.current.position.set(x, baseY + (1 - intro) * -0.35 + Math.sin(state.clock.elapsedTime * 0.5) * 0.02, 0)
      bottle.current.scale.setScalar(scale)
      const spin = reducedMotion ? 0 : state.clock.elapsedTime * 0.04
      bottle.current.rotation.y = -0.5 + (1 - intro) * -0.9 + p * Math.PI * 1.7 + pointer.x * 0.18 + spin
      bottle.current.rotation.x = pointer.y * 0.03
    }

    // câmara: aproxima-se e afasta-se
    const z = sample([[0, 6.9], [0.3, 5.9], [0.6, 4.6], [0.85, 5.4], [1, 6.8]], p) + (1 - intro) * 1.6
    const cy = sample([[0, 0.1], [0.6, 0.35], [1, 0.9]], p) * (mobile ? 0.6 : 1)
    state.camera.position.set(pointer.x * 0.25, cy + pointer.y * -0.12, mobile ? z + 1.3 : z)
    state.camera.lookAt(0, mobile ? 0.15 : 0, 0)

    // luz: de rim frio e mínimo → âmbar quente → bordeaux
    const warm = smooth(0.12, 0.6, p)
    const deep = smooth(0.6, 1, p)
    if (rim.current) rim.current.intensity = (4.5 + p * 1.2) * intro
    if (key.current) {
      key.current.intensity = (warm * 46 + 20) * intro
      key.current.color.copy(warmA).lerp(warmB, warm).lerp(wineC, deep * 0.55)
    }
    if (fill.current) fill.current.intensity = (0.25 + deep * 6) * intro

    // vida: luz principal a varrer devagar o vidro + halo que respira
    const tt = state.clock.elapsedTime
    const L = stepTheme()
    if (state.scene.fog) state.scene.fog.color.copy(fogDark).lerp(fogLight, L)
    if (key.current) key.current.position.set(3.2 + Math.sin(tt * 0.35) * 1.4, 1.2 + Math.sin(tt * 0.5) * 0.5, 3 + Math.cos(tt * 0.3) * 0.6)
    if (rim.current) rim.current.position.set(-4 + Math.sin(tt * 0.22) * 1.2, 2, 2.5)
    const breathe = 0.85 + Math.sin(tt * 0.9) * 0.15
    if (halo.current) {
      halo.current.position.set(x, baseY + 0.1, -1.4)
      halo.current.material.opacity = (0.07 + warm * 0.12) * breathe * intro * (1 - L)
    }
    if (pool.current) {
      pool.current.position.set(x, baseY - 1.42 * scale, 0.1)
      pool.current.material.opacity = (0.2 + warm * 0.08) * intro * (1 - L)
    }
  })

  return (
    <>
      <fog attach="fog" args={['#080605', 8, 20]} />
      <ambientLight intensity={0.05} />
      <directionalLight ref={rim} position={[-4, 2, 2.5]} intensity={0} color="#f6ecd9" />
      <pointLight ref={key} position={[3.2, 1.2, 3]} intensity={0} distance={14} decay={2} />
      <pointLight ref={fill} position={[-1, -2.5, 2]} intensity={0} distance={10} decay={2} color="#8a1b30" />
      <Studio />
      <Atmosphere position={[0, 0.5, -5]} opacity={() => 0.12 + smooth(0.1, 0.7, scroll.hero) * 0.2} />
      <Glow ref={halo} color="#c98a5a" size={[6, 6]} />
      <Glow ref={pool} color="#ffb070" size={[3.2, 0.9]} rotation={[-Math.PI / 2.4, 0, 0]} />
      <Bottle ref={bottle} />
      <Terrain
        size={16}
        amp={2}
        position={[0, -2.2, -3.8]}
        rotation={[0.1, 0.25, 0]}
        progress={() => 0.28 + 0.72 * smooth(0.08, 0.95, scroll.hero)}
        opacity={0.85}
      />
      <Particles opacity={() => 0.12 + smooth(0.1, 0.6, scroll.hero) * 0.55} position={[0, 0, -0.5]} />
    </>
  )
}

export default function WineScene({ visible, entered }) {
  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, tier.maxDpr]}
      camera={{ fov: 32, position: [0, 0, 7.6], near: 0.1, far: 40 }}
      gl={{ antialias: tier.antialias, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
        gl.toneMappingExposure = 1.05
      }}
      aria-hidden="true"
    >
      <Rig entered={entered} />
    </Canvas>
  )
}
