import { useSyncExternalStore } from 'react'
import { isSoundOn, subscribeSound, toggleSound } from './sound'
import { useLang } from './lang'

export default function SoundToggle() {
  const on = useSyncExternalStore(subscribeSound, isSoundOn)
  const lang = useLang()

  return (
    <button
      type="button"
      className="sound-toggle"
      // Never take focus: the pages listen for Enter on the window, and a
      // focused button would also fire on it. The M key covers the keyboard.
      tabIndex={-1}
      onMouseDown={(e) => e.preventDefault()}
      onClick={(e) => {
        e.currentTarget.blur()
        toggleSound()
      }}
      aria-pressed={on}
      aria-keyshortcuts="M"
    >
      <span className="sound-toggle-key">M</span>
      <span>{lang === 'es' ? on ? 'CON SONIDO' : 'SIN SONIDO' : `SOUND ${on ? 'ON' : 'OFF'}`}</span>
    </button>
  )
}
