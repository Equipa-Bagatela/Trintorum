import { useI18n } from '../i18n/I18nProvider'
import { images } from '../data/images'
import Picture from './Picture'
import Split from './Split'

export default function Story() {
  const { c } = useI18n()
  const story = c.story
  return (
    <section id="story" className="story section" aria-labelledby="story-title">
      <div className="story__grid">
        <div className="story__text">
          <p className="label">{story.label}</p>
          <h2 id="story-title" className="display">
            <Split>{story.title}</Split>
          </h2>
          <div className="story__body">
            {story.body.map((p, i) => (
              <p key={i}>
                {p}
              </p>
            ))}
          </div>
        </div>
        <figure className="story__fig">
          <Picture image={images.story} mask sizes="(min-width: 900px) 55vw, 100vw" parallax={6} />
          <figcaption>{story.caption}</figcaption>
        </figure>
      </div>
    </section>
  )
}
