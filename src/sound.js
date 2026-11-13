// Sound for the whole site: short UI effects plus looping background music.
//
// Browsers refuse to make any sound until the visitor presses a key or clicks,
// so everything here starts on that first interaction. `play(name)` is safe to
// call at any time; it is simply silent until then, or while sound is off.
import bgmUrl from './assets/bgm.mp3'
import cursorUrl from './assets/sfx/cursor.mp3'
import confirmUrl from './assets/sfx/confirm.mp3'
import openUrl from './assets/sfx/open.mp3'
import backUrl from './assets/sfx/back.mp3'
import showUrl from './assets/sfx/show.mp3'
import hideUrl from './assets/sfx/hide.mp3'
import tabUrl from './assets/sfx/tab.mp3'
import toggleUrl from './assets/sfx/toggle.mp3'
import flyinUrl from './assets/sfx/flyin.mp3'

// Tune by ear here: which file each action plays and how loud (0 to 1).
// The files come from `npm run media -- audio` (scripts/optimize-media.sh).
const SFX = {
  cursor:  { url: cursorUrl,  volume: 0.6 }, // moving the selection
  confirm: { url: confirmUrl, volume: 0.6 }, // opening an external link
  open:    { url: openUrl,    volume: 0.7 }, // entering a page from the menu
  back:    { url: backUrl,    volume: 0.7 }, // leaving a page
  show:    { url: showUrl,    volume: 0.6 }, // revealing the About panel
  hide:    { url: hideUrl,    volume: 0.6 }, // closing it
  tab:     { url: tabUrl,     volume: 0.5 }, // switching column in Socials
  toggle:  { url: toggleUrl,  volume: 0.6 }, // turning sound on
  flyin:   { url: flyinUrl,   volume: 0.6 }, // the menu opening, once per visit
}
// Music is already quiet in the file itself (the gain in optimize-media.sh),
// because iOS ignores this value. Lower it here to tune on other browsers.
const MUSIC_VOLUME = 1

const STORAGE_KEY = 'p3-sound'
const listeners = new Set()

function readEnabled() {
  try {
    return localStorage.getItem(STORAGE_KEY) !== 'off'
  } catch {
    return true
  }
}

let enabled = readEnabled()
let ctx = null
const buffers = new Map()

// Streams from disk/network as it plays; nothing is fetched until play().
const music = new Audio()
music.preload = 'none'
music.loop = true
music.volume = MUSIC_VOLUME
music.src = bgmUrl

// The effects are a few KB each: fetch them up front so the first one is instant.
const bytes = Object.fromEntries(
  Object.entries(SFX).map(([name, { url }]) => {
    const data = fetch(url).then((res) => res.arrayBuffer())
    data.catch(() => {}) // a missing file just means that sound stays silent
    return [name, data]
  }),
)

function buffer(name) {
  if (!buffers.has(name)) {
    buffers.set(
      name,
      bytes[name].then(
        // Callback form: older Safari has no promise-returning decodeAudioData.
        (data) => new Promise((resolve, reject) => ctx.decodeAudioData(data, resolve, reject)),
      ),
    )
  }
  return buffers.get(name)
}

// Runs on every key press and click, not just the first: some events (Escape,
// the start of a touch) do not count as permission to play sound.
function unlock() {
  if (!enabled) return
  if (!ctx) {
    const AudioCtx = window.AudioContext || window.webkitAudioContext
    if (!AudioCtx) return
    ctx = new AudioCtx()
    Object.keys(SFX).forEach((name) => buffer(name).catch(() => {}))
    // The browser kept the page silent until now: open the menu with sound.
    if (!introPlayed) {
      introPlayed = true
      play('flyin', { late: true })
    }
  }
  if (ctx.state !== 'running') ctx.resume().catch(() => {})
  if (music.paused && !document.hidden) music.play().catch(() => {})
}

// `late`: play it even if decoding takes a moment (only for the intro, which
// follows no particular gesture).
export function play(name, { late = false } = {}) {
  if (!enabled || !ctx) return
  const asked = performance.now()
  buffer(name)
    .then((decoded) => {
      // A sound that could not start promptly would land out of sync; drop it.
      if (!enabled || (!late && performance.now() - asked > 150)) return
      const source = ctx.createBufferSource()
      const gain = ctx.createGain()
      source.buffer = decoded
      gain.gain.value = SFX[name].volume
      source.connect(gain)
      gain.connect(ctx.destination)
      source.start()
    })
    .catch(() => {})
}

export function toggleSound() {
  enabled = !enabled
  try {
    localStorage.setItem(STORAGE_KEY, enabled ? 'on' : 'off')
  } catch {
    // Private mode: the choice just will not survive a reload.
  }
  if (enabled) {
    unlock()
    play('toggle')
  } else {
    music.pause()
  }
  listeners.forEach((notify) => notify())
}

export const isSoundOn = () => enabled

export function subscribeSound(notify) {
  listeners.add(notify)
  return () => listeners.delete(notify)
}

function onShortcut(e) {
  if (e.key.toLowerCase() === 'm' && !e.repeat && !e.metaKey && !e.ctrlKey && !e.altKey) {
    toggleSound()
  }
}

// Do not keep playing in a background tab.
function onVisibility() {
  if (!ctx) return
  if (document.hidden) {
    music.pause()
    ctx.suspend().catch(() => {})
  } else if (enabled) {
    ctx.resume().catch(() => {})
    music.play().catch(() => {})
  }
}

// The fly-in of the menu, as the page opens. Most browsers refuse sound before
// the first key press or click; then it plays on that first one instead.
let introPlayed = false
if (enabled) {
  const intro = new Audio(flyinUrl)
  intro.volume = SFX.flyin.volume
  intro
    .play()
    .then(() => {
      introPlayed = true
    })
    .catch(() => {})
}

const UNLOCK_EVENTS = ['keydown', 'pointerdown', 'pointerup']
UNLOCK_EVENTS.forEach((type) => window.addEventListener(type, unlock, { capture: true }))
window.addEventListener('keydown', onShortcut)
document.addEventListener('visibilitychange', onVisibility)

// Dev only: when this file is edited, stop the old copy so music does not double up.
if (import.meta.hot) {
  import.meta.hot.dispose(() => {
    music.pause()
    ctx?.close()
    UNLOCK_EVENTS.forEach((type) => window.removeEventListener(type, unlock, { capture: true }))
    window.removeEventListener('keydown', onShortcut)
    document.removeEventListener('visibilitychange', onVisibility)
  })
}
