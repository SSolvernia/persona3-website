# AGENTS.md

Personal portfolio of Juan Diego Ortega, in two halves:

- **Classic CV** at `/portfolio`, the front door (`/` and any unknown path redirect there).
  Code in `src/cv/`. A scrolling page styled as a court filing on pleading paper.
- **Game mode**, a fan-made Persona 3 style menu at `/game`, with `/about`, `/resume`,
  `/socials` and `/projects`. These pages are lazy-loaded from `src/App.jsx`.

React 19 + Vite + react-router, deployed on Vercel as an SPA (`vercel.json` rewrites).
Every visible text exists in English and Spanish (`src/lang.js`, `useLang()`).

## Where things live

- `src/routes.js`: the route constants and `isGamePath()`. Sound and the corner controls only
  exist on game paths.
- `src/data/`: data shared by both halves, like projects and links. Edit it here rather than
  copying it into a page.
- `src/cv/content.js`: all CV text (en/es).
- `src/sound.js`: music and effects. It stays silent off the game paths, and `syncMusic()`
  runs after switching halves.
- `src/CvToggle.jsx`: the way back to the CV from the game, with the C key.

## Rules

- **No `useEffect`** unless strictly needed and approved by the user. Prefer event handlers,
  derived state, `useSyncExternalStore`, and ref callbacks with cleanup (see `CvToggle.jsx`).
- Keep both languages in sync when adding text.
- Game pages listen for keys on `window`. Controls placed over them must not take focus
  (`tabIndex={-1}`, `preventDefault` on mousedown).
- Comments follow the house style already in the code: plain sentences explaining why.
- Run `npm run build` and `npm run lint` before finishing. The lint error in
  `src/PageTransition.jsx` was already there.

## ui-sdk

The CV uses ui-sdk (`@ui-sdk/react` + `@ui-sdk/core`, beta) for Button, Segmented Control,
Tooltip, Toast, Timeline, Dialog and Carousel. They are unstyled; styles are in `src/cv/cv.css`.

Before using ui-sdk, follow the ui-sdk skill if it's installed (`.agents/skills/ui-sdk`,
restored from `skills-lock.json` with `npx skills experimental_install`), and read
`node_modules/@ui-sdk/react/docs/llms.txt`. To build a new component, also search
`node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it.
