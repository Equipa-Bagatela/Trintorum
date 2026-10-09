import { useEffect, useRef } from 'react'
import { gsap } from '../lib/motion'

// Cursor personalizado: só em dispositivos com rato.
export default function Cursor() {
  const dot = useRef(null)
  const ring = useRef(null)

  useEffect(() => {
    if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return
    document.documentElement.classList.add('has-cursor')
    const dx = gsap.quickTo(dot.current, 'x', { duration: 0.1, ease: 'power3' })
    const dy = gsap.quickTo(dot.current, 'y', { duration: 0.1, ease: 'power3' })
    const rx = gsap.quickTo(ring.current, 'x', { duration: 0.6, ease: 'power3' })
    const ry = gsap.quickTo(ring.current, 'y', { duration: 0.6, ease: 'power3' })
    const move = (e) => {
      dx(e.clientX)
      dy(e.clientY)
      rx(e.clientX)
      ry(e.clientY)
      ring.current.style.opacity = 1
      dot.current.style.opacity = 1
    }
    const over = (e) => {
      const t = e.target.closest?.('a,button,[data-cursor]')
      ring.current.classList.toggle('is-hot', !!t)
      ring.current.dataset.label = t?.dataset.cursor || ''
    }
    window.addEventListener('pointermove', move, { passive: true })
    document.addEventListener('pointerover', over, { passive: true })
    return () => {
      document.documentElement.classList.remove('has-cursor')
      window.removeEventListener('pointermove', move)
      document.removeEventListener('pointerover', over)
    }
  }, [])

  return (
    <>
      <div className="cursor-ring" ref={ring} aria-hidden="true" />
      <div className="cursor-dot" ref={dot} aria-hidden="true" />
    </>
  )
}
