import { wines } from '../data/wines'
import { images } from '../data/images'
import { useI18n } from '../i18n/I18nProvider'
import BottleArt from './BottleArt'
import Split from './Split'

const rows = ['type', 'year', 'size', 'grapes', 'region', 'abv', 'notes']

function onMove(e) {
  const r = e.currentTarget.getBoundingClientRect()
  e.currentTarget.style.setProperty('--mx', `${((e.clientX - r.left) / r.width) * 100}%`)
  e.currentTarget.style.setProperty('--my', `${((e.clientY - r.top) / r.height) * 100}%`)
}

export default function WineCollection() {
  const { c, tx, num } = useI18n()
  const W = c.wineSection
  const val = (w, k) => (k === 'type' ? c.ui.wineTypes[w.type] : num(w[k]))
  return (
    <section id="wines" className="wines section" aria-labelledby="wines-title">
      <header className="wines__head">
        <p className="label">{W.label}</p>
        <h2 id="wines-title" className="display">
          <Split>{W.title}</Split>
        </h2>
        <p className="wines__intro">
          {W.intro}
        </p>
      </header>

      <div className="wines__track" tabIndex={0} role="region" aria-label={c.ui.wineTrack}>
        {wines.map((w, i) => {
          const photo = images.wines[i]
          const scene = images.collection?.[i]
          return (
            <article className="wine" key={w.id} data-cursor={c.ui.cursorView} onPointerMove={onMove}>
              <div className="wine__stage">
                {scene && !photo ? (
                  <img className="wine__scene" src={scene.src} width={scene.w} height={scene.h} alt={tx(scene.alt)} sizes="(min-width: 900px) 30vw, 78vw" loading="lazy" decoding="async" />
                ) : photo ? (
                  <img src={photo.src} srcSet={photo.srcSet} sizes="(min-width: 900px) 30vw, 78vw" alt={tx(photo.alt)} width={photo.w} height={photo.h} loading="lazy" decoding="async" />
                ) : (
                  <BottleArt variant={w.variant} className="wine__bottle" />
                )}
              </div>
              <div className="wine__info">
                <small className="wine__no">{String(i + 1).padStart(2, '0')}</small>
                <h3>
                  <span className="wine__swatch" style={{ background: w.accent }} aria-hidden="true" />
                  {w.name}
                </h3>
                <dl>
                  {rows.map((k) => (
                    <div key={k} className={val(w, k) ? '' : 'is-empty'}>
                      <dt>{c.ui.wineRows[k]}</dt>
                      <dd className={val(w, k) ? '' : 'is-soon'}>{val(w, k) || W.soon}</dd>
                    </div>
                  ))}
                </dl>
                <p className="wine__more">{c.ui.wineMore}</p>
              </div>
            </article>
          )
        })}
      </div>
    </section>
  )
}
