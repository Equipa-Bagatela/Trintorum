import { useEffect, useMemo, useRef } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { tier } from '../lib/device'
import { smooth } from './scrollState'
import { stepTheme } from './themeState'

// ── ruído de valores (determinístico) ────────────────────────────────────────
const hash = (x, y) => {
  const s = Math.sin(x * 127.1 + y * 311.7) * 43758.5453
  return s - Math.floor(s)
}
const vnoise = (x, y) => {
  const xi = Math.floor(x)
  const yi = Math.floor(y)
  const xf = x - xi
  const yf = y - yi
  const u = xf * xf * (3 - 2 * xf)
  const v = yf * yf * (3 - 2 * yf)
  const a = hash(xi, yi)
  const b = hash(xi + 1, yi)
  const c = hash(xi, yi + 1)
  const d = hash(xi + 1, yi + 1)
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v
}
const fbm = (x, y) => {
  let s = 0
  let a = 0.5
  for (let i = 0; i < 4; i++) {
    s += a * vnoise(x, y)
    x *= 2.03
    y *= 2.03
    a *= 0.5
  }
  return s
}

// Vale do rio sinuoso com encostas: x,z em [-1,1] → altura ~[0,1.1]
function heightAt(x, z) {
  const river = Math.sin(x * 2.3 + 0.6) * 0.3 + x * 0.12
  const d = Math.abs(z - river)
  const valley = 1 - Math.exp(-d * d * 5.5)
  const n = fbm(x * 2.2 + 4.1, z * 2.2 + 9.3)
  return valley * (0.5 + 0.55 * n) + 0.14 * n
}

// ── linhas de nível (marching squares) ───────────────────────────────────────
function contour(grid, res, level, size) {
  const seg = []
  const at = (i, j) => grid[j * (res + 1) + i]
  const px = (i) => (i / res - 0.5) * size
  const edge = (i0, j0, i1, j1) => {
    const a = at(i0, j0)
    const b = at(i1, j1)
    const t = (level - a) / (b - a)
    return [px(i0 + (i1 - i0) * t), px(j0 + (j1 - j0) * t)]
  }
  for (let j = 0; j < res; j++) {
    for (let i = 0; i < res; i++) {
      const c = [at(i, j), at(i + 1, j), at(i + 1, j + 1), at(i, j + 1)]
      const pts = []
      if (c[0] >= level !== c[1] >= level) pts.push(edge(i, j, i + 1, j))
      if (c[1] >= level !== c[2] >= level) pts.push(edge(i + 1, j, i + 1, j + 1))
      if (c[3] >= level !== c[2] >= level) pts.push(edge(i, j + 1, i + 1, j + 1))
      if (c[0] >= level !== c[3] >= level) pts.push(edge(i, j, i, j + 1))
      for (let k = 0; k + 1 < pts.length; k += 2) seg.push(pts[k][0], pts[k][1], pts[k + 1][0], pts[k + 1][1])
    }
  }
  return seg
}

const cache = new Map()
function getContours(res, levels) {
  const key = res + ':' + levels
  if (cache.has(key)) return cache.get(key)
  const grid = new Float32Array((res + 1) * (res + 1))
  for (let j = 0; j <= res; j++) for (let i = 0; i <= res; i++) grid[j * (res + 1) + i] = heightAt((i / res) * 2 - 1, (j / res) * 2 - 1)
  const min = 0.06
  const max = 1.0
  const geoms = []
  for (let l = 0; l < levels; l++) {
    const level = min + ((max - min) * l) / (levels - 1)
    const s = contour(grid, res, level, 1)
    const arr = new Float32Array((s.length / 4) * 6)
    for (let k = 0, o = 0; k < s.length; k += 4, o += 6) {
      arr[o] = s[k]
      arr[o + 1] = level
      arr[o + 2] = s[k + 1]
      arr[o + 3] = s[k + 2]
      arr[o + 4] = level
      arr[o + 5] = s[k + 3]
    }
    const g = new THREE.BufferGeometry()
    g.setAttribute('position', new THREE.BufferAttribute(arr, 3))
    geoms.push(g)
  }
  cache.set(key, geoms)
  return geoms
}

/**
 * Relevo topográfico do Douro: linhas de nível empilhadas em altura (socalcos).
 * `progress()` devolve 0..1 e controla a emergência dos socalcos, de baixo para cima.
 */
export default function Terrain({ size = 12, amp = 1.7, progress, opacity = 1, ...props }) {
  const group = useRef()
  const res = tier.gridRes
  const levels = tier.levels

  // a geometria (em unidades normalizadas) é calculada uma vez e partilhada entre cenas
  const geoms = useMemo(() => getContours(res, levels), [res, levels])
  const mats = useMemo(() => {
    const wine = new THREE.Color('#7a1a2b')
    const cream = new THREE.Color('#e6d9bd')
    return geoms.map((_, l) => {
      const t = l / (levels - 1)
      return new THREE.LineBasicMaterial({ color: wine.clone().lerp(cream, Math.pow(t, 0.8)), transparent: true, opacity: 0, depthWrite: false })
    })
  }, [geoms, levels])

  useEffect(() => () => mats.forEach((m) => m.dispose()), [mats])

  const colors = useMemo(() => {
    const dw = new THREE.Color('#7a1a2b')
    const dc = new THREE.Color('#e6d9bd')
    const lw = new THREE.Color('#c2a642')
    const lc = new THREE.Color('#4d4216')
    return { dw, dc, lw, lc, tmp: new THREE.Color(), tmp2: new THREE.Color(), last: -1 }
  }, [])

  useFrame(() => {
    const L = stepTheme()
    if (Math.abs(L - colors.last) > 0.002) {
      colors.last = L
      for (let l = 0; l < levels; l++) {
        const t = Math.pow(l / (levels - 1), 0.8)
        colors.tmp.copy(colors.dw).lerp(colors.dc, t)
        colors.tmp2.copy(colors.lw).lerp(colors.lc, t)
        mats[l].color.copy(colors.tmp).lerp(colors.tmp2, L)
      }
    }
    const p = progress ? progress() : 1
    if (group.current) group.current.visible = p > 0.001
    for (let l = 0; l < levels; l++) {
      const t = l / (levels - 1)
      mats[l].opacity = smooth(t * 0.75, t * 0.75 + 0.3, p) * opacity * (0.35 + 0.65 * t)
    }
    if (group.current) group.current.scale.y = 0.35 + 0.65 * smooth(0, 1, p)
  })

  return (
    <group ref={group} {...props}>
      <group scale={[size, amp, size]}>
        {geoms.map((g, i) => (
          <lineSegments key={i} geometry={g} material={mats[i]} />
        ))}
      </group>
    </group>
  )
}
