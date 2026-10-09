import { forwardRef, useEffect, useMemo } from 'react'
import * as THREE from 'three'
import { tier } from '../lib/device'
import { images } from '../data/images'

const H = 2.74 // altura total da garrafa (unidades de cena)

// Perfil de uma garrafa de vinho tinto (estilo bordalesa) para LatheGeometry.
function bottleProfile() {
  const pts = [
    [0, 0],
    [0.3, 0],
    [0.365, 0.03],
    [0.38, 0.1],
    [0.38, 1.42],
  ]
  const shoulder = new THREE.SplineCurve(
    [[0.38, 1.42], [0.372, 1.62], [0.31, 1.82], [0.2, 2.0], [0.134, 2.18], [0.12, 2.32]].map(([x, y]) => new THREE.Vector2(x, y)),
  ).getPoints(30)
  shoulder.forEach((v) => pts.push([v.x, v.y]))
  pts.push([0.12, 2.6], [0.134, 2.62], [0.142, 2.68], [0.13, 2.74], [0, 2.74])
  return pts.map(([x, y]) => new THREE.Vector2(x, y))
}

function capsuleProfile() {
  return [
    [0.121, 2.28],
    [0.139, 2.3],
    [0.139, 2.69],
    [0.148, 2.72],
    [0.14, 2.755],
    [0, 2.76],
  ].map(([x, y]) => new THREE.Vector2(x, y))
}

// Rótulo do "Trintorum 30 Reserva" (2024): papel preto, emblema "30" e nome a dourado.
const GOLD = '#d9b24c'
function drawLabel(ctx, w, h, emblem) {
  ctx.fillStyle = '#0d0b0c'
  ctx.fillRect(0, 0, w, h)
  for (let i = 0; i < 700; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? 'rgba(255,255,255,.025)' : 'rgba(0,0,0,.25)'
    ctx.fillRect(Math.random() * w, Math.random() * h, 2 + Math.random() * 14, 1 + Math.random() * 3)
  }
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  ctx.fillStyle = '#a79f90'
  ctx.font = '400 30px "Cormorant Garamond", Georgia, serif'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '4px'
  ctx.fillText('2024', w / 2 + 2, h * 0.07)
  if (emblem?.complete && emblem.naturalWidth) {
    const eh = h * 0.5
    const ew = eh * (emblem.naturalWidth / emblem.naturalHeight)
    const off = document.createElement('canvas')
    off.width = Math.round(ew)
    off.height = Math.round(eh)
    const o = off.getContext('2d')
    o.drawImage(emblem, 0, 0, off.width, off.height)
    o.globalCompositeOperation = 'source-in'
    o.fillStyle = GOLD
    o.fillRect(0, 0, off.width, off.height)
    ctx.drawImage(off, (w - ew) / 2, h * 0.12)
  }
  ctx.fillStyle = GOLD
  ctx.font = '500 66px "Cormorant Garamond", Georgia, serif'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '9px'
  ctx.fillText('TRINTORUM', w / 2 + 5, h * 0.76)
  ctx.fillStyle = '#9d9588'
  ctx.font = '400 20px "Inter Variable", Inter, sans-serif'
  if ('letterSpacing' in ctx) ctx.letterSpacing = '8px'
  ctx.fillText('VINHO TINTO', w / 2 + 4, h * 0.86)
  ctx.fillStyle = GOLD
  ctx.fillText('RESERVA', w / 2 + 4, h * 0.93)
}

function makeLabelTexture() {
  const w = 1024
  const h = 640
  const canvas = document.createElement('canvas')
  canvas.width = w
  canvas.height = h
  const ctx = canvas.getContext('2d')
  const emblem = new Image()
  emblem.src = images.emblem
  drawLabel(ctx, w, h, emblem)
  const tex = new THREE.CanvasTexture(canvas)
  tex.colorSpace = THREE.SRGBColorSpace
  tex.anisotropy = 4
  const redraw = () => {
    drawLabel(ctx, w, h, emblem)
    tex.needsUpdate = true
  }
  emblem.onload = redraw
  document.fonts?.ready.then(redraw)
  return tex
}

/** Garrafa procedural Trintorum (sem .glb). Centrada na origem. */
const Bottle = forwardRef(function Bottle(props, ref) {
  const { glass, capsule, label, labelTex } = useMemo(() => {
    const seg = tier.lathe
    return {
      glass: new THREE.LatheGeometry(bottleProfile(), seg),
      capsule: new THREE.LatheGeometry(capsuleProfile(), seg),
      label: new THREE.CylinderGeometry(0.386, 0.386, 0.86, 48, 1, true, -Math.PI * 0.58, Math.PI * 1.16),
      labelTex: makeLabelTexture(),
    }
  }, [])

  useEffect(
    () => () => {
      glass.dispose()
      capsule.dispose()
      label.dispose()
      labelTex.dispose()
    },
    [glass, capsule, label, labelTex],
  )

  return (
    <group ref={ref} {...props}>
      <group position={[0, -H / 2, 0]}>
        <mesh geometry={glass}>
          <meshPhysicalMaterial color="#0b0807" roughness={0.1} metalness={0.15} clearcoat={1} clearcoatRoughness={0.06} envMapIntensity={2.2} />
        </mesh>
        <mesh geometry={capsule}>
          <meshStandardMaterial color="#d6b24a" roughness={0.3} metalness={1} envMapIntensity={1.4} />
        </mesh>
        <mesh geometry={label} position={[0, 0.78, 0]}>
          <meshStandardMaterial map={labelTex} roughness={0.85} metalness={0} side={THREE.FrontSide} polygonOffset polygonOffsetFactor={-1} />
        </mesh>
      </group>
    </group>
  )
})

export default Bottle
export { H as BOTTLE_HEIGHT }
