// Perfil de desempenho: decide o nível de qualidade do 3D (partículas, resolução, geometria).
const nav = typeof navigator !== 'undefined' ? navigator : {}
const win = typeof window !== 'undefined' ? window : { innerWidth: 1440, matchMedia: () => ({ matches: false }) }

const coarse = win.matchMedia?.('(pointer: coarse)').matches
export const isMobile = win.innerWidth < 768 || !!coarse
const lowCpu = (nav.hardwareConcurrency || 8) <= 4
const lowMem = (nav.deviceMemory || 8) <= 4

export const reducedMotion = !!win.matchMedia?.('(prefers-reduced-motion: reduce)').matches

const level = isMobile || lowCpu || lowMem ? (isMobile && (lowCpu || lowMem) ? 0 : 1) : 2

export const tier = {
  level, // 0 baixo · 1 médio · 2 alto
  maxDpr: [1, 1.25, 1.75][level],
  antialias: level > 0,
  particles: [36, 90, 200][level],
  gridRes: [40, 54, 76][level],
  levels: [12, 16, 22][level],
  envRes: [64, 128, 256][level],
  lathe: [48, 72, 112][level],
}

export function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(c.getContext('webgl2') || c.getContext('webgl'))
  } catch {
    return false
  }
}
