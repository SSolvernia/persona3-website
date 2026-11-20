# Juan Ortega — Portfolio

A personal portfolio in two halves, both in English and Spanish:

- **Classic CV** (`/portfolio`, the front page): one scrolling page laid out as
  a court filing on pleading paper, on a desk.
- **Game mode** (`/game`): a menu styled after *Persona 3 Reload* over a
  looping video, and one page per section (About, Resume, Socials, Side
  Projects), driven by the keyboard or the mouse, with the game's UI sounds.
  Press C (or the button in the corner) to go back to the CV.

## Credits

- Based on the original Persona 3 website by **blairxu13**:
  https://github.com/blairxu13/persona3-website. All credit for the original
  idea and design goes to them.
- *Persona 3*, its characters, art, music and sounds belong to © ATLUS © SEGA.
  This is a fan-made, non-commercial portfolio; the notice at the bottom of
  every page says so.
- The Side Projects backdrop is "Persona 3 Reload - Clean Skills Menu Loop
  (Wallpaper Engine)" by kecox, cut down to one loop.

## Running it

```sh
npm install
npm run dev       # local server with hot reload
npm run build     # production build in dist/
npm run preview   # serve the build
```

It deploys to Vercel as a static site: `vercel.json` sends every route to
`index.html` (the pages are client-side routes) and caches the hashed files
in `/assets` for a year.

## Architecture

Vite + React 19, with `react-router-dom` for the pages and `framer-motion` for
the transitions between them. The CV's controls (language switch, tooltips,
the exhibit viewer, toasts, the timeline) come from
[ui-sdk](https://ui-sdk.dev), unstyled, styled in `src/cv/cv.css`. There is no
backend: everything is static.

```
index.html            title, favicon, Google Fonts
src/
  main.jsx            mounts <App> inside the router
  App.jsx             routes, page transitions, and the game's corner
                      controls (CV switch, sound toggle, rights notice)
  routes.js           /portfolio, /game, and which paths belong to the game
  cv/                 /portfolio  the classic CV: CvPage, Exhibit, Desk
                      (paperclip, stamp, coffee ring), content.js, cv.css
  data/               projects and links, shared by the CV and the game
  MenuScreen.jsx      /game      the menu screen
  CvToggle.jsx        back to the CV from the game (C key)
  P3Menu.jsx          the main menu
  AboutMe.jsx         /about     party list + status screen of each entry
  ResumePage.jsx      /resume    sections and their detail panel
  Socials.jsx         /socials   networks
  SideProjects.jsx    /projects  projects with an auto-playing carousel
  PageTransition.jsx  the wipe between pages
  BgVideo.jsx         background video (WebM with MP4 fallback)
  KeyHints.jsx        key reminders in the bottom-right corner
  LangSelect.jsx      language box on the menu
  SoundToggle.jsx     sound on/off button
  Disclaimer.jsx      rights notice
  lang.js             current language (shared store)
  sound.js            UI sounds and music (shared store)
  media.js            which video each page uses
  assets/             web-ready media, generated (see Media)
scripts/
  optimize-media.sh   turns the originals into the files in src/assets
```

How the pieces fit:

- **One file per page.** Each game page holds its own content in a table at
  the top of the file (`PARTY`, `ITEMS`) and its own CSS in a `<style>`
  block. Changing the content means editing only that table. Projects and
  links live in `src/data/`, since the CV shows them too.
- **Keyboard first.** Every page listens for keys on `window` (arrows, Enter,
  Esc, plus A/D and Space on About). Buttons never take focus, so Enter is
  always handled once, by the page.
- **Shared state without a library.** The language (`lang.js`) and the sound
  setting (`sound.js`) are small modules read with `useSyncExternalStore` and
  saved in `localStorage`. `L` switches the language and `M` the sound,
  anywhere on the site.
- **Two languages.** Each text has an `en` and an `es` version next to each
  other in the page tables; `KeyHints` translates the action names itself.
  The first visit follows the browser language.
- **Sound.** Browsers block audio until the first key press or click, so
  `sound.js` unlocks it then; effects are decoded up front so they play
  instantly, and the music streams.

## Media

The site uses the files in `src/assets`, already compressed for the web (short
seamless video loops in WebM + MP4, images in WebP, music and UI sounds in MP3).

The heavy originals are only needed to re-export that media and are not in
git. Put them in `media-src/` (UI sounds come from `Persona 3 Reload SFX/`)
and run `npm run media` (needs `ffmpeg` and `cwebp`); the settings for each
file are at the bottom of `scripts/optimize-media.sh`. Which sound plays for
each action, and how loud, is the table at the top of `src/sound.js`.

The About page list is the `PARTY` table at the top of `src/AboutMe.jsx`: one
row per entry, with its text, its role (`LEADER`, `PARTY`, `NAVI` or none) and
its two images. `LEADER` and `NAVI` are fixed; `PARTY` only sets who starts in
the party, since visitors can add or remove members with Space (up to three).
The side portrait on each bar is made from the battle graphics in
`media-src/battle/`, over a beam of each member's colour; the bust shown when
an entry is opened is the whole status-screen sprite from
`media-src/status-portraits/`, over the member's `color`. The small icons of
the Socials rows come from `media-src/icons/`.

The Side Projects page (`/projects`) is the `PROJECTS` table at the top of
`src/SideProjects.jsx`: one row per project, with its text, link and captures,
which the card cycles through on its own (screenshots go in
`media-src/projects/`).

The favicon is `public/favicon.png` (and `apple-touch-icon.png`), from the
"A Most Remarkable Guest" achievement icon.
