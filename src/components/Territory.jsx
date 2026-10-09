import { lazy, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/motion'
import { scroll, smooth } from '../three/scrollState'
import { useI18n } from '../i18n/I18nProvider'
import { images } from '../data/images'
import SceneHost from './SceneHost'
import Split from './Split'

const TerritoryScene = lazy(() => import('../three/TerritoryScene'))

export default function Territory() {
  const { c: C, tx } = useI18n()
  const T = C.territory
  const root = useRef(null)
  const [idx, setIdx] = useState(0)

  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const last = { i: 0 }
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          const p = self.progress
          scroll.territory = p
          root.current.style.setProperty('--dark', (0.2 + smooth(0.05, 0.6, p) * 0.7).toFixed(3))
          root.current.style.setProperty('--zoom', (1 + p * 0.1).toFixed(3))
          const i = Math.min(T.chain.length - 1, Math.floor(p * 1.15 * T.chain.length))
          if (i !== last.i) {
            last.i = i
            setIdx(i)
          }
        },
      })
    }, root)
    return () => ctx.revert()
  }, [])

  const img = images.territory
  return (
    <section id="territory" className="territory" ref={root} aria-labelledby="territory-title" style={{ '--dark': 0.2, '--zoom': 1 }}>
      <div className="territory__stage">
        <img className="territory__bg" src={img.src} srcSet={img.srcSet} sizes="100vw" alt={tx(img.alt)} width={img.w} height={img.h} loading="lazy" decoding="async" />
        <div className="territory__shade" aria-hidden="true" />
        <SceneHost className="territory__canvas">{(visible) => <TerritoryScene visible={visible} />}</SceneHost>

        <div className="territory__content">
          <div className="territory__head">
            <p className="label">{T.label}</p>
            <h2 id="territory-title" className="display display--xl">
              {T.title.map((l, i) => (
                <Split key={i} as="span" className="block">
                  {l}
                </Split>
              ))}
            </h2>
            <p className="territory__intro">
              {T.intro}
            </p>
            <ul className="territory__facts">
              {T.facts.map((f) => (
                <li key={f.v}>
                  <b>{f.v}</b>
                  <span>{f.t}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="chain-wrap">
          <ol className="chain" aria-label={C.ui.chainAria}>
            {T.chain.map((c, i) => (
              <li key={c.k} className={i === idx ? 'is-active' : i < idx ? 'is-past' : ''}>
                <span className="chain__k">{c.k}</span>
                <span className="chain__t">{c.t}</span>
                {i < T.chain.length - 1 && <span className="chain__arrow" aria-hidden="true">↓</span>}
              </li>
            ))}
          </ol>
          <p className="chain__now" aria-live="polite">{T.chain[idx].t}</p>
          </div>
        </div>
      </div>
    </section>
  )
}
