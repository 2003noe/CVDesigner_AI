// Petits contrôles réutilisés par les panneaux de réglages de l'éditeur.

const clamp = (value, min, max) => Math.min(max, Math.max(min, value));
const roundTo = (value, step) => Math.round(value / step) * step;

/** Curseur à pas + boutons − / + (réglages numériques) */
export function RangeRow({ label, display, value, min, max, step = 1, onChange }) {
  const set = (next) => onChange(Number(clamp(roundTo(next, step), min, max).toFixed(2)));
  return (
    <div className="ed-range">
      <div className="ed-range-head">
        <span>{label}</span>
        <span className="ed-range-value">{display}</span>
      </div>
      <div className="ed-range-body">
        <div className="ed-track">
          <div className="ed-ticks" aria-hidden="true">
            {[0, 1, 2, 3, 4, 5, 6].map((tick) => (
              <span key={tick} />
            ))}
          </div>
          <input
            type="range"
            min={min}
            max={max}
            step={step}
            value={value}
            aria-label={label}
            onChange={(event) => set(Number(event.target.value))}
          />
        </div>
        <button className="ed-step" type="button" aria-label={`Decrease ${label}`} onClick={() => set(value - step)}>
          −
        </button>
        <button className="ed-step" type="button" aria-label={`Increase ${label}`} onClick={() => set(value + step)}>
          +
        </button>
      </div>
    </div>
  );
}

/** Boutons à choix unique (une option sélectionnée à la fois) */
export function Choice({ label, options, value, onChange, columns }) {
  return (
    <div className="ed-choice">
      {label && <div className="ed-label">{label}</div>}
      <div className="ed-choice-grid" style={{ gridTemplateColumns: `repeat(${columns ?? options.length}, minmax(0, 1fr))` }}>
        {options.map((option) => (
          <button
            key={option.value}
            type="button"
            className={`ed-opt ${value === option.value ? "is-on" : ""}`}
            aria-pressed={value === option.value}
            onClick={() => onChange(option.value)}
          >
            {option.label}
          </button>
        ))}
      </div>
    </div>
  );
}

/** Case à cocher (afficher / masquer) */
export function Toggle({ label, hint, checked, onChange }) {
  return (
    <label className="ed-toggle">
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} />
      <span className="ed-box" aria-hidden="true">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12l5 5 9-10" />
        </svg>
      </span>
      <span className="ed-toggle-text">
        {label}
        {hint && <small>{hint}</small>}
      </span>
    </label>
  );
}

/** Carte d'un panneau de réglages (une par entrée de la barre verticale) */
export function PanelCard({ id, title, children, note }) {
  return (
    <section className="ed-card" id={`panel-${id}`} data-card={id} aria-labelledby={`panel-${id}-title`}>
      <h2 id={`panel-${id}-title`}>{title}</h2>
      {note && <p className="ed-note">{note}</p>}
      <div className="ed-card-body">{children}</div>
    </section>
  );
}
