// The side projects, shared by the Side Projects page and the classic CV.
import shotGrimorio from "../assets/shot-grimorio.webp";
import shotGrimorioClases from "../assets/shot-grimorio-clases.webp";
import shotGrimorioFicha from "../assets/shot-grimorio-ficha.webp";
import shotUnsubDashboard from "../assets/shot-unsub-dashboard.webp";
import shotUnsubSuscripciones from "../assets/shot-unsub-suscripciones.webp";
import shotUnsubRecordatorios from "../assets/shot-unsub-recordatorios.webp";
import shotPollanzasDashboard from "../assets/shot-pollanzas-dashboard.webp";
import shotPollanzasReportes from "../assets/shot-pollanzas-reportes.webp";
import shotPollanzasAjustes from "../assets/shot-pollanzas-ajustes.webp";

// One row per project, top to bottom. To add one, add a row here:
//   name         text on the row and title of the card
//   group        small label: the site or product it belongs to, in English
//                and Spanish
//   description  text of the card, in English and Spanish
//   href         page that Enter / a click opens, in a new tab
//   shots        captures shown on the card, in turn, on their own. Put each
//                screenshot in media-src/projects/, add an `image shot-...`
//                line to scripts/optimize-media.sh and run
//                `npm run media -- images`.
export const PROJECTS = [
  {
    id: "compendio",
    name: "Compendio D&D",
    group: { en: "Dungeons & Dragons 2024", es: "Dungeons & Dragons 2024" },
    description: {
      en: "A Spanish compendium for Dungeons & Dragons (2024 rules): a spell library and class guides.",
      es: "Compendio de Dungeons & Dragons (reglas 2024) en español: biblioteca de conjuros y guías de clases.",
    },
    href: "https://compendio-dnd.losjuan.com/grimorio",
    shots: [shotGrimorio, shotGrimorioClases, shotGrimorioFicha],
  },
  {
    id: "unsub",
    name: "UnsubTracker",
    group: { en: "Subscriptions", es: "Suscripciones" },
    description: {
      en: "Track and manage all your subscriptions in one place.",
      es: "Controla y gestiona todas tus suscripciones en un solo lugar.",
    },
    href: "https://unsub.losjuan.com/es/",
    shots: [shotUnsubDashboard, shotUnsubSuscripciones, shotUnsubRecordatorios],
  },
  {
    id: "pollanzas",
    name: "Pollanzas Personales",
    group: { en: "Finances", es: "Finanzas" },
    description: {
      en: "Keep track of your income and expenses month by month.",
      es: "Controla tus ingresos y gastos mes a mes.",
    },
    href: "https://pollanzas.losjuan.com/es",
    shots: [shotPollanzasDashboard, shotPollanzasReportes, shotPollanzasAjustes],
  },
];
