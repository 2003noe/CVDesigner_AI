import { useMemo, useState } from "react";
import TopNav from "./TopNav";
import PersonalInfo from "./steps/PersonalInfo";
import CareerGoal from "./steps/CareerGoal";
import Summary from "./steps/Summary";
import Education from "./steps/Education";
import Experience from "./steps/Experience";
import Skills from "./steps/Skills";
import Languages from "./steps/Languages";
import { ResumeDocument, TEMPLATES, ACCENTS, TYPOGRAPHIES } from "./templates/TemplatePage";
import { buildCvData } from "../lib/cvData";
import { readPhotoFile } from "../lib/image";
import "../final-cv.css";

const TABS = [
  { id: "personal", label: "Personal info" },
  { id: "goal", label: "Career goal" },
  { id: "summary", label: "Summary" },
  { id: "education", label: "Education" },
  { id: "experience", label: "Experience" },
  { id: "skills", label: "Skills" },
  { id: "languages", label: "Languages & more" },
];

const SAVE_LABELS = {
  idle: "",
  dirty: "Unsaved changes…",
  saving: "Saving…",
  saved: "All changes saved",
  error: "Couldn’t save — check your connection",
};

export default function FinalCv({
  form,
  onFormChange, // (section, valueOrUpdater) => void
  templateId,
  design,
  onDesignChange,
  onChangeTemplate,
  onBackToQuestionnaire,
  onNavigate,
  isAuthed,
  saveStatus,
}) {
  const [tab, setTab] = useState("personal");
  const [photoError, setPhotoError] = useState("");
  const template = TEMPLATES.find((item) => item.id === templateId) ?? TEMPLATES[0];
  const cv = useMemo(() => buildCvData(form), [form]);
  const zoom = Number(design.zoom || 85);

  function setDesign(key, value) {
    onDesignChange({ ...design, [key]: value });
  }

  async function handlePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setPhotoError("");
    if (!file) return;
    const { dataUrl, error } = await readPhotoFile(file);
    if (error) setPhotoError(error);
    else setDesign("photo", dataUrl);
  }

  // Le navigateur propose « Enregistrer au format PDF » : le PDF obtenu garde le texte
  // sélectionnable (important pour les logiciels de recrutement / ATS).
  function handleDownload() {
    const previousTitle = document.title;
    document.title = cv.isSample ? "CV" : `CV - ${cv.name || "CV"}`;
    const restore = () => {
      document.title = previousTitle;
      window.removeEventListener("afterprint", restore);
    };
    window.addEventListener("afterprint", restore);
    window.print();
  }

  const set = (section) => (value) => onFormChange(section, value);

  return (
    <div className="app-shell final-cv-shell">
      <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />

      <div className="final-cv-bar">
        <div>
          <h1>Your CV is ready 🎉</h1>
          <p>
            {template.name} template · edit anything on the right and the CV updates instantly.
            {SAVE_LABELS[saveStatus] ? <span className={`final-cv-save ${saveStatus}`}> {SAVE_LABELS[saveStatus]}</span> : null}
          </p>
        </div>
        <div className="final-cv-actions">
          <button className="btn btn-secondary" type="button" onClick={onBackToQuestionnaire}>
            Back to questionnaire
          </button>
          <button className="btn btn-secondary" type="button" onClick={onChangeTemplate}>
            Change template
          </button>
          <button className="btn btn-primary" type="button" onClick={handleDownload}>
            ⬇ Download PDF
          </button>
        </div>
      </div>

      <div className="final-cv-workspace">
        <section className="final-cv-preview">
          <div className="final-cv-paper" style={{ "--final-zoom": zoom / 100 }}>
            <div className="final-cv-print-target">
              <ResumeDocument template={template} design={design} cv={cv} />
            </div>
          </div>
          <label className="final-cv-zoom">
            <span>Preview size</span>
            <input
              type="range"
              min="50"
              max="130"
              step="5"
              value={zoom}
              onChange={(e) => setDesign("zoom", Number(e.target.value))}
              aria-label="Preview size"
            />
            <output>{zoom}%</output>
          </label>
        </section>

        <aside className="final-cv-editor">
          <div className="final-cv-design">
            <div className="final-cv-photo">
              {design.photo ? <img src={design.photo} alt="" /> : <span>+</span>}
              <div>
                <strong>Profile photo</strong>
                <label className="photo-button">
                  {design.photo ? "Change" : "Add photo"}
                  <input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} />
                </label>
                {design.photo && (
                  <button className="link-btn" type="button" onClick={() => setDesign("photo", "")}>
                    Remove
                  </button>
                )}
              </div>
            </div>
            {photoError && <p className="photo-error">{photoError}</p>}

            <div className="final-cv-design-row">
              <label>
                <span>Font</span>
                <select value={design.typography} onChange={(e) => setDesign("typography", e.target.value)}>
                  {TYPOGRAPHIES.map((font) => <option key={font}>{font}</option>)}
                </select>
              </label>
              <label>
                <span>Spacing</span>
                <select value={design.spacing} onChange={(e) => setDesign("spacing", e.target.value)}>
                  <option>Compact</option>
                  <option>Balanced</option>
                  <option>Relaxed</option>
                </select>
              </label>
            </div>
            <div className="designer-v2-colors">
              {ACCENTS.map((color) => (
                <button
                  key={color.color}
                  className={design.accent === color.color ? "active" : ""}
                  type="button"
                  aria-label={color.name}
                  onClick={() => setDesign("accent", color.color)}
                >
                  <span style={{ background: color.color }} />
                </button>
              ))}
              <label className="custom-color">
                <input type="color" value={design.accent} onChange={(e) => setDesign("accent", e.target.value)} />
              </label>
            </div>
          </div>

          <div className="final-cv-tabs" role="tablist">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                role="tab"
                aria-selected={tab === item.id}
                className={tab === item.id ? "active" : ""}
                onClick={() => setTab(item.id)}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="final-cv-form">
            {tab === "personal" && <PersonalInfo data={form.personalInfo} onChange={set("personalInfo")} hidePhoto />}
            {tab === "goal" && <CareerGoal data={form.careerGoal} onChange={set("careerGoal")} />}
            {tab === "summary" && <Summary data={form.summary} onChange={set("summary")} />}
            {tab === "education" && <Education entries={form.education} onChange={set("education")} />}
            {tab === "experience" && (
              <Experience
                experienceType={form.experienceType}
                onExperienceTypeChange={set("experienceType")}
                entries={form.experience}
                onChange={set("experience")}
              />
            )}
            {tab === "skills" && <Skills data={form.skills} onChange={set("skills")} />}
            {tab === "languages" && <Languages data={form.languages} onChange={set("languages")} />}
          </div>
        </aside>
      </div>
    </div>
  );
}
