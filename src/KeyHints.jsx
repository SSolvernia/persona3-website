import { useLang } from "./lang";

// Spanish for the actions the pages name. Anything not listed (like
// "PARTY 2/3") shows as written.
const ES = {
  NAVIGATE: "NAVEGAR",
  CONFIRM: "CONFIRMAR",
  SELECT: "ELEGIR",
  OPEN: "ABRIR",
  CLOSE: "CERRAR",
  BACK: "VOLVER",
  SWITCH: "CAMBIAR",
  REVEAL: "VER",
};

// The key reminders in the bottom-right corner of every page.
// `keys` is a list of [key, action] pairs, e.g. [["↑↓", "SELECT"], ["ESC", "BACK"]],
// with the action in English; it is translated here.
export default function KeyHints({ keys }) {
  const lang = useLang();
  return (
    <div className="key-hints" aria-hidden="true">
      {keys.map(([key, action]) => (
        <div className="key-hints-row" key={key}>
          <span className="key-hints-key">{key === "SPACE" && lang === "es" ? "ESPACIO" : key}</span>
          <span>{lang === "es" ? ES[action] ?? action : action}</span>
        </div>
      ))}
    </div>
  );
}
