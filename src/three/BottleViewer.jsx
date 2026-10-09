import { useEffect, useRef } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import Bottle from './Bottle'
import Studio from './Studio'
import Particles from './Particles'
import { tier, reducedMotion } from '../lib/device'
import { damp } from './scrollState'

function Rig({ focus, dragRef }) {
  const bottle = useRef()
  const st = useRef({ rot: -0.4, target: null, cy: 0, cz: 6.4, ty: 0, tz: 5.7 })

  useEffect(() => {
    const s = st.current
    if (!focus) {
      s.target = null
      s.ty = 0
      s.tz = 5.7
      return
    }
    // alvo equivalente mais próximo (evita voltas desnecessárias)
    const full = Math.PI * 2
    s.target = focus.rot + Math.round((s.rot - focus.rot) / full) * full
    s.ty = focus.y
    s.tz = focus.z
  }, [focus])

  useFrame((state, dt) => {
    dt = Math.min(dt, 0.05)
    const s = st.current
    const d = dragRef.current
    if (d.active) {
      s.rot += d.dx * 0.011
      d.dx = 0
      s.target = null
    } else if (s.target !== null) {
      s.rot = damp(s.rot, s.target, 3.5, dt)
    } else if (!reducedMotion && !focus) {
      s.rot += dt * 0.28
    }
    s.cy = damp(s.cy, s.ty, 3, dt)
    s.cz = damp(s.cz, s.tz, 3, dt)
    if (bottle.current) bottle.current.rotation.y = s.rot
    state.camera.position.set(0, s.cy * 0.6, s.cz)
    state.camera.lookAt(0, s.cy, 0)
  })

  return (
    <>
      <ambientLight intensity={0.06} />
      <directionalLight position={[-4, 2, 3]} intensity={2.6} color="#f6ecd9" />
      <pointLight position={[3, 0.5, 3]} intensity={24} distance={12} color="#ff9a6b" />
      <Studio />
      <Bottle ref={bottle} />
      <Particles opacity={() => 0.4} spread={[7, 6, 4]} />
    </>
  )
}

export default function BottleViewer({ visible, focus, dragRef }) {
  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, tier.maxDpr]}
      camera={{ fov: 30, position: [0, 0, 5.7], near: 0.1, far: 30 }}
      gl={{ antialias: tier.antialias, alpha: true, powerPreference: 'high-performance' }}
      onCreated={({ gl }) => {
        gl.toneMapping = THREE.ACESFilmicToneMapping
      }}
      aria-hidden="true"
    >
      <Rig focus={focus} dragRef={dragRef} />
    </Canvas>
  )
}
