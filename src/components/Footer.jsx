import { brand } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import { allImages, images } from '../data/images'

export default function Footer() {
  const { c } = useI18n()
  const { nav, legal } = c
  return (
    <footer className="footer">
      <div className="footer__top">
        <div className="footer__brand">
          <span className="emblem footer__emblem" style={{ '--emblem': `url(${images.emblem})` }} aria-hidden="true" />
          <p className="footer__mark">Trintorum</p>
          <p>{c.ui.footerBrand}</p>
        </div>
        <nav className="footer__col" aria-label={c.ui.footerAria}>
          <h2>{c.ui.footerNav}</h2>
          {nav.map((l) => (
            <a key={l.id} href={`#${l.id}`}>
              {l.label}
            </a>
          ))}
        </nav>
        <div className="footer__col">
          <h2>{c.ui.footerSocial}</h2>
          <a href={brand.instagram.url} target="_blank" rel="noopener noreferrer">
            Instagram
          </a>
          <a href={brand.facebook.url} target="_blank" rel="noopener noreferrer">
            Facebook
          </a>
        </div>
      </div>
      <p className="footer__legal">{legal}</p>
      <details className="footer__credits">
        <summary>{c.ui.credits}</summary>
        <ul>
          {allImages().map((i) => (
            <li key={i.src}>{i.credit}</li>
          ))}
        </ul>
      </details>
      <p className="footer__copy">© {new Date().getFullYear()} Trintorum</p>
    </footer>
  )
}
