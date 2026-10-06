import { useState } from "react";

const SECTIONS = ["Personal details", "Profile", "Experience", "Education", "Skills", "Languages"];

export default function EditStep({ onPreview, onExportPdf }) {
  const [activeSection, setActiveSection] = useState("Experience");
  const [applied, setApplied] = useState(false);

  return (
    <div className="app-shell" style={{ flex: 1 }}>
      <div className="editor-toolbar">
        <div className="editor-toolbar-left">
          <button className="toolbar-chip" type="button">
            Undo
          </button>
          <button className="toolbar-chip" type="button">
            Inter
          </button>
          <button className="toolbar-chip" type="button">
            11 px
          </button>
          <button className="toolbar-chip" type="button">
            <strong>B</strong>
          </button>
          <button className="toolbar-chip" type="button">
            Alignment
          </button>
        </div>
        <div className="editor-toolbar-right">
          <span className="saved-indicator">✓ All changes saved</span>
          <button className="btn btn-secondary" type="button" onClick={onPreview}>
            Preview
          </button>
          <button className="btn btn-primary" type="button" onClick={onExportPdf}>
            Export PDF
          </button>
        </div>
      </div>

      <div className="editor-shell">
        <aside className="editor-sidebar">
          <h4>CV sections</h4>
          {SECTIONS.map((s) => (
            <div
              key={s}
              className={`editor-sidebar-item ${activeSection === s ? "active" : ""}`}
              onClick={() => setActiveSection(s)}
            >
              <span>
                <span className="drag-handle">⠿</span>
                {s}
              </span>
              <span>›</span>
            </div>
          ))}
          <button className="editor-add-section" type="button">
            + Add section
          </button>
        </aside>

        <div className="editor-canvas">
          <div className="editor-page">
            <h2>JOHN DOE</h2>
            <div className="role">PRODUCT DESIGNER</div>
            <div className="resume-section-label">PROFESSIONAL PROFILE</div>
            <div className="resume-section-body">
              Product Designer with 4+ years of experience creating intuitive SaaS workflows.
            </div>

            <div className="resume-section-label">EXPERIENCE</div>
            <div className={`editor-block ${activeSection === "Experience" ? "selected" : ""}`} onClick={() => setActiveSection("Experience")}>
              <div className="resume-section-body">
                Product Designer · Figma · 2022–Present
                <br />
                {applied
                  ? "Redesigned the core workspace, increasing user retention by 24% while reducing handoff time by 6 hours per week."
                  : "Led end-to-end workflows and improved retention by 24%."}
                <br />
                Created reusable components for faster delivery.
              </div>
            </div>

            <div className="resume-section-label">EDUCATION</div>
            <div className="resume-section-body">B.Sc. Cognitive Science · UC Berkeley · 2022</div>

            <div className="resume-section-label">SKILLS</div>
            <div className="resume-section-body">User Research · Figma · Prototyping · Design Systems</div>
          </div>
        </div>

        <aside className="editor-ai-dock">
          <div className="editor-ai-dock-header">
            <span>✦ AI Assistant</span>
            <button style={{ background: "none", border: "none", color: "white", cursor: "pointer" }} type="button">
              ✕
            </button>
          </div>
          <div className="editor-ai-dock-body">
            <p style={{ fontSize: 13 }}>I found a way to make your selected achievement more specific and results-driven.</p>
            <div className="ai-suggestion">
              <div className="label">SUGGESTED REVISION</div>
              <p style={{ margin: "0 0 12px" }}>
                &ldquo;Redesigned the core workspace, increasing user retention by 24% while reducing handoff time by
                6 hours per week.&rdquo;
              </p>
              <div style={{ display: "flex", gap: 8 }}>
                <button className="btn btn-primary" type="button" onClick={() => setApplied(true)}>
                  Apply
                </button>
                <button className="btn btn-secondary" type="button">
                  Regenerate
                </button>
              </div>
            </div>
            <p className="try-hint">Try: &ldquo;Make this more concise&rdquo;</p>
          </div>
          <div className="editor-ai-dock-footer">
            <input placeholder="Ask AI for help..." />
            <button type="button" style={{ background: "var(--color-primary)", color: "white", border: "none", borderRadius: "50%", width: 28, height: 28 }}>
              →
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}
