import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { sideProjectsBg } from "./media";
import { play } from "./sound";
import BgVideo from "./BgVideo";
import KeyHints from "./KeyHints";
import iconPlant from "./assets/icon-plant.webp";
import shotGrimorio from "./assets/shot-grimorio.webp";
import shotGrimorioClases from "./assets/shot-grimorio-clases.webp";
import shotGrimorioFicha from "./assets/shot-grimorio-ficha.webp";
import shotUnsubDashboard from "./assets/shot-unsub-dashboard.webp";
import shotUnsubSuscripciones from "./assets/shot-unsub-suscripciones.webp";
import shotUnsubRecordatorios from "./assets/shot-unsub-recordatorios.webp";
import shotPollanzasDashboard from "./assets/shot-pollanzas-dashboard.webp";
import shotPollanzasReportes from "./assets/shot-pollanzas-reportes.webp";
import shotPollanzasAjustes from "./assets/shot-pollanzas-ajustes.webp";

// One row per project, top to bottom. To add one, add a row here:
//   name         text on the row and title of the card
//   group        small label: the site or product it belongs to
//   description  text of the card
//   href         page that Enter / a click opens, in a new tab
//   shots        captures shown on the card, in turn, on their own. Put each
//                screenshot in media-src/projects/, add an `image shot-...`
//                line to scripts/optimize-media.sh and run
//                `npm run media -- images`.
const PROJECTS = [
  {
    id: "compendio",
    name: "Compendio D&D",
    group: "Dungeons & Dragons 2024",
    description: "Compendio de Dungeons & Dragons (reglas 2024) en español: biblioteca de conjuros y guías de clases.",
    href: "https://compendio-dnd.losjuan.com/grimorio",
    shots: [shotGrimorio, shotGrimorioClases, shotGrimorioFicha],
  },
  {
    id: "unsub",
    name: "UnsubTracker",
    group: "Suscripciones",
    description: "Controla y gestiona todas tus suscripciones en un solo lugar.",
    href: "https://unsub.losjuan.com/es/",
    shots: [shotUnsubDashboard, shotUnsubSuscripciones, shotUnsubRecordatorios],
  },
  {
    id: "pollanzas",
    name: "Pollanzas Personales",
    group: "Finanzas",
    description: "Controla tus ingresos y gastos mes a mes.",
    href: "https://pollanzas.losjuan.com/es",
    shots: [shotPollanzasDashboard, shotPollanzasReportes, shotPollanzasAjustes],
  },
];

// The page takes the keyboard by holding focus itself, from the moment it is
// on screen, so arrows and Enter work without clicking first.
const focusOnMount = (el) => el?.focus({ preventScroll: true });

// Seconds each capture stays on the card before the next one slides in.
const SLIDE_SECONDS = 3.5;

// The carousel runs on CSS alone: every capture plays the same loop, offset
// by its turn. Over one loop (all captures) it slides in from the right,
// holds, then slides out to the left and waits off-card for its next turn.
function carouselKeyframes(count) {
  const turn = 100 / count;
  const move = Math.min(12, turn / 4); // the slide, as part of the loop
  return `@keyframes sp-carousel-${count} {
    0%      { transform: translateX(100%); }
    ${move}%   { transform: translateX(0); }
    ${turn}%   { transform: translateX(0); }
    ${turn + move}% { transform: translateX(-100%); }
    100%    { transform: translateX(-100%); }
  }
  @keyframes sp-dot-${count} {
    0%, ${turn}% { background: #fff; }
    ${turn + 0.01}%, 100% { background: rgba(255, 255, 255, 0.3); }
  }`;
}

// Animation of the capture (or its dot) at position `i` of `count`. Each one
// starts a turn after the one before it; all start one slide early, so the
// first capture is already on the card when the page opens.
function slideStyle(name, i, count) {
  if (count < 2) return undefined;
  const loop = count * SLIDE_SECONDS;
  const slide = (loop * Math.min(12, 100 / count / 4)) / 100;
  return {
    animationName: `${name}-${count}`,
    animationDuration: `${loop}s`,
    animationDelay: `${i * SLIDE_SECONDS - slide}s`,
    animationIterationCount: "infinite",
    animationTimingFunction: name === "sp-dot" ? "step-end" : "cubic-bezier(0.65, 0, 0.35, 1)",
    // Before its first turn a capture waits off the card (the loop's first
    // frame); a dot just stays dim.
    animationFillMode: name === "sp-dot" ? "none" : "backwards",
  };
}

export default function SideProjects() {
  const [active, setActive] = useState(0);
  const navigate = useNavigate();
  const project = PROJECTS[active];

  const select = (i) => {
    if (i !== active) play("cursor");
    setActive(i);
  };
  const open = (item) => {
    play("confirm");
    window.open(item.href, "_blank", "noopener");
  };

  const onKeyDown = (e) => {
    if (e.key === "ArrowUp") select(Math.max(0, active - 1));
    if (e.key === "ArrowDown") select(Math.min(PROJECTS.length - 1, active + 1));
    if (e.key === "Enter") open(project);
    if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") {
      play("back");
      navigate(-1);
    }
  };

  return (
    <div id="menu-screen" className="sp-screen" tabIndex={-1} ref={focusOnMount} onKeyDown={onKeyDown}>
      <BgVideo media={sideProjectsBg} />
      <style>{`
        .sp-screen { outline: none; }

        /* The backdrop is white on the left and dark blue on the right, so
           the title sits on its own black slab to stay readable on both. */
        .sp-title {
          position: absolute;
          top: 6vh;
          left: 0;
          z-index: 10;
          padding: 0.6vh 46px 0.2vh 3vw;
          background: #111;
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          border-top: 5px solid #c4001a;
          font-family: 'Anton', sans-serif;
          font-size: clamp(30px, 6.4vh, 64px);
          line-height: 1.15;
          letter-spacing: 1px;
          color: #fff;
          user-select: none;
          pointer-events: none;
          animation: sp-row-in 0.5s cubic-bezier(0.22, 1, 0.36, 1) both;
        }

        @keyframes sp-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sp-row-in {
          from { transform: translateX(-100%); }
          to   { transform: translateX(0); }
        }
        @keyframes sp-card-in {
          0%   { opacity: 0; transform: translate(40px, -50%); }
          60%  { opacity: 1; transform: translate(-4px, -50%); }
          100% { opacity: 1; transform: translate(0, -50%); }
        }

        /* ── List of projects, on the left ── */
        .sp-list {
          position: absolute;
          left: 0;
          top: 50%;
          transform: translateY(-50%);
          z-index: 10;
          display: flex;
          flex-direction: column;
          /* Row height follows the window height, like the other pages. */
          --bar: clamp(40px, 7.4vh, 68px);
          gap: calc(var(--bar) * 0.1);
        }

        .sp-row {
          position: relative;
          width: 36vw;
          height: var(--bar);
          cursor: pointer;
          transition: height 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          animation: sp-row-in 0.55s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sp-row.active { height: calc(var(--bar) * 1.3); }

        /* red underlay that peeks out above the selected row */
        .sp-row-red {
          position: absolute;
          inset: 0;
          background: #c4001a;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .sp-row.active .sp-row-red { opacity: 1; }

        .sp-row-slab {
          position: absolute;
          inset: 0;
          background: #111;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
        }
        /* white fill that sweeps in from the right when selected */
        .sp-row-fill {
          position: absolute;
          inset: 0;
          background: #fff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 14px) 100%, calc(100% - 14px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sp-row.active .sp-row-fill {
          clip-path: polygon(calc(var(--bar) * 2.4) 0, 100% 0, calc(100% - 14px) 100%, calc(var(--bar) * 2.1) 100%);
        }

        .sp-row-content {
          position: relative;
          height: 100%;
          display: flex;
          align-items: center;
          gap: calc(var(--bar) * 0.4);
          padding: 0 30px 0 2.4vw;
        }
        .sp-row-icon {
          height: calc(var(--bar) * 0.42);
          width: auto;
          flex-shrink: 0;
          user-select: none;
          pointer-events: none;
        }
        .sp-row-name {
          flex: 1;
          min-width: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: calc(var(--bar) * 0.46);
          letter-spacing: 2px;
          line-height: 1;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          color: rgba(255, 255, 255, 0.88);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sp-row.active .sp-row-name { color: #111; }
        /* Only shown on the selected row; when hidden it takes no room, so
           long names still fit on the other rows. */
        .sp-row-go {
          display: none;
          flex-shrink: 0;
          font-family: 'Bebas Neue', sans-serif;
          font-size: calc(var(--bar) * 0.3);
          letter-spacing: 1.5px;
          line-height: 1;
          padding: 4px 9px 2px;
          border-radius: 4px;
          background: #000;
          color: #fff;
          opacity: 0;
          transition: opacity 0.2s ease;
          user-select: none;
        }
        .sp-row.active .sp-row-go { display: block; opacity: 1; }

        /* ── Card of the selected project, on the right ── */
        .sp-card {
          position: absolute;
          right: 3.5vw;
          top: 50%;
          width: 32vw;
          transform: translateY(-50%);
          z-index: 10;
          display: block;
          background: #111;
          color: #fff;
          text-decoration: none;
          /* Offset red slab behind the card: shows only right and below, an L. */
          box-shadow: 9px 9px 0 rgba(196, 0, 26, 0.9);
          animation: sp-card-in 0.38s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sp-shots {
          position: relative;
          aspect-ratio: 16 / 10;
          overflow: hidden;
          background: #0b0b14;
        }
        .sp-shot {
          position: absolute;
          inset: 0;
          display: block;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: top left;
        }
        .sp-dots {
          position: absolute;
          left: 50%;
          bottom: 10px;
          transform: translateX(-50%);
          display: flex;
          gap: 6px;
          padding: 5px 8px;
          background: rgba(0, 0, 0, 0.55);
        }
        .sp-dot {
          width: 18px;
          height: 4px;
          background: rgba(255, 255, 255, 0.3);
        }
        /* Without motion: only the first capture, still. */
        @media (prefers-reduced-motion: reduce) {
          .sp-shot { animation: none !important; }
          .sp-shot ~ .sp-shot, .sp-dots { display: none; }
        }
        ${[...new Set(PROJECTS.map((p) => p.shots.length))].filter((n) => n > 1).map(carouselKeyframes).join("\n")}
        .sp-card-body { padding: 14px 20px 16px; }
        .sp-card-group {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 14px;
          letter-spacing: 2.5px;
          color: #7dd4fc;
        }
        .sp-card-name {
          font-family: 'Anton', sans-serif;
          font-size: clamp(22px, 2.2vw, 34px);
          line-height: 1.1;
          text-transform: uppercase;
          margin: 2px 0 8px;
        }
        .sp-card-text {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: clamp(13px, 1vw, 16px);
          line-height: 1.45;
          color: rgba(255, 255, 255, 0.86);
        }
        .sp-card-link {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 12px;
          margin-top: 12px;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 15px;
          letter-spacing: 1.5px;
          color: rgba(255, 255, 255, 0.5);
        }
        .sp-card-url {
          min-width: 0;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .sp-card-open {
          flex-shrink: 0;
          padding: 3px 9px 1px;
          background: #fff;
          color: #111;
        }

      `}</style>

      <div className="sp-title">SIDE PROJECTS</div>

      <div className="sp-list" role="navigation">
        {PROJECTS.map((item, i) => (
          <div
            key={item.id}
            className={`sp-row${active === i ? " active" : ""}`}
            // Each row slides in a little after the one above it.
            style={{ animationDelay: `${i * 70}ms` }}
            onMouseEnter={() => select(i)}
            onClick={() => open(item)}
          >
            <div className="sp-row-red" />
            <div className="sp-row-slab" />
            <div className="sp-row-fill" />
            <div className="sp-row-content">
              <img className="sp-row-icon" src={iconPlant} alt="" />
              <div className="sp-row-name">{item.name}</div>
              <div className="sp-row-go">OPEN</div>
            </div>
          </div>
        ))}
      </div>

      {/* A real link, so it can also be opened in the background or copied.
          It never takes focus: Enter is handled once, by the page. */}
      <a
        key={project.id}
        className="sp-card"
        href={project.href}
        target="_blank"
        rel="noopener"
        tabIndex={-1}
        onMouseDown={(e) => e.preventDefault()}
        onClick={() => play("confirm")}
      >
        <div className="sp-shots">
          {project.shots.map((shot, i, all) => (
            <img key={shot} className="sp-shot" src={shot} alt="" style={slideStyle("sp-carousel", i, all.length)} />
          ))}
          {project.shots.length > 1 && (
            <div className="sp-dots">
              {project.shots.map((shot, i, all) => (
                <span key={shot} className="sp-dot" style={slideStyle("sp-dot", i, all.length)} />
              ))}
            </div>
          )}
        </div>
        <div className="sp-card-body">
          <div className="sp-card-group">{project.group}</div>
          <div className="sp-card-name">{project.name}</div>
          <div className="sp-card-text">{project.description}</div>
          <div className="sp-card-link">
            <span className="sp-card-url">{project.href.replace(/^https?:\/\//, "")}</span>
            <span className="sp-card-open">↵ OPEN</span>
          </div>
        </div>
      </a>

      <KeyHints keys={[["↑↓", "SELECT"], ["↵", "OPEN"], ["ESC", "BACK"]]} />
    </div>
  );
}
