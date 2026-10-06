import { useState } from "react";

const FILTERS = ["All information", "Imported from CV", "Questionnaire answers"];

const SECTIONS = [
  { key: "personal", title: "Personal information", sub: "John Doe · San Francisco · john.doe@gmail.com" },
  { key: "goal", title: "Career goal", sub: "Product Designer · Full-time · Remote / San Francisco" },
  { key: "summary", title: "Professional summary", sub: "Product Designer with 4+ years of experience creating intuitive SaaS products." },
  { key: "education", title: "Education", sub: "B.Sc. Cognitive Science · University of California, Berkeley · 2022" },
  { key: "experience", title: "Experience", sub: "Product Designer at Figma · June 2022 — Present" },
  { key: "skills", title: "Skills", sub: "User Research · Interaction Design · Figma · Prototyping" },
  { key: "languages", title: "Languages & additional", sub: "English (Native) · French (C1) · UX Certified Professional" },
];

export default function ReviewStep({ onEditSection }) {
  const [filter, setFilter] = useState(FILTERS[0]);

  return (
    <div style={{ width: "100%" }}>
      <h1>Review your answers</h1>
      <p className="subtitle">Everything from your questionnaire and imported CV is now in one place. Edit any section before choosing a template.</p>

      <div className="banner banner-success">
        <span className="banner-icon">✅</span>
        <div>
          <strong>Your profile is 96% complete</strong>
          <p>All required sections are ready. Optional details can still be added in the editor.</p>
        </div>
      </div>

      <div className="filter-row">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`filter-pill ${filter === f ? "selected" : ""}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className="review-list">
        {SECTIONS.map((section) => (
          <div className="review-item" key={section.key}>
            <div className="review-item-left">
              <span className="review-check">✓</span>
              <div>
                <div className="review-item-title">{section.title}</div>
                <div className="review-item-sub">{section.sub}</div>
              </div>
            </div>
            <button className="btn btn-secondary" type="button" onClick={() => onEditSection?.(section.key)}>
              Edit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
