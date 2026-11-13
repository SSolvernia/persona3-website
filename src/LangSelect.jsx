import { LANGS, setLang, useLang } from './lang'
import { play } from './sound'

// The box in the top-left corner of the menu, where the game shows the
// wallet: the current language, and ES / EN to switch (or the L key).
export default function LangSelect() {
  const lang = useLang()

  return (
    <div className="lang-select">
      <div className="lang-select-options" role="group" aria-label={lang === 'es' ? 'Idioma' : 'Language'}>
        {LANGS.map((code, i) => (
          <span key={code} className="lang-select-option-wrap">
            {i > 0 && <span className="lang-select-slash">/</span>}
            <button
              type="button"
              className={`lang-select-option${code === lang ? ' active' : ''}`}
              // Never take focus: the pages listen for Enter on the window.
              tabIndex={-1}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                if (code !== lang) play('cursor')
                setLang(code)
              }}
              aria-pressed={code === lang}
              lang={code}
            >
              {code.toUpperCase()}
            </button>
          </span>
        ))}
        <span className="lang-select-key" aria-hidden="true">L</span>
      </div>
      <div className="lang-select-caption">{lang === 'es' ? 'idioma actual' : 'current language'}</div>
    </div>
  )
}
