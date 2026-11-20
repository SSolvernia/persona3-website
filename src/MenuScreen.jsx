import { useState, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { menuIntro, menuLoop } from './media'
import BgVideo from './BgVideo'
import P3Menu from './P3Menu'
import LangSelect from './LangSelect'

// The game's main menu (/game).
export default function MenuScreen() {
  const navigate = useNavigate()
  const [isLooping, setIsLooping] = useState(false)
  const loopRef = useRef(null)

  // The loop clip is mounted (and buffering) underneath from the start, so the
  // hand-off from the intro is instant instead of waiting on a new download.
  const handleIntroEnd = () => {
    loopRef.current?.play()?.catch(() => {})
    setIsLooping(true)
  }

  return (
    <div id="menu-screen">
      <BgVideo
        ref={loopRef}
        media={menuLoop}
        autoPlay={false}
        preload="auto"
      />
      {!isLooping && (
        <BgVideo media={menuIntro} loop={false} onEnded={handleIntroEnd} />
      )}
      <LangSelect />
      <P3Menu onNavigate={(page) => navigate(`/${page}`)} />
    </div>
  )
}
