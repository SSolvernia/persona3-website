// The site language, English or Spanish, shared by every page.
//
// Read it in a component with `useLang()`; change it with `setLang()` (the
// selector on the menu) or the L key anywhere. The choice is remembered.
import { useSyncExternalStore } from 'react'

export const LANGS = ['en', 'es']
const STORAGE_KEY = 'p3-lang'
const listeners = new Set()

function readLang() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    if (LANGS.includes(saved)) return saved
  } catch {
    // Private mode: fall back to the browser language.
  }
  return navigator.language?.toLowerCase().startsWith('es') ? 'es' : 'en'
}

let lang = readLang()
document.documentElement.lang = lang

export const getLang = () => lang

export function setLang(next) {
  if (next === lang || !LANGS.includes(next)) return
  lang = next
  document.documentElement.lang = lang
  try {
    localStorage.setItem(STORAGE_KEY, lang)
  } catch {
    // The choice just will not survive a reload.
  }
  listeners.forEach((notify) => notify())
}

function subscribe(notify) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

export const useLang = () => useSyncExternalStore(subscribe, getLang)

// Picks the text of the current language from an { en, es } pair.
export const pick = (texts, current) => texts[current] ?? texts.en

function onShortcut(e) {
  if (e.key.toLowerCase() === 'l' && !e.repeat && !e.metaKey && !e.ctrlKey && !e.altKey) {
    setLang(lang === 'en' ? 'es' : 'en')
  }
}
window.addEventListener('keydown', onShortcut)

if (import.meta.hot) {
  import.meta.hot.dispose(() => window.removeEventListener('keydown', onShortcut))
}
