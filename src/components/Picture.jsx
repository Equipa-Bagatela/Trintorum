import { useI18n } from '../i18n/I18nProvider'

/** Imagem com lazy loading, proporções reservadas (sem CLS), máscara de reveal e parallax opcionais. */
export default function Picture({ image, mask = false, parallax = 0, eager = false, className = '', sizes = '100vw' }) {
  const { tx } = useI18n()
  if (!image) return null
  return (
    <div className={`pic ${className}`} data-mask={mask ? '' : undefined} style={{ aspectRatio: `${image.w} / ${image.h}` }}>
      <img
        src={image.src}
        srcSet={image.srcSet}
        alt={tx(image.alt)}
        width={image.w}
        height={image.h}
        loading={eager ? 'eager' : 'lazy'}
        decoding="async"
        sizes={sizes}
        data-parallax={parallax || undefined}
      />
    </div>
  )
}
