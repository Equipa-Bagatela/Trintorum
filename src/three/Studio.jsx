import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { tier } from '../lib/device'

// Ambiente de estúdio escuro gerado localmente (sem HDRs externos e sem drei):
// softboxes estreitas que desenham os reflexos longos típicos de fotografia de garrafas.
function box(scene, color, intensity, pos, rot, w, h) {
  const m = new THREE.Mesh(
    new THREE.PlaneGeometry(w, h),
    new THREE.MeshBasicMaterial({ color: new THREE.Color(color).multiplyScalar(intensity), side: THREE.DoubleSide, toneMapped: false }),
  )
  m.position.set(...pos)
  m.rotation.set(...rot)
  scene.add(m)
}

export default function Studio() {
  const gl = useThree((s) => s.gl)
  const scene = useThree((s) => s.scene)

  useEffect(() => {
    const env = new THREE.Scene()
    env.background = new THREE.Color('#050303')
    box(env, '#f2e8d8', 3.2, [-4.5, 1, 1], [0, Math.PI / 2, 0], 1.2, 9)
    box(env, '#ff9a6b', 1.6, [4.5, 0, -1], [0, -Math.PI / 2, 0], 0.8, 8)
    box(env, '#8a1b30', 0.9, [0, 4, -3], [Math.PI / 2, 0, 0], 8, 3)
    box(env, '#ffffff', 0.5, [0, 0, -6], [0, 0, 0], 5, 5)
    const pmrem = new THREE.PMREMGenerator(gl)
    const rt = pmrem.fromScene(env, 0.02, 0.1, 50, { size: tier.envRes })
    scene.environment = rt.texture
    pmrem.dispose()
    env.traverse((o) => {
      o.geometry?.dispose()
      o.material?.dispose()
    })
    return () => {
      if (scene.environment === rt.texture) scene.environment = null
      rt.dispose()
    }
  }, [gl, scene])

  return null
}
