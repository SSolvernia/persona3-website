import { lazy, Suspense } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { AnimatePresence } from 'framer-motion'
import SoundToggle from './SoundToggle'
import Disclaimer from './Disclaimer'
import PageTransition from './PageTransition'
import CvToggle from './CvToggle'
import CvPage from './cv/CvPage'
import { GAME, PORTFOLIO, isGamePath } from './routes'
import './App.css'

// The classic CV is the front door; the game's pages load only once someone
// opens the game.
const MenuScreen = lazy(() => import('./MenuScreen'))
const AboutMe = lazy(() => import('./AboutMe'))
const ResumePage = lazy(() => import('./ResumePage'))
const Socials = lazy(() => import('./Socials'))
const SideProjects = lazy(() => import('./SideProjects'))

// Black, like the game's backdrop, while a page's code arrives.
const Game = ({ children }) => (
  <Suspense fallback={<div id="menu-screen" />}>{children}</Suspense>
)

function AnimatedRoutes() {
  const location = useLocation()
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route path="/" element={<Navigate to={PORTFOLIO} replace />} />
        <Route path={PORTFOLIO} element={
          <PageTransition><CvPage /></PageTransition>
        } />
        <Route path={GAME} element={
          <PageTransition><Game><MenuScreen /></Game></PageTransition>
        } />
        <Route path="/about" element={
          <PageTransition variant="about"><Game><AboutMe /></Game></PageTransition>
        } />
        <Route path="/resume" element={
          <PageTransition><Game><ResumePage /></Game></PageTransition>
        } />
        <Route path="/socials" element={
          <PageTransition variant="socials"><Game><Socials /></Game></PageTransition>
        } />
        <Route path="/projects" element={
          <PageTransition><Game><SideProjects /></Game></PageTransition>
        } />
        {/* Anything unknown goes to the CV. */}
        <Route path="*" element={<Navigate to={PORTFOLIO} replace />} />
      </Routes>
    </AnimatePresence>
  )
}

export default function App() {
  // The corner controls belong to the game, not to the classic CV.
  const inGame = isGamePath(useLocation().pathname)
  return (
    <>
      <AnimatedRoutes />
      {inGame && (
        <>
          <CvToggle />
          <SoundToggle />
          <Disclaimer />
        </>
      )}
    </>
  )
}
