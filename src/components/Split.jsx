/** Divide texto em palavras para o reveal de título (animado via [data-split] em lib/motion). */
export default function Split({ as: Tag = 'span', children, className = '', ...rest }) {
  const text = String(children)
  return (
    <Tag className={`split ${className}`} data-split {...rest}>
      <span className="sr">{text.replace(/\n/g, ' ')}</span>
      {text.split('\n').map((line, li, arr) => (
        <span className="split__line" aria-hidden="true" key={li}>
          {line.split(' ').map((w, i) => (
            <span key={i}>
              <span className="split__w">
                <span className="split__i">{w}</span>
              </span>{' '}
            </span>
          ))}
          {li < arr.length - 1 && <br />}
        </span>
      ))}
    </Tag>
  )
}
