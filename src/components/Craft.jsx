import { useLayoutEffect, useRef } from 'react'
import { gsap, ScrollTrigger } from '../lib/motion'
import { useI18n } from '../i18n/I18nProvider'
import { images } from '../data/images'
import BottleArt from './BottleArt'
import Split from './Split'

export default function Craft() {
  const { c, tx } = useI18n()
  const C = c.craft
  const root = useRef(null)
  const track = useRef(null)

  useLayoutEffect(() => {
    const mm = gsap.matchMedia()
    mm.add('(min-width: 900px) and (prefers-reduced-motion: no-preference)', () => {
      const dist = () => Math.max(0, track.current.scrollWidth - window.innerWidth)
      gsap.to(track.current, {
        x: () => -dist(),
        ease: 'none',
        scrollTrigger: {
          trigger: root.current,
          start: 'top top',
          end: () => '+=' + dist(),
          pin: true,
          scrub: 0.8,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (s) => root.current.style.setProperty('--bar', s.progress.toFixed(3)),
        },
      })
    })
    return () => mm.revert()
  }, [])

  return (
    <section id="craft" className="craft" ref={root} aria-labelledby="craft-title">
      <div className="craft__head">
        <p className="label">{C.label}</p>
        <h2 id="craft-title" className="display">
          <Split>{C.title}</Split>
        </h2>
      </div>
      <p className="craft__hint" aria-hidden="true">{c.ui.craftHint}</p>
      <div className="craft__track" ref={track}>
        {C.steps.map((s, i) => {
          const im = images.craft[i]
          return (
            <article className={`step step--${i % 2 ? 'low' : 'high'}`} key={s.n}>
              <div className="step__media">
                {im ? <img src={im.src} srcSet={im.srcSet} sizes="(min-width: 900px) 32vw, 74vw" alt={tx(im.alt)} width={im.w} height={im.h} loading="lazy" decoding="async" /> : <BottleArt className="step__bottle" />}
              </div>
              <div className="step__text">
                <span className="step__n">{s.n}</span>
                <h3>{s.k}</h3>
                <p>{s.t}</p>
              </div>
            </article>
          )
        })}
      </div>
      <div className="craft__bar" aria-hidden="true">
        <span />
      </div>
    </section>
  )
}
