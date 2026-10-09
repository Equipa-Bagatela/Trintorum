import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { gsap } from '../lib/motion'
import { reducedMotion } from '../lib/device'
import { images } from '../data/images'
import { useI18n } from '../i18n/I18nProvider'
import Toggles from './Toggles'

const KEY = 'trintorum-age-ok'

export function isAgeConfirmed() {
  try {
    return localStorage.getItem(KEY) === '1'
  } catch {
    return false
  }
}

export default function AgeGate({ onEnter }) {
  const { c } = useI18n()
  const g = c.ui.gate
  const root = useRef(null)
  const [denied, setDenied] = useState(false)
  const [ready, setReady] = useState(false)

  // espera pelas fontes (máx. 1.2s) para evitar saltos de layout visíveis
  useEffect(() => {
    const t = new Promise((r) => setTimeout(r, 1200))
    const f = Promise.all([document.fonts.load('300 1em "Cormorant Garamond"'), document.fonts.load('300 1em "Inter Variable"')]).catch(() => {})
    Promise.race([f, t]).then(() => setReady(true))
  }, [])

  useEffect(() => {
    document.documentElement.classList.add('is-locked')
    return () => document.documentElement.classList.remove('is-locked')
  }, [])

  useLayoutEffect(() => {
    if (reducedMotion || !ready) return
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power3.out' } })
        .from('.gate__mark', { autoAlpha: 0, y: 20, duration: 1.6, delay: 0.2 })
        .from('.gate__line', { scaleY: 0, transformOrigin: 'top', duration: 1.2 }, '-=1')
        .from('.gate__q, .gate__actions, .gate__legal', { autoAlpha: 0, y: 14, duration: 1.1, stagger: 0.18 }, '-=0.7')
    }, root)
    return () => ctx.revert()
  }, [denied, ready])

  const accept = () => {
    try {
      localStorage.setItem(KEY, '1')
    } catch {
      /* modo privado: pede de novo na próxima visita */
    }
    const done = () => onEnter()
    if (reducedMotion) return done()
    gsap.to(root.current, { autoAlpha: 0, duration: 1.4, ease: 'power2.inOut', onComplete: done })
  }

  return (
    <div className="gate" ref={root} role="dialog" aria-modal="true" aria-labelledby="gate-q">
      <Toggles className="gate__toggles" />
      <div className="gate__inner" style={{ visibility: ready ? 'visible' : 'hidden' }}>
        <span className="emblem gate__emblem gate__mark" style={{ '--emblem': `url(${images.emblem})` }} role="img" aria-label="Trintorum 30" />
        <p className="gate__mark">Trintorum</p>
        <span className="gate__line" aria-hidden="true" />
        {!denied ? (
          <>
            <h2 className="gate__q" id="gate-q">
              {g.q}
            </h2>
            <div className="gate__actions">
              <button className="gate__btn gate__btn--yes" onClick={accept} autoFocus>
                {g.yes}
              </button>
              <button className="gate__btn" onClick={() => setDenied(true)}>
                {g.no}
              </button>
            </div>
          </>
        ) : (
          <>
            <h2 className="gate__q" id="gate-q">
              {g.thanks}
            </h2>
            <p className="gate__msg">{g.denied}</p>
            <div className="gate__actions">
              <button className="gate__btn" onClick={() => setDenied(false)}>
                {g.back}
              </button>
            </div>
          </>
        )}
        <p className="gate__legal">{g.legal}</p>
      </div>
    </div>
  )
}
