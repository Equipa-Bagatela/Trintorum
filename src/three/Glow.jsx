import { forwardRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'

// Disco de luz suave (gradiente radial, aditivo): halo atrás da garrafa e poça de luz no chão.
const Glow = forwardRef(function Glow({ color = '#ff9a5a', size = [6, 6], ...props }, ref) {
  const { geo, mat } = useMemo(() => {
    const c = document.createElement('canvas')
    c.width = c.height = 256
    const x = c.getContext('2d')
    const g = x.createRadialGradient(128, 128, 0, 128, 128, 128)
    g.addColorStop(0, 'rgba(255,255,255,1)')
    g.addColorStop(0.35, 'rgba(255,255,255,.35)')
    g.addColorStop(1, 'rgba(255,255,255,0)')
    x.fillStyle = g
    x.fillRect(0, 0, 256, 256)
    const map = new THREE.CanvasTexture(c)
    return {
      geo: new THREE.PlaneGeometry(1, 1),
      mat: new THREE.MeshBasicMaterial({ map, color, transparent: true, opacity: 0, blending: THREE.AdditiveBlending, depthWrite: false }),
    }
  }, [color])
  useEffect(
    () => () => {
      geo.dispose()
      mat.map.dispose()
      mat.dispose()
    },
    [geo, mat],
  )
  return <mesh ref={ref} geometry={geo} material={mat} scale={[size[0], size[1], 1]} {...props} />
})
export default Glow
