// Tema atual lido pelas cenas 3D/WebGL em cada frame (mutável: evita re-renders).
// `light` vai de 0 (escuro) a 1 (claro) com transição suave; qualquer cena pode chamar stepTheme().
const initial = typeof document !== 'undefined' && document.documentElement.dataset.theme === 'light' ? 1 : 0
export const themeState = { mode: initial ? 'light' : 'dark', light: initial, _t: 0 }

export function stepTheme() {
  const now = performance.now()
  if (now === themeState._t) return themeState.light
  const dt = Math.min(0.1, (now - themeState._t) / 1000)
  themeState._t = now
  const target = themeState.mode === 'light' ? 1 : 0
  const l = themeState.light + (target - themeState.light) * (1 - Math.exp(-5 * dt))
  themeState.light = Math.abs(target - l) < 0.003 ? target : l
  return themeState.light
}
