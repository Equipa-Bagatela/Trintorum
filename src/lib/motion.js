import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { reducedMotion, isMobile } from './device'

gsap.registerPlugin(ScrollTrigger)
export { gsap, ScrollTrigger }

/**
 * Animações globais de scroll, ligadas por atributos de dados:
 *   [data-reveal]    fade + translate
 *   [data-split]     reveal de título por palavras
 *   [data-mask]      reveal de imagem por máscara (clip-path) + escala
 *   [data-parallax]  parallax subtil na <img> (valor = amplitude em %)
 * Em prefers-reduced-motion nada é escondido nem animado.
 */
export function initScrollAnimations(root = document) {
  const mm = gsap.matchMedia()
  mm.add('(prefers-reduced-motion: no-preference)', () => {
    const once = (el, start = 'top 88%') => ({ trigger: el, start, once: true })

    root.querySelectorAll('[data-reveal]').forEach((el) => {
      const delay = parseFloat(el.dataset.delay || 0)
      gsap.fromTo(el, { y: isMobile ? 24 : 44, autoAlpha: 0 }, { y: 0, autoAlpha: 1, duration: 1.4, delay, ease: 'power3.out', scrollTrigger: once(el) })
    })

    root.querySelectorAll('[data-split]').forEach((el) => {
      const words = el.querySelectorAll('.split__i')
      gsap.fromTo(words, { yPercent: 115 }, { yPercent: 0, duration: 1.3, stagger: 0.07, ease: 'expo.out', scrollTrigger: once(el, 'top 90%') })
    })

    root.querySelectorAll('[data-mask]').forEach((el) => {
      const img = el.querySelector('img')
      gsap.fromTo(el, { clipPath: 'inset(14% 14% 14% 14%)' }, { clipPath: 'inset(0% 0% 0% 0%)', duration: 1.8, ease: 'expo.out', scrollTrigger: once(el, 'top 85%') })
      if (img) gsap.fromTo(img, { scale: 1.3 }, { scale: 1.08, duration: 2.2, ease: 'expo.out', scrollTrigger: once(el, 'top 85%') })
    })

    if (!isMobile) {
      root.querySelectorAll('[data-parallax]').forEach((img) => {
        const amt = parseFloat(img.dataset.parallax)
        gsap.fromTo(img, { yPercent: -amt }, { yPercent: amt, ease: 'none', scrollTrigger: { trigger: img.parentElement, start: 'top bottom', end: 'bottom top', scrub: true } })
      })
    }
  })
  return mm
}

export { reducedMotion }
