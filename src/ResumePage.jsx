import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { resumeBg } from "./media";
import { play } from "./sound";
import BgVideo from "./BgVideo";
import KeyHints from "./KeyHints";

// One card per section. `rows` fill the panel that opens beside the selected
// card (title + a short status tag) and `details` its bullet list. RANK on a
// card is how many rows the section has.
const ITEMS = [
  {
    id: "education", badge: "I", title: "EDUCATION", subtitle: "Law / Programming", log: "EDUCATION LOG",
    rows: [
      { title: "Law: lawyer in Colombia", status: "Complete" },
      { title: "Programming: 4 years of practice", status: "Ongoing" },
      { title: "New technologies", status: "Always" },
    ],
    details: [
      "Trained and practiced as a lawyer in Colombia.",
      "Moved into software and has been programming for 4 years.",
      "Keeps learning new tools and technologies as they come.",
    ],
  },
  {
    id: "skills", badge: "II", title: "SKILLS", subtitle: "HTML / CSS / JS / React", log: "SKILL LIST",
    rows: [
      { title: "HTML, CSS & JavaScript", status: "Front-end" },
      { title: "React", status: "Framework" },
      { title: "Next.js", status: "Framework" },
      { title: "Vite", status: "Tooling" },
      { title: "LLMs: local & Claude", status: "AI" },
    ],
    details: [
      "Builds web interfaces with HTML, CSS, JavaScript and React.",
      "Ships apps with Next.js and Vite.",
      "Runs language models locally and works with hosted ones like Claude.",
    ],
  },
  {
    id: "projects", badge: "III", title: "PROJECTS", subtitle: "Side projects", log: "PROJECT LOG",
    rows: [
      { title: "Compendio D&D 2024", status: "Live" },
      { title: "UnsubTracker", status: "Live" },
      { title: "Pollanzas Personales", status: "Live" },
      { title: "This site", status: "React + Vite" },
    ],
    details: [
      "Compendio D&D: spells, classes and a character sheet for D&D 2024, in Spanish.",
      "UnsubTracker: tracks and manages all your subscriptions in one place.",
      "Pollanzas Personales: keeps track of income and expenses month by month.",
    ],
  },
  {
    id: "experience", badge: "IV", title: "EXPERIENCE", subtitle: "Eventtia / Law", log: "WORK LOG",
    rows: [
      { title: "Front-end developer, Eventtia Inc.", status: "Current" },
      { title: "Lawyer, Colombia", status: "4 years" },
    ],
    details: [
      "Front-end development at Eventtia Inc.",
      "4 years of programming experience.",
      "4 years practicing law in Colombia before moving into software.",
    ],
  },
];

export default function ResumePage() {
  const navigate = useNavigate();
  const [active, setActive] = useState(0);
  const [mounted, setMounted] = useState(false);
  // The detail panel on the right stays closed until the visitor opens it.
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setMounted(true), 80);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const onKey = (e) => {
      const select = (i) => {
        if (i !== active) play("cursor");
        setActive(i);
      };
      if (e.key === "ArrowUp") select(Math.max(0, active - 1));
      if (e.key === "ArrowDown") select(Math.min(ITEMS.length - 1, active + 1));
      if ((e.key === "Enter" || e.key === "ArrowRight") && !open) {
        play("show");
        setOpen(true);
      }
      // Back closes the panel first; only with it closed does it leave the page.
      if (e.key === "ArrowLeft" || e.key === "Escape" || e.key === "Backspace") {
        if (open) {
          play("hide");
          setOpen(false);
        } else {
          play("back");
          navigate(-1);
        }
      }
    };

    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, navigate, open]);

  return (
    <div id="menu-screen">
      <BgVideo media={resumeBg} />
      <style>{`
        .resume-overlay {
          position: absolute;
          inset: 0;
          z-index: 10;
          pointer-events: none;
        }

        .resume-stack {
          position: absolute;
          top: 9vh;
          left: 2.8vw;
          width: min(47vw, 720px);
          display: flex;
          flex-direction: column;
          gap: 10px;
          pointer-events: none;
          transform: scale(0.9);
          transform-origin: top left;
        }

        .resume-list-tag {
          font-family: 'Anton', sans-serif;
          font-size: 92px;
          line-height: 0.9;
          color: #f6fbff;
          letter-spacing: 2px;
          margin: 0 0 6px 12px;
          text-shadow: 0 2px 0 rgba(0,0,0,0.18);
          opacity: 0;
          transform: translateX(-24px);
          transition: opacity 0.35s ease, transform 0.35s ease;
        }
        .resume-list-tag.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card-wrap {
          position: relative;
          opacity: 0;
          transform: translateX(-48px);
          transition: opacity 0.4s ease, transform 0.4s cubic-bezier(0.22, 1, 0.36, 1);
          pointer-events: all;
          cursor: pointer;
        }
        .resume-card-wrap.mounted {
          opacity: 1;
          transform: translateX(0);
        }

        .resume-card {
          position: relative;
          height: 112px;
          background: #10185f;
          clip-path: polygon(0 0, 97% 0, 100% 100%, 3% 100%);
          box-shadow: 0 8px 0 rgba(5, 13, 59, 0.85);
          transition: transform 0.22s ease, background 0.22s ease, box-shadow 0.22s ease;
          overflow: visible;
        }
        .resume-card-wrap.active .resume-card {
          background: #ffffff;
          box-shadow: 10px 8px 0 #d63232;
          transform: translateX(6px);
        }

        .resume-card-inner {
          position: absolute;
          inset: 0;
          padding: 14px 22px 14px 62px;
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
        }

        /* The badge is a slanted plate with an outline: the outline colour
           fills it, and an inner layer of the same shape, 3px smaller, fills
           the middle (a CSS border would be cut by the slant). */
        .resume-badge {
          position: absolute;
          top: 10px;
          left: -10px;
          z-index: 2;
          width: 56px;
          height: 70px;
          background: #9cf7ff;
          clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          transform: rotate(-8deg);
          transition: transform 0.22s ease, background 0.22s ease;
        }
        .resume-badge::before {
          content: "";
          position: absolute;
          inset: 3px;
          background: #0b113d;
          clip-path: polygon(14% 0, 100% 0, 86% 100%, 0 100%);
          transition: background 0.22s ease;
        }
        .resume-card-wrap.active .resume-badge {
          transform: translateX(6px) rotate(-8deg);
        }
        .resume-badge-text {
          position: relative;
          font-family: 'Bebas Neue', sans-serif;
          font-size: 36px;
          color: #d2fdff;
          letter-spacing: 1px;
          transform: rotate(8deg);
        }
        .resume-card-wrap.active .resume-badge,
        .resume-card-wrap.active .resume-badge::before {
          background: #000;
        }
        .resume-card-wrap.active .resume-badge-text {
          color: #fff;
        }

        .resume-title {
          font-family: 'Anton', sans-serif;
          font-size: 56px;
          line-height: 0.9;
          letter-spacing: 1px;
          color: #a5f6ff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-title {
          color: #000;
        }

        .resume-rank {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 2px;
          flex-shrink: 0;
        }
        .resume-rank-label {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          letter-spacing: 2px;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-rank-number {
          font-family: 'Anton', sans-serif;
          font-size: 70px;
          line-height: 0.82;
          color: #9ffbff;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-rank-label,
        .resume-card-wrap.active .resume-rank-number {
          color: #000;
        }

        .resume-subtitle-bar {
          position: absolute;
          left: 64px;
          right: 14px;
          bottom: 12px;
          height: 34px;
          background: #85f4ff;
          clip-path: polygon(0 0, 100% 0, calc(100% - 10px) 100%, 0 100%);
          display: flex;
          align-items: center;
          padding: 0 18px;
          transition: background 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle-bar {
          background: #000;
        }

        .resume-subtitle {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 28px;
          line-height: 1;
          letter-spacing: 1px;
          color: #041238;
          transition: color 0.22s ease;
        }
        .resume-card-wrap.active .resume-subtitle {
          color: #fff;
        }

        .resume-detail-panel {
          position: absolute;
          top: 9.5vh;
          right: 4.5vw;
          width: min(39vw, 620px);
          min-height: 74vh;
          z-index: 12;
          padding: 22px 24px 24px 24px;
          background: linear-gradient(180deg, rgba(15, 28, 105, 0.96) 0%, rgba(8, 16, 68, 0.97) 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 18px) 100%, 0 100%);
          box-shadow:
            inset 0 0 0 1px rgba(133, 244, 255, 0.16),
            16px 16px 0 rgba(0, 6, 30, 0.55);
          overflow: hidden;
        }
        .resume-detail-panel::before {
          content: "";
          position: absolute;
          inset: 0;
          background:
            linear-gradient(135deg, rgba(133, 244, 255, 0.08) 0 15%, transparent 15% 100%),
            linear-gradient(180deg, rgba(255,255,255,0.05), transparent 24%);
          pointer-events: none;
        }
        .resume-detail-top {
          position: relative;
          display: grid;
          grid-template-columns: 70px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 92px;
          padding: 0 18px;
          background: linear-gradient(90deg, #8ef5ff 0%, #d3fdff 100%);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          color: #08153f;
          box-shadow: 10px 0 0 rgba(255, 94, 136, 0.88);
        }
        .resume-detail-top-index {
          font-family: 'Anton', sans-serif;
          font-size: 46px;
          line-height: 1;
        }
        .resume-detail-top-title {
          font-family: 'Anton', sans-serif;
          font-size: 42px;
          line-height: 0.92;
          letter-spacing: 1px;
        }
        .resume-detail-top-progress {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 42px;
          letter-spacing: 2px;
          line-height: 1;
        }
        .resume-detail-list {
          position: relative;
          display: flex;
          flex-direction: column;
          gap: 10px;
          margin-top: 18px;
        }
        .resume-detail-row {
          display: grid;
          grid-template-columns: 50px 1fr auto;
          align-items: center;
          gap: 14px;
          min-height: 56px;
          padding: 0 14px;
          background: rgba(8, 18, 72, 0.96);
          clip-path: polygon(0 0, 100% 0, calc(100% - 14px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(140, 239, 255, 0.12);
          transition: transform 0.16s ease, background 0.16s ease;
        }
        .resume-detail-row:hover {
          transform: translateX(4px);
          background: rgba(12, 26, 94, 1);
        }
        .resume-detail-row-index {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 26px;
          letter-spacing: 1px;
          color: #94f4ff;
        }
        .resume-detail-row-title {
          font-family: 'Anton', sans-serif;
          font-size: 28px;
          line-height: 1;
          color: #f2fcff;
        }
        .resume-detail-status {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 22px;
          line-height: 1;
          letter-spacing: 1.1px;
          color: #06133b;
          background: #8df6ff;
          padding: 7px 12px;
          clip-path: polygon(0 0, 100% 0, calc(100% - 8px) 100%, 0 100%);
        }
        .resume-detail-bottom {
          position: relative;
          margin-top: 22px;
          padding: 18px;
          background: rgba(5, 13, 57, 0.97);
          clip-path: polygon(0 0, 100% 0, calc(100% - 16px) 100%, 0 100%);
          box-shadow: inset 0 0 0 1px rgba(145, 239, 255, 0.12);
        }
        .resume-detail-bottom-title {
          font-family: 'Bebas Neue', sans-serif;
          font-size: 30px;
          letter-spacing: 2px;
          color: #91f5ff;
          margin-bottom: 14px;
        }
        .resume-detail-bullets {
          display: flex;
          flex-direction: column;
          gap: 10px;
        }
        .resume-detail-bullet {
          font-family: 'Anton', sans-serif;
          font-size: 21px;
          line-height: 1.15;
          color: #edfaff;
        }

        /* Laptop-height windows: tighter panel so the longest section fits. */
        @media (max-height: 900px) {
          .resume-detail-panel { padding: 16px 20px 18px; }
          .resume-detail-top { min-height: 64px; }
          .resume-detail-top-index { font-size: 34px; }
          .resume-detail-top-title,
          .resume-detail-top-progress { font-size: 32px; }
          .resume-detail-list { gap: 6px; margin-top: 12px; }
          .resume-detail-row { min-height: 42px; }
          .resume-detail-row-index { font-size: 20px; }
          .resume-detail-row-title { font-size: 22px; }
          .resume-detail-status { font-size: 16px; padding: 5px 10px; }
          .resume-detail-bottom { margin-top: 14px; padding: 12px 14px; }
          .resume-detail-bottom-title { font-size: 22px; margin-bottom: 8px; }
          .resume-detail-bullets { gap: 6px; }
          .resume-detail-bullet { font-size: 17px; }
        }

      `}</style>

      <div className="resume-overlay">
        <div className="resume-stack">
          <div className={`resume-list-tag${mounted ? " mounted" : ""}`}>LIST</div>
          {ITEMS.map((item, index) => (
            <div
              key={item.id}
              className={`resume-card-wrap${active === index ? " active" : ""}${mounted ? " mounted" : ""}`}
              style={{ transitionDelay: `${index * 55}ms` }}
              onMouseEnter={() => {
                if (index !== active) play("cursor");
                setActive(index);
              }}
              onClick={() => {
                setActive(index);
                if (!open) {
                  play("show");
                  setOpen(true);
                }
              }}
            >
              {/* Outside the card, which is clipped to its slanted shape. */}
              <div className="resume-badge">
                <div className="resume-badge-text">{item.badge}</div>
              </div>
              <div className="resume-card">
                <div className="resume-card-inner">
                  <div className="resume-title">{item.title}</div>
                  <div className="resume-rank">
                    <div className="resume-rank-label">RANK</div>
                    <div className="resume-rank-number">{item.rows.length}</div>
                  </div>
                </div>
                <div className="resume-subtitle-bar">
                  <div className="resume-subtitle">{item.subtitle}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {open && (
        <div className="resume-detail-panel" key={ITEMS[active].id}>
          <div className="resume-detail-top">
            <div className="resume-detail-top-index">{String(active + 1).padStart(2, "0")}</div>
            <div className="resume-detail-top-title">{ITEMS[active].log}</div>
            <div className="resume-detail-top-progress">{ITEMS[active].rows.length}</div>
          </div>

          <div className="resume-detail-list">
            {ITEMS[active].rows.map((row, i) => (
              <div className="resume-detail-row" key={row.title}>
                <div className="resume-detail-row-index">{String(i + 1).padStart(2, "0")}</div>
                <div className="resume-detail-row-title">{row.title}</div>
                <div className="resume-detail-status">{row.status}</div>
              </div>
            ))}
          </div>

          <div className="resume-detail-bottom">
            <div className="resume-detail-bottom-title">DETAILS</div>
            <div className="resume-detail-bullets">
              {ITEMS[active].details.map((line) => (
                <div className="resume-detail-bullet" key={line}>- {line}</div>
              ))}
            </div>
          </div>
        </div>
        )}

      </div>
      <KeyHints keys={open ? [["↑↓", "SELECT"], ["ESC", "CLOSE"]] : [["↑↓", "SELECT"], ["↵", "OPEN"], ["ESC", "BACK"]]} />
    </div>
  );
}
