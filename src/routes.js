// The two halves of the site. The classic CV is the front door; the game
// (menu and its pages) opens from it.
export const PORTFOLIO = '/portfolio'
export const GAME = '/game'

const GAME_PAGES = [GAME, '/about', '/resume', '/socials', '/projects']

export const isGamePath = (path) =>
  GAME_PAGES.some((page) => path === page || path.startsWith(`${page}/`))
