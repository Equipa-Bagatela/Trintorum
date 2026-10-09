import { useEffect, useState } from 'react'
import { brand } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import Toggles from './Toggles'

export default function Navbar() {
  const { c } = useI18n()
  const nav = c.nav
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)

  useEffect(() => {
    const on = () => setScrolled(window.scrollY > 80)
    on()
    window.addEventListener('scroll', on, { passive: true })
    return () => window.removeEventListener('scroll', on)
  }, [])

  useEffect(() => {
    document.documentElement.classList.toggle('is-menu', open)
    const esc = (e) => e.key === 'Escape' && setOpen(false)
    window.addEventListener('keydown', esc)
    return () => {
      window.removeEventListener('keydown', esc)
      document.documentElement.classList.remove('is-menu')
    }
  }, [open])

  return (
    <header className={`nav ${scrolled ? 'is-scrolled' : ''} ${open ? 'is-open' : ''}`}>
      <div className="nav__bar">
        <a href="#home" className="nav__logo" onClick={() => setOpen(false)} aria-label={c.ui.homeAria}>
          Trintorum
        </a>
        <nav className="nav__links" aria-label={c.ui.navMain}>
          {nav.map((l) => (
            <a key={l.id} href={`#${l.id}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <Toggles className="nav__toggles" />
        <a className="nav__cta" href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
          Instagram
        </a>
        <button className="nav__burger" aria-expanded={open} aria-controls="menu" aria-label={open ? c.ui.menuClose : c.ui.menuOpen} onClick={() => setOpen(!open)}>
          <span />
          <span />
        </button>
      </div>
      <div className="menu" id="menu" aria-hidden={!open}>
        <nav aria-label={c.ui.navMobile}>
          {nav.map((l, i) => (
            <a key={l.id} href={`#${l.id}`} tabIndex={open ? 0 : -1} style={{ '--i': i }} onClick={() => setOpen(false)}>
              <small>0{i + 1}</small>
              {l.label}
            </a>
          ))}
        </nav>
        <Toggles className="menu__toggles" />
        <a className="menu__ig" href={brand.instagram.url} target="_blank" rel="noopener noreferrer" tabIndex={open ? 0 : -1}>
          {brand.instagram.handle}
        </a>
      </div>
    </header>
  )
}
