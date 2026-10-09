import { useEffect, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { tier } from '../lib/device'
import { stepTheme } from './themeState'

// Névoa quente que se move devagar atrás da garrafa (shader de ruído fbm).
const frag = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform float uOpacity;
  uniform vec3 uColor;
  float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}
  float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}
  float fbm(vec2 p){float s=0.,a=.5;for(int i=0;i<OCT;i++){s+=a*n(p);p*=2.02;a*=.5;}return s;}
  void main(){
    vec2 p=vUv*vec2(3.2,2.0);
    float q=fbm(p+vec2(uTime*.02,uTime*.012));
    float f=fbm(p*1.3+q*1.6-vec2(uTime*.015,0.));
    float m=smoothstep(.35,.85,f);
    float v=smoothstep(.95,.1,distance(vUv,vec2(.5,.45)));
    gl_FragColor=vec4(uColor*(.6+f),m*v*uOpacity);
  }
`
const vert = 'varying vec2 vUv; void main(){vUv=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.);}'

export default function Atmosphere({ opacity = () => 0.35, ...props }) {
  const mat = useMemo(
    () =>
      new THREE.ShaderMaterial({
        vertexShader: vert,
        fragmentShader: frag,
        defines: { OCT: tier.level === 1 ? 3 : 5 },
        uniforms: { uTime: { value: 0 }, uOpacity: { value: 0 }, uColor: { value: new THREE.Color('#7a2a2a') } },
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      }),
    [],
  )
  useEffect(() => () => mat.dispose(), [mat])
  useFrame((s) => {
    mat.uniforms.uTime.value = s.clock.elapsedTime
    mat.uniforms.uOpacity.value = opacity() * (1 - stepTheme())
  })
  if (tier.level === 0) return null
  return (
    <mesh {...props} renderOrder={-1}>
      <planeGeometry args={[26, 16]} />
      <primitive object={mat} attach="material" />
    </mesh>
  )
}
