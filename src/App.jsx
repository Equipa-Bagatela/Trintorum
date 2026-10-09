import { useEffect, useLayoutEffect, useState } from 'react'
import { initScrollAnimations, ScrollTrigger } from './lib/motion'
import AgeGate, { isAgeConfirmed } from './components/AgeGate'
import Cursor from './components/Cursor'
import Navbar from './components/Navbar'
import Hero from './components/Hero'
import Story from './components/Story'
import Territory from './components/Territory'
import WineCollection from './components/WineCollection'
import Craft from './components/Craft'
import BottleSection from './components/BottleSection'
import Lifestyle from './components/Lifestyle'
import Contact from './components/Contact'
import Footer from './components/Footer'

export default function App() {
  const [entered, setEntered] = useState(isAgeConfirmed)

  // animações globais de scroll (criadas depois das dos filhos, para respeitar a ordem dos pins)
  // (só depois do age gate: no primeiro carregamento ninguém as vê e assim não pesam)
  useLayoutEffect(() => {
    if (!entered) return
    const mm = initScrollAnimations()
    return () => mm.revert()
  }, [entered])

  // as imagens lazy mudam a altura da página: recalcula os triggers uma só vez, já depois do age gate
  // (assim o primeiro carregamento não paga este custo)
  useEffect(() => {
    if (!entered) return
    const idle = window.requestIdleCallback || ((fn) => setTimeout(fn, 600))
    let cancelled = false
    const refresh = () => idle(() => !cancelled && ScrollTrigger.refresh())
    if (document.readyState === 'complete') refresh()
    else window.addEventListener('load', refresh, { once: true })
    return () => {
      cancelled = true
      window.removeEventListener('load', refresh)
    }
  }, [entered])

  return (
    <>
      {!entered && <AgeGate onEnter={() => setEntered(true)} />}
      <Cursor />
      <Navbar />
      <main>
        <Hero entered={entered} />
        <Story />
        <Territory />
        <WineCollection />
        <Craft />
        <BottleSection />
        <Lifestyle />
        <Contact />
      </main>
      <Footer />
    </>
  )
}
