import { E } from "./Editable";

// Page A4 vierge affichée tant que le CV est vide : on peut déjà y écrire le nom et le titre,
// et un clic sur n'importe quelle zone ouvre le panneau correspondant.
export default function EmptySheet({ form, onJump }) {
  return (
    <div className="ed-empty-sheet">
      <div className="ed-empty-head">
        <button type="button" className="ed-empty-photo" aria-label="Add photo" onClick={() => onJump("personal")}>
          <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true">
            <path d="M12 5v14M5 12h14" />
          </svg>
        </button>
        <div className="ed-empty-id">
          <div className="ed-empty-name">
            <E f="name" v={form.personalInfo.fullName} ph="Your name" />
          </div>
          <div className="ed-empty-role">
            <E f="role" v={form.careerGoal.targetJobTitle} ph="Job title" />
          </div>
          <button type="button" className="ed-empty-contact" onClick={() => onJump("personal")}>
            email · phone · city
          </button>
        </div>
      </div>
      <div className="ed-empty-rule" />

      {[
        ["summary", "SUMMARY", [100, 94, 62]],
        ["experience", "EXPERIENCE", [44, 100, 88, 38, 96, 70]],
        ["education", "EDUCATION", [50, 72]],
      ].map(([key, title, bars]) => (
        <button type="button" key={key} className="ed-empty-block" onClick={() => onJump(key)} aria-label={`Edit ${title.toLowerCase()}`}>
          <span className="ed-empty-title">{title}</span>
          {bars.map((width, index) => (
            <span key={index} className="ed-empty-bar" style={{ width: `${width}%` }} />
          ))}
        </button>
      ))}
      <button type="button" className="ed-empty-block" onClick={() => onJump("skills")} aria-label="Edit skills">
        <span className="ed-empty-title">SKILLS</span>
        <span className="ed-empty-chips">
          <span style={{ width: 70 }} />
          <span style={{ width: 92 }} />
          <span style={{ width: 58 }} />
        </span>
      </button>

      <div className="ed-empty-hint" role="note">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <path d="M12 3l1.9 5.1L19 10l-5.1 1.9L12 17l-1.9-5.1L5 10l5.1-1.9z" />
        </svg>
        Click any text on the page to edit it
      </div>
    </div>
  );
}
