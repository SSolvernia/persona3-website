import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { aboutBg } from "./media";
import { play } from "./sound";
import BgVideo from "./BgVideo";
import KeyHints from "./KeyHints";
import makotoProfile from "./assets/makoto-profile.webp";
import junpeiProfile from "./assets/junpei-profile.webp";
import yukariProfile from "./assets/yukari-profile.webp";
import akihikoProfile from "./assets/akihiko-profile.webp";
import mitsuruProfile from "./assets/mitsuru-profile.webp";
import fuukaProfile from "./assets/fuuka-profile.webp";
import aigisProfile from "./assets/aigis-profile.webp";
import kenProfile from "./assets/ken-profile.webp";
import koromaruProfile from "./assets/koromaru-profile.webp";
import shinjiroProfile from "./assets/shinjiro-profile.webp";
import makotoBust from "./assets/makoto-bust.webp";
import junpeiBust from "./assets/junpei-bust.webp";
import yukariBust from "./assets/yukari-bust.webp";
import akihikoBust from "./assets/akihiko-bust.webp";
import mitsuruBust from "./assets/mitsuru-bust.webp";
import fuukaBust from "./assets/fuuka-bust.webp";
import aigisBust from "./assets/aigis-bust.webp";
import kenBust from "./assets/ken-bust.webp";
import koromaruBust from "./assets/koromaru-bust.webp";
import shinjiroBust from "./assets/shinjiro-bust.webp";

// The page language. Every text below has an English and a Spanish version;
// switch this to "es" (or wire it to a language picker later).
const LANG = "en";

// One row per entry of the list, top to bottom. To add, remove or reorder
// entries, edit only this table:
//   role      slanted word at the left of the bar. LEADER and NAVI are
//             fixed. PARTY marks who starts in the party; the visitor can
//             swap members with Space, up to PARTY_SIZE at a time. Without
//             a role the bar starts at the portrait's nose, as in the game.
//   profile   side portrait shown on the bar
//   portrait  bust shown when the entry is opened
//   face      where the face is across the bust, as a fraction of the
//             bust's height (the busts differ in width): the page lines
//             every face up at the same spot
//   color     the member's colour, behind that bust
//   en / es   the texts in each language:
//     label   text on the bar
//     upper   lines of the big black box
//     lower   line of the small black box
// The images come from `npm run media -- images` (scripts/optimize-media.sh).
const PARTY = [
  {
    id: "about", role: "LEADER", profile: makotoProfile, portrait: makotoBust, face: 0.26, color: "#1f74e0",
    en: {
      label: "ABOUT ME",
      upper: ["Juan Diego Ortega Alzate", "30 years old", "Front-end developer at Eventtia Inc."],
      lower: "lawyer turned developer",
    },
    es: {
      label: "SOBRE MÍ",
      upper: ["Juan Diego Ortega Alzate", "30 años", "Desarrollador front-end en Eventtia Inc."],
      lower: "de abogado a desarrollador",
    },
  },
  {
    id: "fun-fact", role: "PARTY", profile: junpeiProfile, portrait: junpeiBust, face: 0.44, color: "#2a4bf0",
    en: {
      label: "FUN FACT ABOUT ME",
      upper: ["Before writing code, I practiced law in Colombia.", "Four years as a lawyer, four years as a programmer."],
      lower: "from contracts to components",
    },
    es: {
      label: "DATO CURIOSO",
      upper: ["Antes de programar, ejercí como abogado en Colombia.", "Cuatro años en el derecho, cuatro años programando."],
      lower: "de contratos a componentes",
    },
  },
  {
    id: "weird-fact", role: "PARTY", profile: yukariProfile, portrait: yukariBust, face: 0.3, color: "#d330c2",
    en: {
      label: "WEIRD FACT ABOUT ME",
      upper: ["I mod games just for the fun of it.", "No reason needed: if it can be tweaked, I want to try."],
      lower: "modding for fun",
    },
    es: {
      label: "DATO RARO",
      upper: ["Modifico videojuegos solo por diversión.", "Sin más motivo: si se puede ajustar, quiero probarlo."],
      lower: "modding por diversión",
    },
  },
  // As in the game's party list: the order is fixed, PARTY marks the
  // members fighting next to the leader, and the navigator goes last.
  {
    id: "skills", profile: akihikoProfile, portrait: akihikoBust, face: 0.42, color: "#b8142e",
    en: {
      label: "SKILLS",
      upper: [
        "HTML, CSS and JavaScript",
        "React, Next.js and Vite",
        "Local and hosted LLMs, like Claude",
        "4 years of programming experience",
      ],
      lower: "the dev toolkit",
    },
    es: {
      label: "HABILIDADES",
      upper: [
        "HTML, CSS y JavaScript",
        "React, Next.js y Vite",
        "LLMs locales y en la nube, como Claude",
        "4 años de experiencia programando",
      ],
      lower: "el kit del desarrollador",
    },
  },
  {
    id: "work", profile: mitsuruProfile, portrait: mitsuruBust, face: 0.4, color: "#d03536",
    en: {
      label: "WORK",
      upper: ["Front-end developer at Eventtia Inc.", "Before that: lawyer in Colombia for 4 years"],
      lower: "current quest",
    },
    es: {
      label: "TRABAJO",
      upper: ["Desarrollador front-end en Eventtia Inc.", "Antes: abogado en Colombia durante 4 años"],
      lower: "misión actual",
    },
  },
  {
    id: "hobbies", role: "PARTY", profile: aigisProfile, portrait: aigisBust, face: 0.61, color: "#d8b52a",
    en: {
      label: "HOBBIES",
      upper: ["Building model kits", "Modding games, just for fun", "Video games and tabletop roleplaying"],
      lower: "off the clock",
    },
    es: {
      label: "HOBBIES",
      upper: ["Armar model kits", "Modificar juegos, solo por diversión", "Videojuegos y rol de mesa"],
      lower: "fuera del horario",
    },
  },
  {
    id: "games", profile: kenProfile, portrait: kenBust, face: 0.53, color: "#ed7a1f",
    en: {
      label: "GAMES",
      upper: [
        "The Persona series, Final Fantasy and NieR:Automata",
        "Baldur's Gate and Outer Wilds",
        "At the table: Dungeons & Dragons",
      ],
      lower: "roll for initiative",
    },
    es: {
      label: "JUEGOS",
      upper: [
        "La saga Persona, Final Fantasy y NieR:Automata",
        "Baldur's Gate y Outer Wilds",
        "En la mesa: Dungeons & Dragons",
      ],
      lower: "tira iniciativa",
    },
  },
  {
    id: "ai", profile: koromaruProfile, portrait: koromaruBust, face: 0.6, color: "#8f99ad",
    en: {
      label: "AI",
      upper: ["Running language models locally, on my own hardware", "Working with hosted models like Claude"],
      lower: "local + cloud LLMs",
    },
    es: {
      label: "IA",
      upper: ["Modelos de lenguaje corriendo en local, en mi propio equipo", "Trabajo con modelos en la nube como Claude"],
      lower: "LLMs locales y en la nube",
    },
  },
  {
    id: "goals", profile: shinjiroProfile, portrait: shinjiroBust, face: 0.67, color: "#8c1a33",
    en: {
      label: "GOALS",
      upper: ["Keep learning, always.", "Every new technology is the next dungeon to explore."],
      lower: "never stop learning",
    },
    es: {
      label: "METAS",
      upper: ["Seguir aprendiendo, siempre.", "Cada tecnología nueva es la próxima mazmorra por explorar."],
      lower: "nunca dejar de aprender",
    },
  },
  {
    id: "studies", role: "NAVI", profile: fuukaProfile, portrait: fuukaBust, face: 0.49, color: "#1fc496",
    en: {
      label: "STUDIES",
      upper: ["Law: lawyer in Colombia", "Programming: 4 years and counting"],
      lower: "two careers, one curious mind",
    },
    es: {
      label: "ESTUDIOS",
      upper: ["Derecho: abogado en Colombia", "Programación: 4 años y sumando"],
      lower: "dos carreras, una mente curiosa",
    },
  },
];

// How many members can fight next to the leader.
const PARTY_SIZE = 3;
const FIXED_ROLES = ["LEADER", "NAVI"];
const STARTING_PARTY = PARTY.filter((item) => item.role === "PARTY").map((item) => item.id);

export default function AboutMe() {
  const [active, setActive]   = useState(0);
  // Ids of the members in the party (the leader and navigator are not counted).
  const [party, setParty] = useState(STARTING_PARTY);
  // Bumped when a member can't join because the party is full; it restarts
  // the "PARTY FULL" flash on that bar.
  const [denied, setDenied] = useState(null);
  const [mounted, setMounted] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 60);
    return () => clearTimeout(t);
  }, []);

  const roleOf = (item) =>
    FIXED_ROLES.includes(item.role) ? item.role : party.includes(item.id) ? "PARTY" : null;

  useEffect(() => {
    const onKey = (e) => {
      const select = (i) => {
        if (i !== active) play("cursor");
        setActive(i);
      };
      const back = () => {
        play("back");
        navigate(-1);
      };
      // In the detail view, A / D step to the previous / next entry (wrapping
      // around), so every entry can be read without closing the panel.
      const key = e.key.toLowerCase();
      if (revealed && !e.metaKey && !e.ctrlKey && !e.altKey && (key === "a" || key === "d")) {
        play("tab");
        setActive((active + (key === "d" ? 1 : -1) + PARTY.length) % PARTY.length);
      }
      // Space adds the selected entry to the party or takes it out. Ignored on
      // a focused button, which Space presses on its own.
      if (e.key === " " && !revealed && !(e.target instanceof HTMLButtonElement)) {
        e.preventDefault();
        const item = PARTY[active];
        if (e.repeat || FIXED_ROLES.includes(item.role)) return;
        if (party.includes(item.id)) {
          play("hide");
          setParty(party.filter((id) => id !== item.id));
        } else if (party.length < PARTY_SIZE) {
          play("show");
          setParty([...party, item.id]);
        } else {
          setDenied({ index: active, n: (denied?.n ?? 0) + 1 });
        }
      }
      if (e.key === "ArrowUp") select(Math.max(0, active - 1));
      if (e.key === "ArrowDown") select(Math.min(PARTY.length - 1, active + 1));
      if (e.key === "Enter" || e.key === "ArrowRight") {
        if (!revealed) play("show");
        setRevealed(true);
      }
      // Back closes the detail panel first; only from the list does it leave the page.
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") {
        if (revealed) {
          play("hide");
          setRevealed(false);
        } else back();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, revealed, party, denied]);

  // Same as A / D, for a click on the letters shown in the detail view.
  const step = (by) => {
    play("tab");
    setActive((active + by + PARTY.length) % PARTY.length);
  };

  return (
    <div id="menu-screen">
      <BgVideo media={aboutBg} />
      {revealed && <div key={`dim-${active}`} className="sc-dim" />}
      {revealed && (
        <div key={`panel-${active}`} className={`sc-reveal-panel${mounted ? " mounted" : ""}`}>
          <div className="sc-reveal-upper-bar">
            {PARTY[active][LANG].upper.map((line) => (
              <div className="sc-reveal-upper-line" key={line}>{line}</div>
            ))}
          </div>
          <div className="sc-reveal-lower-bar">{PARTY[active][LANG].lower}</div>
        </div>
      )}
      {revealed && (
        <div key={`nav-${active}`} className="sc-right-nav">
          <span className="sc-nav-arrow left">◄</span>
          <button type="button" tabIndex={-1} className="sc-nav-btn" onClick={() => step(-1)} aria-label="Previous">A</button>
          <span className="sc-nav-dot" />
          <button type="button" tabIndex={-1} className="sc-nav-btn" onClick={() => step(1)} aria-label="Next">D</button>
          <span className="sc-nav-arrow right">►</span>
        </div>
      )}
      {revealed && (
        <div
          key={`portrait-${active}`}
          className={`sc-main-portrait-shell${mounted ? " mounted" : ""}`}
          style={{ "--member": PARTY[active].color, "--face": PARTY[active].face }}
        >
          <div className="sc-portrait-band" />
          <img className="sc-main-portrait" src={PARTY[active].portrait} alt="" />
        </div>
      )}
      {/* The grey corner and role tag of the game's status screen. */}
      {revealed && <div className="sc-corner" />}
      {revealed && roleOf(PARTY[active]) && (
        <div key={`badge-${active}`} className="sc-role-badge">
          <span className="sc-role-badge-mark" />
          <span className="sc-role-badge-text">{roleOf(PARTY[active])}</span>
        </div>
      )}
      <style>{`
        .sc-root {
          position: absolute;
          inset: 0;
          z-index: 6;
          pointer-events: none;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          justify-content: center;
          /* Bar height follows the window height, so the whole list (ten bars
             plus the taller active one) fits without scrolling. */
          --bar: clamp(36px, 6.6vh, 64px);
          --bar-active: calc(var(--bar) * 1.4);
          gap: calc(var(--bar) * 0.09);
          padding-left: 0;
          transition: opacity 0.2s ease;
        }
        /* The list is taller than the open panel, so it would show around it. */
        .sc-root.revealed { opacity: 0; }
        .sc-root.revealed .sc-bar-bg { pointer-events: none; }

        .sc-dim {
          position: absolute;
          inset: 0;
          z-index: 12;
          background: rgba(40, 45, 54, 0.68);
          pointer-events: none;
          animation: sc-dim-in 0.32s ease-out;
        }

        @keyframes sc-dim-in {
          from {
            opacity: 0;
          }
          to {
            opacity: 1;
          }
        }

        @keyframes sc-reveal-bar-in {
          0% {
            opacity: 0;
            transform: translateX(-120px) rotate(-20deg) scaleX(0.72);
          }
          60% {
            opacity: 0.96;
            transform: translateX(18px) rotate(-20deg) scaleX(1.03);
          }
          100% {
            opacity: 0.92;
            transform: translateX(0) rotate(-20deg) scaleX(1);
          }
        }

        @keyframes sc-portrait-in {
          0% {
            opacity: 0;
            transform: translateX(78px) skewX(-8deg) scale(0.94);
            filter: blur(8px);
          }
          55% {
            opacity: 0.9;
            transform: translateX(-8px) skewX(-8deg) scale(1.015);
            filter: blur(0);
          }
          100% {
            opacity: 0.96;
            transform: translateX(0) skewX(-8deg) scale(1);
            filter: blur(0);
          }
        }

        @keyframes sc-arrow-left {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(-5px); opacity: 0.4; }
        }

        @keyframes sc-arrow-right {
          0%, 100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(5px); opacity: 0.4; }
        }

        .sc-main-portrait-shell {
          position: absolute;
          top: 0;
          right: -3vw;
          z-index: 13;
          pointer-events: none;
          width: 43vw;
          height: 100vh;
          overflow: hidden;
          /* Dark backdrop with faint diagonal stripes, as on the status screen. */
          background:
            repeating-linear-gradient(115deg, rgba(255,255,255,0.05) 0 7vh, transparent 7vh 19vh),
            #2c3039;
          opacity: 0;
          transform: translateX(24px) skewX(-8deg) scale(0.98);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .sc-main-portrait-shell.mounted {
          opacity: 0.96;
          transform: translateX(0) skewX(-8deg) scale(1);
          animation: sc-portrait-in 0.5s cubic-bezier(0.22, 1, 0.36, 1);
        }

        .sc-reveal-panel {
          position: absolute;
          top: 44vh;
          left: -6vw;
          width: 88vw;
          height: 60vh;
          z-index: 12;
          pointer-events: none;
          background:
            linear-gradient(180deg, rgba(255,255,255,0.98) 0%, rgba(243,246,252,0.98) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 88px) 100%, 0 100%);
          box-shadow:
            0 0 0 2px rgba(255,255,255,0.18),
            18px 0 0 rgba(215, 13, 44, 0.82),
            28px 0 0 rgba(255,255,255,0.26);
          opacity: 0;
          transform: translateX(-40px) rotate(-20deg);
          transform-origin: left bottom;
          transition: opacity 0.3s ease, transform 0.35s ease;
        }
        .sc-reveal-panel.mounted {
          opacity: 0.92;
          transform: translateX(0) rotate(-20deg);
          animation: sc-reveal-bar-in 0.46s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-reveal-panel::before {
          content: "";
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 8px;
          background: linear-gradient(180deg, #e03d31 0%, #eb3333 100%);
          clip-path: inherit;
        }
        .sc-reveal-upper-bar {
          position: absolute;
          top: 10%;
          left: 0%;
          width: 100%;
          height: 40%;
          background: rgba(0, 0, 0, 0.92);
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 10px;
          color: #fff;
          text-align: center;
        }
        .sc-reveal-upper-line {
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 20px;
          letter-spacing: 0.5px;
          line-height: 1.15;
        }
        .sc-reveal-lower-bar {
          position: absolute;
          top: 58%;
          right: 0;
          width: 48%;
          height: 20%;
          background: rgba(0, 0, 0, 0.92);
          clip-path: polygon(0 0, 100% 0, calc(100% - 22px) 100%, 0 100%);
          box-shadow: 0 0 0 1px rgba(255,255,255,0.06);
          display: flex;
          align-items: center;
          justify-content: flex-start;
          color: #fff;
          font-family: 'Montserrat', sans-serif;
          font-weight: 300;
          font-size: 22px;
          letter-spacing: 0.4px;
          text-transform: lowercase;
          padding-left: 22px;
        }

        @keyframes sc-right-nav-pop {
          0%   { opacity: 0; transform: scale(0.55) translateY(-10px); }
          65%  { opacity: 1; transform: scale(1.1) translateY(2px); }
          100% { opacity: 1; transform: scale(1) translateY(0); }
        }
        .sc-right-nav {
          position: absolute;
          top: 10vh;
          left: 6vw;
          display: flex;
          align-items: center;
          gap: 6px;
          pointer-events: none;
          z-index: 14;
          transform: translateX(-40px) rotate(-20deg);
          transform-origin: left bottom;
          animation: sc-right-nav-pop 0.38s cubic-bezier(0.22,1,0.36,1) both;
        }
        .sc-right-nav .sc-nav-btn {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 100px;
          letter-spacing: 3px;
          line-height: 1;
          user-select: none;
          color: #fff;
          -webkit-text-stroke: 2px #000;
          paint-order: stroke fill;
          background: none;
          border: none;
          padding: 0 6px;
          pointer-events: auto;
          cursor: pointer;
        }
        .sc-right-nav .sc-nav-dot {
          width: 16px;
          height: 16px;
          border-radius: 999px;
          background: #111;
          margin: 0 10px;
          flex-shrink: 0;
        }
        .sc-right-nav .sc-nav-arrow {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          color: #c4001a;
          display: inline-block;
          user-select: none;
        }
        .sc-right-nav .sc-nav-arrow.left  { animation: sc-arrow-left  0.8s ease-in-out infinite; }
        .sc-right-nav .sc-nav-arrow.right { animation: sc-arrow-right 0.8s ease-in-out infinite; }

        /* Slanted band of the member's colour behind the shoulders. */
        .sc-portrait-band {
          position: absolute;
          inset: 0;
          background: var(--member);
          clip-path: polygon(0 34%, 46% 6%, 64% 6%, 14% 100%, 0 100%);
          opacity: 0.9;
        }
        /* The whole bust (head to chest), standing on the bottom edge. */
        .sc-main-portrait {
          position: absolute;
          bottom: 0;
          /* The face lands at the middle of the panel, whatever the bust's
             width or the window's shape. */
          left: calc(50% - var(--face) * 90vh);
          height: 90vh;
          width: auto;
          max-width: none;
          transform: skewX(8deg);
          transform-origin: bottom right;
        }

        .sc-corner {
          position: absolute;
          right: 0;
          bottom: 0;
          width: 36vw;
          height: 40vh;
          z-index: 14;
          pointer-events: none;
          background: #23262c;
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
          animation: sc-corner-in 0.4s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        .sc-corner::after {
          content: "";
          position: absolute;
          inset: 7px 0 0 12px;
          background: linear-gradient(160deg, #a3a8b0 0%, #6f747d 100%);
          clip-path: polygon(100% 0, 100% 100%, 0 100%);
        }
        /* The key hints sit on the grey corner: plain dark text reads there. */
        .sc-corner ~ .key-hints { mix-blend-mode: normal; color: #15171b; }
        @keyframes sc-corner-in {
          from { transform: translate(30%, 30%); }
          to   { transform: translate(0, 0); }
        }

        .sc-role-badge {
          position: absolute;
          right: 5vw;
          bottom: 19vh;
          z-index: 15;
          display: flex;
          align-items: center;
          gap: calc(var(--badge) * 0.22);
          --badge: clamp(30px, 7vh, 72px);
          padding: calc(var(--badge) * 0.12) calc(var(--badge) * 0.5) calc(var(--badge) * 0.1) calc(var(--badge) * 0.3);
          background: #141414;
          clip-path: polygon(4% 0, 100% 0, 96% 100%, 0 100%);
          transform: rotate(-4deg);
          pointer-events: none;
          animation: sc-badge-in 0.35s 0.1s cubic-bezier(0.22, 1, 0.36, 1) both;
        }
        /* Two red squares touching at one corner. */
        .sc-role-badge-mark {
          width: calc(var(--badge) * 0.62);
          height: calc(var(--badge) * 0.62);
          flex-shrink: 0;
          background:
            linear-gradient(#e8202a, #e8202a) top right / 50% 50% no-repeat,
            linear-gradient(#e8202a, #e8202a) bottom left / 50% 50% no-repeat;
        }
        .sc-role-badge-text {
          font-family: 'Saira Condensed', 'Anton', sans-serif;
          font-weight: 900;
          font-size: var(--badge);
          line-height: 1;
          color: #e8202a;
          transform: skewX(-12deg);
        }
        @keyframes sc-badge-in {
          from { opacity: 0; transform: translateX(40px) rotate(-4deg); }
          to   { opacity: 1; transform: rotate(-4deg); }
        }

        /* ── Each bar ── */
        .sc-bar {
          position: relative;
          width: 45vw;
          height: var(--bar);
          transition: height 0.3s cubic-bezier(0.22,1,0.36,1);
          z-index: 1;
          /* Where the portrait's nose sits, measured from the left edge. */
          --nose: calc(var(--bar) * 2.25);
        }

        /* The black slab. It is a layer of its own so the portrait can stick
           out past its left edge. */
        .sc-bar-bg {
          position: absolute;
          inset: 0;
          background: #111;
          cursor: pointer;
          pointer-events: all;
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
        }
        /* No role: nothing left of the face, the slab starts at the nose. */
        .sc-bar-outer.no-role .sc-bar-bg {
          clip-path: polygon(calc(var(--nose) + 6px) 0, 100% 0, calc(100% - 14px) 100%, calc(var(--nose) - 6px) 100%);
        }

        /* wrapper holds both the red underlay and the bar */
        .sc-bar-outer {
          position: relative;
          flex-shrink: 0;
          transform: translateX(-100%);
          transition: transform 0.55s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sc-bar-outer.active .sc-bar     { height: var(--bar-active); }
        .sc-bar-outer.active .sc-bar-red { height: var(--bar-active); }
        .sc-bar-outer.mounted { transform: translateX(0); }

        /* red underlay — peeks out below the bar when active */
        .sc-bar-red {
          position: absolute;
          top: 0; left: 0;
          width: 45vw;
          height: var(--bar);
          background: #c4001a;
          clip-path: polygon(50% 0, 100% 0, 100% 100%, calc(50% - 10px) 100%);
          transform: translateY(-7px);
          opacity: 0;
          transition: opacity 0.2s ease;
          z-index: 0;
          pointer-events: none;
        }
        .sc-bar-outer.active .sc-bar-red { opacity: 1; }

        /* white fill — skewed parallelogram on the right 25% */
        .sc-bar-fill {
          position: absolute;
          inset: 0;
          width: 100%;
          background: #ffffff;
          clip-path: polygon(100% 0, 100% 0, calc(100% - 32px) 100%, calc(100% - 32px) 100%);
          transition: clip-path 0.35s cubic-bezier(0.22, 1, 0.36, 1);
          z-index: 0;
        }
        /* Selected: white from the face to the right end, as in the game. */
        .sc-bar-outer.active .sc-bar-fill {
          clip-path: polygon(calc(var(--nose) + 6px) 0, 100% 0, calc(100% - 14px) 100%, calc(var(--nose) - 6px) 100%);
        }

        /* shade on the left edge of the white fill */
        .sc-bar-shade {
          position: absolute;
          top: 0; bottom: 0;
          left: 73%;
          width: 6%;
          background: linear-gradient(90deg, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0) 100%);
          z-index: 1;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.35s ease;
        }
        .sc-bar-outer.active .sc-bar-shade { opacity: 1; }

        /* bottom shadow line under each bar */
        .sc-bar::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 6px;
          background: linear-gradient(180deg, rgba(0,0,0,0) 0%, rgba(0,0,0,0.55) 100%);
          z-index: 10;
          pointer-events: none;
        }
        .sc-bar-outer.no-role .sc-bar::after { left: var(--nose); }

        /* content layout inside each bar */
        .sc-bar-content {
          position: relative;
          z-index: 2;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 20px 0 20px;
          /* The slanted role word is taller than the bar: cut it at the edges. */
          overflow: hidden;
        }

        /* left: role label */
        .sc-role {
          display: flex;
          align-items: center;
          flex-shrink: 0;
          /* Free stand-in for the game's own (licensed) lettering. */
          font-family: 'Saira Condensed', 'Anton', sans-serif;
          font-weight: 900;
          font-size: calc(var(--bar) * 0.8);
          letter-spacing: -1px;
          color: #ffffff;
          user-select: none;
          line-height: 1;
          white-space: nowrap;
          /* Same width whatever the word (or none), so every label lines up. */
          width: calc(var(--bar) * 1.72);
          padding: 0 16px 0 8px;
        }
        .sc-role span {
          display: inline-block;
          transform: rotate(-30deg);
          animation: sc-role-in 0.28s cubic-bezier(0.22, 1, 0.36, 1);
        }
        @keyframes sc-role-in {
          from { opacity: 0; transform: translateX(-60%) rotate(-30deg); }
          to   { opacity: 1; transform: rotate(-30deg); }
        }

        /* Joining or leaving the party grows or cuts the slab on the left. */
        .sc-bar-bg { transition: clip-path 0.3s cubic-bezier(0.22, 1, 0.36, 1); }

        /* Flash on a bar that can't join because the party is full. */
        .sc-full {
          position: absolute;
          top: 50%;
          right: 36px;
          z-index: 11;
          padding: 3px 10px 1px;
          background: #c4001a;
          color: #fff;
          font-family: 'Bebas Neue', sans-serif;
          font-size: calc(var(--bar) * 0.34);
          letter-spacing: 2px;
          line-height: 1;
          pointer-events: none;
          user-select: none;
          animation: sc-full 1.2s ease both;
        }
        @keyframes sc-full {
          0%   { opacity: 0; transform: translate(-8px, -50%); }
          10%  { opacity: 1; transform: translate(6px, -50%); }
          18%  { transform: translate(-4px, -50%); }
          26%  { transform: translate(0, -50%); }
          80%  { opacity: 1; }
          100% { opacity: 0; transform: translate(0, -50%); }
        }

        /* left: icon + name centered in remaining space */
        .sc-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          padding-left: 78px;
        }
        .sc-main-top {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        .sc-icon {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          width: 32px;
          text-align: center;
          flex-shrink: 0;
          color: rgba(255,255,255,0.15);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-icon { color: rgba(255,255,255,0.25); }

        .sc-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: calc(var(--bar) * 0.44);
          letter-spacing: 4px;
          line-height: 1;
          color: rgba(255,255,255,0.85);
          transition: color 0.2s ease;
          user-select: none;
        }
        .sc-bar-outer.active .sc-label { color: #111111; }

        /* right: stats group */
        .sc-stats {
          display: flex;
          align-items: center;
          gap: 10px;
          padding-right: 24px;
          flex-shrink: 0;
        }

        .sc-stat {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }

        .sc-stat-top {
          display: flex;
          align-items: baseline;
          gap: 4px;
        }

        .sc-stat-tag {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 9px;
          letter-spacing: 1.5px;
          padding: 1px 4px;
          border-width: 1px;
          border-style: solid;
          line-height: 1.4;
          user-select: none;
        }

        .sc-stat-num {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          font-style: italic;
          line-height: 1;
          color: #ffffff;
          letter-spacing: 1px;
          user-select: none;
          transition: color 0.2s ease;
        }
        .sc-bar-outer.active .sc-stat-num { color: #111111; }

        .sc-stat-bars {
          width: 100%;
          display: flex;
          flex-direction: column;
          gap: 1px;
          margin-top: 2px;
        }
        .sc-stat-bar-color {
          height: 3px;
          width: 100%;
        }
        .sc-stat-bar-black {
          height: 2px;
          width: 100%;
          background: #000;
        }

        /* character portrait */
        .sc-char {
          position: absolute;
          top: 0;
          left: var(--nose);
          height: 100%;
          width: auto;
          /* The nose is 64px into the 310px-wide image: keep it on --nose
             whatever the bar height, so the face does not slide when it grows. */
          transform: translateX(-20.65%);
          pointer-events: none;
          user-select: none;
          z-index: 3;
        }
        /* Shadow of the face on the backdrop, where no slab is behind it. */
        .sc-bar-outer.no-role .sc-char {
          filter: drop-shadow(-6px 0 0 rgba(0, 24, 90, 0.5));
        }

      `}</style>

      <div className={`sc-root${revealed ? " revealed" : ""}`} role="navigation">
        {PARTY.map((item, i) => {
          const role = roleOf(item);
          return (
          <div
            key={item.id}
            className={`sc-bar-outer${role ? "" : " no-role"}${active === i ? " active" : ""}${mounted ? " mounted" : ""}`}
            // Each bar slides in a little after the one above it.
            style={{ transitionDelay: `${i * 50}ms` }}
            onClick={() => {
              setActive(i);
            }}
            onMouseEnter={() => {
              if (i !== active) play("cursor");
              setActive(i);
            }}
          >
            <div className="sc-bar-red" />
            <div className="sc-bar">
              <div className="sc-bar-bg" />
              <div className="sc-bar-fill" />
              <div className="sc-bar-shade" />
              <img className="sc-char" src={item.profile} alt="" />
              <div className="sc-bar-content">
                {/* keyed by role, so a member who joins gets the label animation */}
                <div className="sc-role"><span key={role}>{role}</span></div>
                <div className="sc-main">
                  <div className="sc-main-top">
                    <div className="sc-label">{item[LANG].label}</div>
                  </div>
                </div>
              </div>
              {denied?.index === i && (
                <div key={denied.n} className="sc-full">PARTY FULL</div>
              )}
            </div>
          </div>
          );
        })}
      </div>

      <KeyHints keys={revealed ? [["A D", "SWITCH"], ["ESC", "CLOSE"]] : [["↑↓", "SELECT"], ["↵", "REVEAL"], ["SPACE", `PARTY ${party.length}/${PARTY_SIZE}`], ["ESC", "BACK"]]} />
    </div>
  );
}
