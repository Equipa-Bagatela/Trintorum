import { brand } from '../data/content'
import { useI18n } from '../i18n/I18nProvider'
import Split from './Split'
import { images } from '../data/images'

export default function Contact() {
  const { c } = useI18n()
  const C = c.contact
  const rows = [
    brand.email && [C.rows.email, <a key="e" href={`mailto:${brand.email}`}>{brand.email}</a>],
    brand.phone && [C.rows.phone, <a key="p" href={`tel:${brand.phone.replace(/\s/g, '')}`}>{brand.phone}</a>],
    brand.location && [C.rows.location, brand.location],
  ].filter(Boolean)

  return (
    <section id="contact" className="contact section" aria-labelledby="contact-title">
      <span className="emblem contact__emblem" style={{ '--emblem': `url(${images.emblem})` }} aria-hidden="true" />
      <p className="label">{C.label}</p>
      <h2 id="contact-title" className="display display--xxl">
        {C.title.map((t, i) => (
          <Split key={i} as="span" className="block">
            {t}
          </Split>
        ))}
      </h2>
      <p className="contact__intro">
        {C.intro}
      </p>
      <a className="contact__ig" href={brand.instagram.url} target="_blank" rel="noopener noreferrer" data-cursor="Instagram">
        <span>{brand.instagram.handle}</span>
      </a>
      <p className="contact__alt">
        {c.ui.alsoOn}{' '}
        <a href={brand.facebook.url} target="_blank" rel="noopener noreferrer">
          Facebook
        </a>
      </p>
      {rows.length > 0 && (
        <dl className="contact__rows">
          {rows.map(([k, v]) => (
            <div key={k}>
              <dt>{k}</dt>
              <dd>{v}</dd>
            </div>
          ))}
        </dl>
      )}
    </section>
  )
}
