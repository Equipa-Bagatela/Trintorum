import { useI18n } from '../i18n/I18nProvider'
import { images } from '../data/images'
import Picture from './Picture'
import Split from './Split'

export default function Lifestyle() {
  const { c } = useI18n()
  const L = c.lifestyle
  const [imgA, imgB, imgC, imgD] = images.lifestyle
  return (
    <section id="experience" className="life section" aria-labelledby="life-title">
      <header className="life__head">
        <p className="label">{L.label}</p>
        <h2 id="life-title" className="display display--lg">
          <Split as="span" className="block">
            {L.title[0]}
          </Split>
          <Split as="span" className="block life__sub">
            {L.title[1]}
          </Split>
        </h2>
      </header>
      <div className="life__grid">
        <figure className="life__a">
          <Picture image={imgA} mask parallax={7} sizes="(min-width: 900px) 34vw, 90vw" />
          <figcaption>{L.captions[0]}</figcaption>
        </figure>
        <figure className="life__b">
          <Picture image={imgB} mask parallax={5} sizes="(min-width: 900px) 44vw, 90vw" />
          <figcaption>{L.captions[1]}</figcaption>
        </figure>
        <figure className="life__c">
          <Picture image={imgC} mask parallax={8} sizes="(min-width: 900px) 60vw, 100vw" />
          <figcaption>{L.captions[2]}</figcaption>
        </figure>
        <figure className="life__d">
          <Picture image={imgD} mask parallax={4} sizes="(min-width: 900px) 30vw, 70vw" />
          <figcaption>{L.captions[3]}</figcaption>
        </figure>
      </div>
    </section>
  )
}
