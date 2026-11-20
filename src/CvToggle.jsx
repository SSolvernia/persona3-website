import { useCallback } from 'react'
import { useNavigate } from 'react-router-dom'
import { useLang } from './lang'
import { play, syncMusic } from './sound'
import { PORTFOLIO } from './routes'

// The way out of the game, back to the classic CV, above the sound toggle:
// click it or press C on any game page. Same look and the same rule as the
// sound toggle: it never takes focus, since the pages listen for Enter on the
// window.
export default function CvToggle() {
  const navigate = useNavigate()
  const lang = useLang()

  const leave = useCallback(() => {
    play('back')
    navigate(PORTFOLIO)
    syncMusic()
  }, [navigate])

  // The C key lives as long as the button is on screen: the ref adds the
  // listener when it mounts and its cleanup removes it.
  const listenForKey = useCallback(
    (el) => {
      if (!el) return
      const onKey = (e) => {
        if (e.key.toLowerCase() === 'c' && !e.repeat && !e.metaKey && !e.ctrlKey && !e.altKey) leave()
      }
      window.addEventListener('keydown', onKey)
      return () => window.removeEventListener('keydown', onKey)
    },
    [leave],
  )

  return (
    <button
      ref={listenForKey}
      type="button"
      className="sound-toggle cv-toggle"
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={leave}
      aria-keyshortcuts="C"
    >
      <span className="sound-toggle-key">C</span>
      <span>{lang === 'es' ? 'VERSIÓN CLÁSICA' : 'CLASSIC VERSION'}</span>
    </button>
  )
}
