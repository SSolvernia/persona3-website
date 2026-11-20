// The things lying on the desk with the CV: a paperclip on the stack, a
// coffee ring on the first sheet and a rubber stamp in the caption. Pure
// decoration, hidden from screen readers and from print.

export function Paperclip() {
  return (
    <svg className="cv-clip" viewBox="0 0 40 120" aria-hidden="true">
      <defs>
        <linearGradient id="cv-clip-metal" x1="0" x2="1">
          <stop offset="0" stopColor="#8c9196" />
          <stop offset="0.45" stopColor="#f2f4f5" />
          <stop offset="0.6" stopColor="#b9bec2" />
          <stop offset="1" stopColor="#6d7378" />
        </linearGradient>
      </defs>
      <path
        d="M15 38 V96 a9 9 0 0 0 18 0 V18 a12 12 0 0 0 -24 0 V88"
        fill="none"
        stroke="url(#cv-clip-metal)"
        strokeWidth="3.4"
        strokeLinecap="round"
      />
    </svg>
  );
}

// An uneven ring, the way a mug leaves it: the edge is pushed around by noise.
export function CoffeeRing() {
  return (
    <svg className="cv-coffee" viewBox="0 0 200 200" aria-hidden="true">
      <defs>
        <filter id="cv-coffee-edge" x="-20%" y="-20%" width="140%" height="140%">
          <feTurbulence type="fractalNoise" baseFrequency="0.035" numOctaves="3" seed="7" />
          <feDisplacementMap in="SourceGraphic" scale="9" />
          <feGaussianBlur stdDeviation="0.6" />
        </filter>
        <radialGradient id="cv-coffee-fill">
          <stop offset="0.82" stopColor="#8a5a2b" stopOpacity="0.05" />
          <stop offset="0.95" stopColor="#8a5a2b" stopOpacity="0.22" />
          <stop offset="1" stopColor="#6e4219" stopOpacity="0.5" />
        </radialGradient>
      </defs>
      <g filter="url(#cv-coffee-edge)">
        <circle cx="100" cy="100" r="78" fill="url(#cv-coffee-fill)" />
        <circle cx="100" cy="100" r="78" fill="none" stroke="#6e4219" strokeOpacity="0.35" strokeWidth="2.2" />
        <path d="M30 128 a78 78 0 0 0 52 48" fill="none" stroke="#6e4219" strokeOpacity="0.25" strokeWidth="5" />
      </g>
    </svg>
  );
}

// A receiving stamp with today's date, in red ink that did not take
// everywhere (the mask in cv.css).
export function Stamp({ lang, words }) {
  const date = new Intl.DateTimeFormat(lang, { day: "2-digit", month: "short", year: "numeric" })
    .format(new Date())
    .replace(/\./g, "")
    .toUpperCase();

  return (
    <div className="cv-stamp" aria-hidden="true">
      <span className="cv-stamp-top">{words.top}</span>
      <span className="cv-stamp-date">{date}</span>
      <span className="cv-stamp-bottom">{words.bottom}</span>
    </div>
  );
}
