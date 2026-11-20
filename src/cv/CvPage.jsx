import { useNavigate } from "react-router-dom";
import { Button } from "@ui-sdk/react/button";
import {
  SegmentedControl,
  SegmentedControlIndicator,
  SegmentedControlItem,
} from "@ui-sdk/react/segmented-control";
import { Tooltip, TooltipContent, TooltipTrigger } from "@ui-sdk/react/tooltip";
import { Toast, ToastDescription, ToastRegion, ToastTitle, toast } from "@ui-sdk/react/toast";
import {
  Timeline,
  TimelineConnector,
  TimelineDescription,
  TimelineItem,
  TimelineMarker,
  TimelineTitle,
} from "@ui-sdk/react/timeline";
import { LANGS, setLang, useLang } from "../lang";
import { syncMusic } from "../sound";
import { GAME } from "../routes";
import { PROJECTS } from "../data/projects";
import { GITHUB, SOCIALS } from "../data/links";
import { CV } from "./content";
import Exhibit from "./Exhibit";
import { Paperclip, CoffeeRing, Stamp } from "./Desk";
import "./cv.css";

// The classic CV, the front door of the site: one scrolling page, laid out
// like a court filing on pleading paper (a nod to the years as a lawyer),
// lying on a desk blotter. Every numbered line in the left margin is an
// element with the `ln` class; CSS counts them.
//
// The page is its own scroll container, since the game pages keep the body
// from scrolling.

// The page holds focus from the moment it is on screen, so Space, Page Down
// and the arrows scroll it without a click first.
const focusOnMount = (el) => el?.focus({ preventScroll: true });

function Section({ n, id, title, children }) {
  return (
    <section className="cv-section" aria-labelledby={`cv-${id}`} style={{ "--i": n }}>
      <h2 className="cv-h2 ln" id={`cv-${id}`}>
        <span className="cv-section-mark">§&nbsp;{n}</span>
        {title}
      </h2>
      {children}
    </section>
  );
}

export default function CvPage() {
  const navigate = useNavigate();
  const lang = useLang();
  const t = CV[lang];

  const toGame = () => {
    navigate(GAME);
    syncMusic();
  };

  const copy = (handle, label) => {
    navigator.clipboard?.writeText(handle).catch(() => {});
    toast(t.ui.copied, { description: `${label}: ${handle}`, duration: 2500 });
  };

  const exhibits = [
    ...PROJECTS.map((p) => ({
      id: p.id,
      name: p.name,
      group: p.group[lang],
      description: p.description[lang],
      href: p.href,
      shots: p.shots,
    })),
    { id: "site", ...t.thisSite, shots: [] },
  ];

  const contacts = [
    { id: "github", label: "GitHub", handle: "SSolvernia", href: GITHUB },
    ...Object.entries(SOCIALS).map(([id, s]) => ({ id, ...s })),
  ];

  return (
    <div className="cv-page" tabIndex={-1} ref={focusOnMount}>
      <a className="cv-skip" href="#cv-main">{t.ui.skip}</a>

      <header className="cv-bar">
        <Tooltip delay={300}>
          <TooltipTrigger render={<Button className="cv-btn cv-game" onClick={toGame} />}>
            <span className="cv-game-chip" aria-hidden="true" />
            {t.ui.game}
          </TooltipTrigger>
          <TooltipContent className="cv-tip" side="bottom" align="start">
            {t.ui.gameHint}
          </TooltipContent>
        </Tooltip>
        <div className="cv-bar-right">
          <SegmentedControl
            className="cv-lang"
            aria-label={t.ui.language}
            value={lang}
            onValueChange={(next) => next && setLang(next)}
          >
            <SegmentedControlIndicator className="cv-lang-indicator" />
            {LANGS.map((code) => (
              <SegmentedControlItem key={code} value={code} className="cv-lang-item" lang={code}>
                {code.toUpperCase()}
              </SegmentedControlItem>
            ))}
          </SegmentedControl>
          <Button className="cv-btn cv-print" onClick={() => window.print()}>
            {t.ui.print}
          </Button>
        </div>
      </header>

      <div className="cv-stack">
        {/* Two sheets underneath, slightly askew, and the clip holding them. */}
        <div className="cv-under cv-under-1" aria-hidden="true" />
        <div className="cv-under cv-under-2" aria-hidden="true" />
        <Paperclip />

        <main className="cv-paper" id="cv-main">
          <div className="cv-texture" aria-hidden="true" />
          <CoffeeRing />

          {/* The caption of a filing: the party on the left, the document on
              the right, a column of parentheses between them. */}
          <div className="cv-caption" style={{ "--i": 0 }}>
            <div className="cv-caption-party">
              <h1 className="cv-name ln">{t.caption.name},</h1>
              {t.caption.roles.map((line) => (
                <p className="cv-role ln" key={line}>{line}</p>
              ))}
            </div>
            <div className="cv-caption-paren" aria-hidden="true">
              {")\n)\n)\n)\n)"}
            </div>
            <div className="cv-caption-doc">
              <p className="cv-doc ln">{t.caption.doc}</p>
              <p className="cv-no ln">{t.caption.no}</p>
              <p className="cv-no-note ln">({t.caption.noNote})</p>
              <Stamp lang={lang} words={t.stamp} />
            </div>
          </div>

          <Section n={1} id="summary" title={t.sections.summary}>
            {t.summary.map((p) => (
              <p className="cv-prose ln" key={p}>{p}</p>
            ))}
          </Section>

          <Section n={2} id="experience" title={t.sections.experience}>
            <Timeline className="cv-timeline" aria-label={t.sections.experience}>
              {t.experience.map((job) => (
                <TimelineItem className="cv-event" key={job.role}>
                  <TimelineMarker className="cv-event-marker" />
                  <TimelineConnector className="cv-event-line" />
                  <div className="cv-entry-head ln">
                    <TimelineTitle className="cv-h3" render={<h3 />}>
                      {job.role} <span className="cv-at">— {job.place}</span>
                    </TimelineTitle>
                    <span className="cv-when">{job.when}</span>
                  </div>
                  <TimelineDescription className="cv-event-body">
                    {job.points.map((point) => (
                      <span className="cv-prose ln" key={point}>{point}</span>
                    ))}
                  </TimelineDescription>
                </TimelineItem>
              ))}
            </Timeline>
          </Section>

          <Section n={3} id="education" title={t.sections.education}>
            <ol className="cv-entries">
              {t.education.map((item) => (
                <li className="cv-entry" key={item.title}>
                  <div className="cv-entry-head ln">
                    <h3 className="cv-h3">{item.title}</h3>
                    <span className="cv-when">{item.when}</span>
                  </div>
                  <p className="cv-prose ln">{item.detail}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section n={4} id="skills" title={t.sections.skills}>
            <dl className="cv-skills">
              {t.skills.map((row) => (
                <div className="cv-skill-row ln" key={row.group}>
                  <dt>{row.group}</dt>
                  <dd>
                    {row.items.map((item) => (
                      <span className="cv-tag" key={item}>{item}</span>
                    ))}
                  </dd>
                </div>
              ))}
            </dl>
          </Section>

          <Section n={5} id="projects" title={t.sections.projects}>
            <ol className="cv-exhibits">
              {exhibits.map((ex, i) => (
                <Exhibit key={ex.id} exhibit={ex} index={i} t={t} />
              ))}
            </ol>
          </Section>

          <Section n={6} id="interests" title={t.sections.interests}>
            {t.interests.map((item) => (
              <p className="cv-prose ln" key={item.label}>
                <em className="cv-runin">{item.label}.</em> {item.text}
              </p>
            ))}
          </Section>

          <Section n={7} id="contact" title={t.sections.contact}>
            <ul className="cv-contacts">
              {contacts.map((c) => (
                <li className="cv-contact ln" key={c.id}>
                  <span className="cv-contact-label">{c.label}</span>
                  <span className="cv-leader" aria-hidden="true" />
                  {c.href ? (
                    <a className="cv-link" href={c.href} target="_blank" rel="noopener noreferrer">{c.handle}</a>
                  ) : (
                    // No public profile to link to (Discord): copy the handle.
                    <Tooltip delay={200}>
                      <TooltipTrigger
                        render={<Button className="cv-copy" onClick={() => copy(c.handle, c.label)} />}
                      >
                        {c.handle}
                      </TooltipTrigger>
                      <TooltipContent className="cv-tip" side="top">{t.ui.copy}</TooltipContent>
                    </Tooltip>
                  )}
                </li>
              ))}
            </ul>
          </Section>

          <footer className="cv-sign" style={{ "--i": 8 }}>
            <p className="cv-signoff ln">{t.signoff}</p>
            <p className="cv-signature ln">/s/ {t.caption.name}</p>
            <p className="cv-signline ln">{t.caption.name}</p>
          </footer>
        </main>
      </div>

      <ToastRegion className="cv-toasts" aria-label={t.ui.notifications}>
        {() => (
          <Toast className="cv-toast">
            <ToastTitle className="cv-toast-title" />
            <ToastDescription className="cv-toast-desc" />
          </Toast>
        )}
      </ToastRegion>
    </div>
  );
}
