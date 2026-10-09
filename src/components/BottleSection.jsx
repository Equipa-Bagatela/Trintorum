import { lazy, useRef, useState } from 'react'
import { useI18n } from '../i18n/I18nProvider'
import SceneHost from './SceneHost'
import Split from './Split'

const BottleViewer = lazy(() => import('../three/BottleViewer'))

export default function BottleSection() {
  const { c } = useI18n()
  const B = c.bottle
  const [active, setActive] = useState(null)
  const drag = useRef({ active: false, dx: 0, x: 0 })
  const focus = B.details.find((d) => d.id === active) || null

  const down = (e) => {
    drag.current.active = true
    drag.current.x = e.clientX
    e.currentTarget.setPointerCapture?.(e.pointerId)
  }
  const move = (e) => {
    if (!drag.current.active) return
    drag.current.dx += e.clientX - drag.current.x
    drag.current.x = e.clientX
  }
  const up = () => {
    drag.current.active = false
  }

  return (
    <section id="bottle" className="bottle section" aria-labelledby="bottle-title">
      <div className="bottle__grid">
        <div className="bottle__viewer" onPointerDown={down} onPointerMove={move} onPointerUp={up} onPointerCancel={up} data-cursor={c.ui.cursorDrag}>
          <SceneHost className="bottle__canvas">{(visible) => <BottleViewer visible={visible} focus={focus} dragRef={drag} />}</SceneHost>
          <span className="bottle__hint" aria-hidden="true">
            {c.ui.bottleHint}
          </span>
        </div>

        <div className="bottle__panel">
          <p className="label">{B.label}</p>
          <h2 id="bottle-title" className="display">
            <Split>{B.title}</Split>
          </h2>
          <p className="bottle__intro">
            {B.intro}
          </p>
          <ul className="bottle__list">
            {B.details.map((d) => (
              <li key={d.id}>
                <button aria-pressed={active === d.id} onClick={() => setActive(active === d.id ? null : d.id)}>
                  <span>{d.k}</span>
                  <i aria-hidden="true">{active === d.id ? '−' : '+'}</i>
                </button>
                <div className="bottle__detail" hidden={active !== d.id}>
                  <p>{d.t}</p>
                </div>
              </li>
            ))}
          </ul>
          <p className="bottle__note">{B.note}</p>
        </div>
      </div>
    </section>
  )
}
