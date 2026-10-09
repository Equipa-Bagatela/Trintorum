// Estado partilhado entre o DOM (GSAP ScrollTrigger) e o 3D (useFrame). Mutável de propósito: evita re-renders React.
export const scroll = { hero: 0, territory: 0 }
export const pointer = { x: 0, y: 0 }

if (typeof window !== 'undefined') {
  window.addEventListener(
    'pointermove',
    (e) => {
      pointer.x = (e.clientX / window.innerWidth) * 2 - 1
      pointer.y = (e.clientY / window.innerHeight) * 2 - 1
    },
    { passive: true },
  )
}

export const clamp01 = (v) => Math.min(1, Math.max(0, v))
export const smooth = (a, b, v) => {
  const t = clamp01((v - a) / (b - a))
  return t * t * (3 - 2 * t)
}
export const lerp = (a, b, t) => a + (b - a) * t
export const damp = (a, b, lambda, dt) => lerp(a, b, 1 - Math.exp(-lambda * dt))

// Interpolação suave por keyframes: keys = [[p, valor], ...]
export function sample(keys, p) {
  if (p <= keys[0][0]) return keys[0][1]
  for (let i = 1; i < keys.length; i++) {
    if (p <= keys[i][0]) {
      const [p0, v0] = keys[i - 1]
      const [p1, v1] = keys[i]
      return lerp(v0, v1, smooth(p0, p1, p))
    }
  }
  return keys[keys.length - 1][1]
}
