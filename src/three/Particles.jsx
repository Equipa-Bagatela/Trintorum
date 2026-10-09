import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { tier } from '../lib/device'
import { stepTheme } from './themeState'

// Poeira de luz muito subtil. Contagem reduzida em dispositivos fracos.
const light = new THREE.Color('#8a7430')

export default function Particles({ opacity = () => 0.5, spread = [9, 7, 6], ...props }) {
  const ref = useRef()
  const count = tier.particles

  const { geometry, material, speeds } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const speeds = new Float32Array(count)
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * spread[0]
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread[1]
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread[2]
      speeds[i] = 0.03 + Math.random() * 0.07
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(pos, 3))
    const c = document.createElement('canvas')
    c.width = c.height = 64
    const ctx = c.getContext('2d')
    const grd = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
    grd.addColorStop(0, 'rgba(255,236,205,1)')
    grd.addColorStop(0.4, 'rgba(255,220,170,.35)')
    grd.addColorStop(1, 'rgba(255,200,150,0)')
    ctx.fillStyle = grd
    ctx.fillRect(0, 0, 64, 64)
    const map = new THREE.CanvasTexture(c)
    const m = new THREE.PointsMaterial({ map, size: 0.075, transparent: true, depthWrite: false, opacity: 0, color: '#e8c9a0', sizeAttenuation: true })
    return { geometry: g, material: m, speeds }
  }, [count, spread])

  useEffect(
    () => () => {
      geometry.dispose()
      material.map?.dispose()
      material.dispose()
    },
    [geometry, material],
  )

  useFrame((_, dt) => {
    const a = geometry.attributes.position
    const h = spread[1] / 2
    for (let i = 0; i < count; i++) {
      let y = a.getY(i) + speeds[i] * dt
      if (y > h) y = -h
      a.setY(i, y)
      a.setX(i, a.getX(i) + Math.sin(y * 1.7 + i) * 0.0006)
    }
    a.needsUpdate = true
    material.opacity = opacity()
    material.color.set('#e8c9a0').lerp(light, stepTheme())
  })

  return <points ref={ref} geometry={geometry} material={material} {...props} />
}
