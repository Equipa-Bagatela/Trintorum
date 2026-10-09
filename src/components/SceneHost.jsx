import { Component, Suspense, useEffect, useRef, useState } from 'react'
import { hasWebGL } from '../lib/device'

class Boundary extends Component {
  state = { failed: false }
  static getDerivedStateFromError() {
    return { failed: true }
  }
  render() {
    return this.state.failed ? null : this.props.children
  }
}

/**
 * Monta a cena 3D (já em lazy) só quando se aproxima do viewport e
 * pausa o render loop quando sai do ecrã. `children` recebe (visible).
 */
export default function SceneHost({ className = '', rootMargin = '300px', children, ...rest }) {
  const ref = useRef(null)
  const [near, setNear] = useState(false)
  const [visible, setVisible] = useState(false)
  const inView = useRef(false)
  const [ok] = useState(() => hasWebGL())

  useEffect(() => {
    const el = ref.current
    if (!el || !ok) return
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting
        setVisible(e.isIntersecting && !document.hidden)
        if (e.isIntersecting) setNear(true)
      },
      { rootMargin },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [ok, rootMargin])

  // pausa também com o separador em segundo plano
  useEffect(() => {
    const onVis = () => setVisible(inView.current && !document.hidden)
    document.addEventListener('visibilitychange', onVis)
    return () => document.removeEventListener('visibilitychange', onVis)
  }, [])

  return (
    <div ref={ref} className={className} {...rest}>
      {ok && near && (
        <Boundary>
          <Suspense fallback={null}>{children(visible)}</Suspense>
        </Boundary>
      )}
    </div>
  )
}
