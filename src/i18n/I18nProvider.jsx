import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { content } from '../data/content'
import { themeState } from '../three/themeState'

const Ctx = createContext(null)
const root = typeof document !== 'undefined' ? document.documentElement : null

// Valores iniciais definidos por um script inline em index.html (evita "flash" de tema/idioma)
const initialLang = () => (root?.dataset.lang === 'en' ? 'en' : 'pt')
const initialTheme = () => (root?.dataset.theme === 'light' ? 'light' : 'dark')

const save = (k, v) => {
  try {
    localStorage.setItem(k, v)
  } catch {
    /* sem armazenamento: a preferência vale só nesta visita */
  }
}

export function I18nProvider({ children }) {
  const [lang, setLangState] = useState(initialLang)
  const [theme, setThemeState] = useState(initialTheme)

  useEffect(() => {
    root.lang = lang === 'pt' ? 'pt-PT' : 'en'
    root.dataset.lang = lang
    const m = content[lang].meta
    document.title = m.title
    document.querySelector('meta[name="description"]')?.setAttribute('content', m.description)
    document.querySelector('meta[property="og:title"]')?.setAttribute('content', m.title)
    document.querySelector('meta[property="og:description"]')?.setAttribute('content', m.description)
    save('trintorum-lang', lang)
  }, [lang])

  useEffect(() => {
    root.dataset.theme = theme
    themeState.mode = theme
    document.querySelector('meta[name="theme-color"]')?.setAttribute('content', theme === 'light' ? '#f4eed9' : '#080605')
    save('trintorum-theme', theme)
  }, [theme])

  const setLang = useCallback((l) => setLangState(l === 'en' ? 'en' : 'pt'), [])
  const toggleTheme = useCallback(() => setThemeState((t) => (t === 'dark' ? 'light' : 'dark')), [])

  const value = useMemo(() => {
    const c = content[lang]
    // alt de imagens: o texto em PT é a chave; em EN procura a tradução
    const tx = (s) => (lang === 'en' && s ? content.en.alts[s] || s : s)
    // 1,5 L → 1.5 L em inglês
    const num = (s) => (lang === 'en' && typeof s === 'string' ? s.replace(',', '.') : s)
    return { lang, setLang, theme, toggleTheme, c, tx, num }
  }, [lang, theme, setLang, toggleTheme])

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>
}

export const useI18n = () => useContext(Ctx)
