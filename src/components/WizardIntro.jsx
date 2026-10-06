import { WIZARD_STEPS } from "./StepIndicator";

const TOPICS = [
  "Personal Info",
  "Career Goals",
  "Professional Summary",
  "Education & Qualifications",
  "Work Experience",
  "Core Skills",
  "Languages & Accents",
];

export default function WizardIntro({ onStart, onNavigate }) {
  return (
    <div className="wizard-body">
      <div className="wizard-card" style={{ textAlign: "center", maxWidth: 900 }}>
        <span className="eyebrow-pill" style={{ background: "var(--color-primary-light)", color: "var(--color-primary)" }}>
          ⏱ Estimated time: ~10 minutes
        </span>
        <h1 style={{ marginTop: 20 }}>Let&rsquo;s create your professional CV</h1>
        <p className="subtitle">
          Answer a few simple questions and we&rsquo;ll help you build a professional CV. You can save
          your progress and complete the details at any time.
        </p>

        <div style={{ background: "var(--color-bg)", borderRadius: 16, padding: 24, textAlign: "left", margin: "24px 0" }}>
          <div style={{ fontWeight: 700, fontSize: 14, marginBottom: 16 }}>What we&rsquo;ll ask you:</div>
          <div style={{ display: "flex", flexWrap: "wrap", gap: 12 }}>
            {TOPICS.map((topic, i) => (
              <span
                key={topic}
                style={{
                  background: "var(--color-surface)",
                  border: "1px solid var(--color-border)",
                  borderRadius: 10,
                  padding: "10px 16px",
                  fontSize: 13,
                }}
              >
                <strong style={{ color: "var(--color-primary)" }}>{i + 1}</strong> &nbsp;{topic}
              </span>
            ))}
          </div>
        </div>

        <button className="btn btn-primary btn-full" type="button" onClick={onStart}>
          Let&rsquo;s get started
        </button>
        <p className="auth-footer">
          Already have a CV?{" "}
          <button className="auth-link" type="button" onClick={() => onNavigate("import")}>
            Upload existing &amp; skip questionnaire
          </button>
        </p>
      </div>
    </div>
  );
}
