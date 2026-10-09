import { lazy, useLayoutEffect, useRef, useState } from 'react'
import { gsap, ScrollTrigger } from '../lib/motion'
import { reducedMotion } from '../lib/device'
import { scroll } from '../three/scrollState'
import { useI18n } from '../i18n/I18nProvider'
import SceneHost from './SceneHost'
import Split from './Split'
import WineFlow from './WineFlow'

const WineScene = lazy(() => import('../three/WineScene'))

export default function Hero({ entered }) {
  const { c } = useI18n()
  const hero = c.hero
  const root = useRef(null)
  const [step, setStep] = useState(0)

  // scroll: sincroniza 3D + beats de texto
  useLayoutEffect(() => {
    const ctx = gsap.context(() => {
      const last = { i: 0 }
      ScrollTrigger.create({
        trigger: root.current,
        start: 'top top',
        end: 'bottom bottom',
        onUpdate: (self) => {
          scroll.hero = self.progress
          const i = Math.min(3, Math.floor(self.progress * 4.0))
          if (i !== last.i) {
            last.i = i
            setStep(i)
          }
        },
      })
      if (reducedMotion) return
      const tl = gsap.timeline({ defaults: { ease: 'none' }, scrollTrigger: { trigger: root.current, start: 'top top', end: 'bottom bottom', scrub: 0.8 } })
      tl.fromTo('.hero__cue', { autoAlpha: 1 }, { autoAlpha: 0, duration: 0.05, immediateRender: false }, 0)
        .fromTo('.hero__tag', { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -40, duration: 0.12, immediateRender: false }, 0.08)
        .fromTo('.hero__title', { yPercent: 0, autoAlpha: 1 }, { yPercent: -12, autoAlpha: 0, duration: 0.3, immediateRender: false }, 0.12)
      root.current.querySelectorAll('.beat').forEach((b, i) => {
        const at = 0.26 + i * 0.24
        tl.fromTo(b, { autoAlpha: 0, y: 40 }, { autoAlpha: 1, y: 0, duration: 0.07 }, at)
        if (i < 2) tl.to(b, { autoAlpha: 0, y: -30, duration: 0.06 }, at + 0.16)
      })
      tl.to({}, { duration: 0.001 }, 1)
    }, root)
    return () => ctx.revert()
  }, [])

  // título com parallax subtil ao rato (só dispositivos com rato e sem reduced-motion)
  useLayoutEffect(() => {
    if (reducedMotion || !window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    const el = root.current.querySelector('.hero__title')
    const mx = gsap.quickTo(el, 'x', { duration: 1.6, ease: 'power3' })
    const my = gsap.quickTo(el, 'y', { duration: 1.6, ease: 'power3' })
    const on = (e) => {
      mx((e.clientX / window.innerWidth - 0.5) * -26)
      my((e.clientY / window.innerHeight - 0.5) * -14)
    }
    window.addEventListener('pointermove', on, { passive: true })
    return () => window.removeEventListener('pointermove', on)
  }, [])

  // introdução cinematográfica (após o age gate)
  useLayoutEffect(() => {
    if (!entered || reducedMotion) {
      if (reducedMotion) gsap.set('.hero__canvas, .hero__intro', { autoAlpha: 1 })
      return
    }
    const ctx = gsap.context(() => {
      gsap
        .timeline({ defaults: { ease: 'power2.out' } })
        .to('.hero__canvas', { autoAlpha: 1, duration: 3.2, ease: 'power1.inOut' }, 0)
        .fromTo('.hero__title .split__i', { yPercent: 110 }, { yPercent: 0, duration: 2.4, stagger: 0.1, ease: 'expo.out' }, 0.9)
        .to('.hero__intro', { autoAlpha: 1, y: 0, duration: 1.8, stagger: 0.25 }, 2.1)
    }, root)
    return () => ctx.revert()
  }, [entered])

  return (
    <section id="home" className="hero" ref={root} aria-label="Trintorum">
      <div className="hero__stage">
        {entered && <WineFlow entered={entered} />}
        <div className="hero__vignette" aria-hidden="true" />
        <div className="hero__grain" aria-hidden="true" />
        <h1 className="hero__title">
          <Split>TRINTORUM</Split>
        </h1>
        <SceneHost className="hero__canvas" rootMargin="0px">
          {(visible) => (entered ? <WineScene visible={visible} entered={entered} /> : null)}
        </SceneHost>

        <p className="hero__eyebrow hero__intro">{hero.eyebrow}</p>
        <p className="hero__tag hero__intro">
          {hero.lines[0]}
          <br />
          {hero.lines[1]}
        </p>
        <p className="hero__cue hero__intro" aria-hidden="true">
          <span>{hero.scroll}</span>
          <i />
        </p>

        {hero.beats.map((b, i) => (
          <div className={`beat beat--${i + 1}`} key={i}>
            <small>{b.k}</small>
            <p>
              {b.title.split('\n').map((l, j) => (
                <span key={j}>{l}</span>
              ))}
            </p>
          </div>
        ))}

        <ol className="hero__steps hero__intro" aria-hidden="true">
          {hero.steps.map((s, i) => (
            <li key={s} className={i <= step ? 'on' : ''}>
              {s}
            </li>
          ))}
        </ol>
      </div>
    </section>
  )
}
