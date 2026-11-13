import { useState, useRef } from 'react'
import { Routes, Route, useLocation, useNavigate } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import { menuIntro, menuLoop } from './media'
import BgVideo from './BgVideo'
import P3Menu from './P3Menu'
import SoundToggle from './SoundToggle'
import LangSelect from './LangSelect'
import Disclaimer from './Disclaimer'
import ResumePage from './ResumePage'
import PageTransition from './PageTransition'
import Socials from './Socials'
import AboutMe from './AboutMe'
import SideProjects from './SideProjects'
import './App.css'

function MenuScreen() {
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

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={
          <PageTransition><MenuScreen /></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition variant="about"><AboutMe /></PageTransition>
        } />
        <Route path="/resume" element={
          <PageTransition><ResumePage /></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Socials /></PageTransition>
        } />
        <Route path="/projects" element={
          <PageTransition><SideProjects /></PageTransition>
        } />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <>
      <AnimatedRoutes />
      <SoundToggle />
      <Disclaimer />
    </>
  )
}
