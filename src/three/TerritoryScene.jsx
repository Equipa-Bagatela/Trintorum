import { useRef } from 'react'
import { Canvas, useFrame, useThree } from '@react-three/fiber'
import Terrain from './Terrain'
import Particles from './Particles'
import { tier } from '../lib/device'
import { scroll, smooth, damp } from './scrollState'

function Rig() {
  const g = useRef()
  const p = useRef(0)
  const mobile = useThree((s) => s.size.width < 768)
  useFrame((state, dt) => {
    p.current = damp(p.current, scroll.territory, 3, Math.min(dt, 0.05))
    const t = p.current
    state.camera.position.set(Math.sin(t * 1.4 + 0.3) * 3.2, 4.2 - t * 1.9, 8.2 - t * 2.4)
    state.camera.lookAt(0, mobile ? 2.4 : 0.9, 0)
    if (g.current) g.current.rotation.y = state.clock.elapsedTime * 0.012
  })
  return (
    <group ref={g}>
      <Terrain size={13} amp={2.1} position={[0, -1.1, 0]} progress={() => smooth(0.05, 0.75, scroll.territory)} opacity={1} />
      <Particles opacity={() => 0.35} spread={[12, 5, 8]} position={[0, 1, 0]} />
    </group>
  )
}

export default function TerritoryScene({ visible }) {
  return (
    <Canvas
      frameloop={visible ? 'always' : 'never'}
      dpr={[1, tier.maxDpr]}
      camera={{ fov: 38, position: [0, 4, 8], near: 0.1, far: 40 }}
      gl={{ antialias: tier.antialias, alpha: true, powerPreference: 'high-performance' }}
      aria-hidden="true"
    >
      <Rig />
    </Canvas>
  )
}
