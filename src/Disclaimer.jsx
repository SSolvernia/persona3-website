import { useLang } from './lang'

const TEXT = {
  en: 'Persona 3, its characters, art, music and sounds belong to © ATLUS © SEGA. Fan-made, non-commercial portfolio.',
  es: 'Persona 3, sus personajes, arte, música y sonidos pertenecen a © ATLUS © SEGA. Portafolio hecho por un fan, sin fines comerciales.',
}

// The rights notice along the bottom edge of every page.
export default function Disclaimer() {
  const lang = useLang()
  return <p className="disclaimer">{TEXT[lang]}</p>
}
