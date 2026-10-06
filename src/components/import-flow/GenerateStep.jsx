import { useState } from "react";

const SUGGESTIONS = [
  "Add one metric to your latest achievement",
  'Include "Design Systems" in your summary',
  "Shorten the education details",
];

export default function GenerateStep({ onOpenEditor, templateName = "Modern Focus" }) {
  const [applied, setApplied] = useState([]);

  const allApplied = applied.length === SUGGESTIONS.length;

  return (
    <div style={{ width: "100%" }}>
      <h1>Your AI-generated CV is ready</h1>
      <p className="subtitle">We tailored your content for Product Designer roles and optimized it for applicant tracking systems.</p>

      <div className="banner banner-success">
        <span className="banner-icon">✅</span>
        <div>
          <strong>Generation complete</strong>
          <p>{templateName} template · Content tailored from 27 verified fields</p>
        </div>
      </div>

      <div className="generate-layout">
        <div className="resume-frame">
          <div className="resume-page">
            <h2>JOHN DOE</h2>
            <div className="role">PRODUCT DESIGNER</div>
            <div className="contact-line">San Francisco · john.doe@gmail.com · linkedin.com/in/johndoe</div>

            <div className="resume-section-label">PROFILE</div>
            <div className="resume-section-body">
              Product Designer with 4+ years of experience creating intuitive SaaS workflows and scalable design
              systems{allApplied ? ", including reusable component libraries." : "."}
            </div>

            <div className="resume-section-label">EXPERIENCE</div>
            <div className="resume-section-body">
              Product Designer — Figma · 2022–Present
              <br />
              Led end-to-end product design and increased workspace retention by 24%.
              <br />
              Built reusable patterns that accelerated engineering handoff{applied.includes(0) ? " by 6 hours per week." : "."}
            </div>

            <div className="resume-section-label">EDUCATION</div>
            <div className="resume-section-body">
              {applied.includes(2) ? "B.Sc. Cognitive Science — UC Berkeley" : "B.Sc. Cognitive Science — University of California, Berkeley"}
            </div>

            <div className="resume-section-label">SKILLS</div>
            <div className="resume-section-body">
              User Research · Interaction Design · Figma · Prototyping{applied.includes(1) ? " · Design Systems" : ""}
            </div>
          </div>
        </div>

        <div>
          <div className="side-card">
            <div className="side-card-header">
              <h3>ATS compatibility</h3>
              <span className="ats-score">{allApplied ? 96 : 88}</span>
            </div>
            <div className="ats-bar">
              <div className="ats-bar-fill" style={{ width: `${allApplied ? 96 : 88}%` }} />
            </div>
            <p className="hint" style={{ margin: 0 }}>
              Excellent structure, clear headings, and strong keyword coverage.
            </p>
          </div>

          <div className="side-card">
            <h3 style={{ marginBottom: 14 }}>{SUGGESTIONS.length} improvement suggestions</h3>
            {SUGGESTIONS.map((s, i) => (
              <div className={`suggestion-item ${applied.includes(i) ? "applied" : ""}`} key={s}>
                <span className="suggestion-num">{i + 1}</span>
                <span>{s}</span>
              </div>
            ))}
            <button
              className="btn btn-secondary btn-full"
              type="button"
              disabled={allApplied}
              onClick={() => setApplied(SUGGESTIONS.map((_, i) => i))}
            >
              {allApplied ? "All suggestions applied" : "Apply all suggestions"}
            </button>
          </div>

          <button className="btn btn-primary btn-full" type="button" onClick={onOpenEditor}>
            Open full editor
          </button>
        </div>
      </div>
    </div>
  );
}
