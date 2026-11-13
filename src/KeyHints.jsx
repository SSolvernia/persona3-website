// The key reminders in the bottom-right corner of every page.
// `keys` is a list of [key, action] pairs, e.g. [["↑↓", "SELECT"], ["ESC", "BACK"]].
export default function KeyHints({ keys }) {
  return (
    <div className="key-hints" aria-hidden="true">
      {keys.map(([key, action]) => (
        <div className="key-hints-row" key={key}>
          <span className="key-hints-key">{key}</span>
          <span>{action}</span>
        </div>
      ))}
    </div>
  )
}
