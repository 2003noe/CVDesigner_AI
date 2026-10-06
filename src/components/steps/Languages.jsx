import { useState } from "react";
import TagInput from "../TagInput";

const PROFICIENCY_LEVELS = [
  "Elementary",
  "Limited Working",
  "Professional Working (C1)",
  "Full Professional",
  "Native / Bilingual",
];

function emptyLanguage() {
  return { id: crypto.randomUUID(), name: "", level: "Professional Working (C1)" };
}

function emptyCertification() {
  return { id: crypto.randomUUID(), name: "", issuer: "", dateIssued: "", credentialUrl: "" };
}

function CollapsibleSection({ title, defaultOpen = false, children }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="collapsible">
      <button className="collapsible-header" type="button" onClick={() => setOpen((o) => !o)}>
        <span className="title-group">
          {title} <span className="optional-tag">Optional</span>
        </span>
        <span className={`chevron ${open ? "open" : ""}`}>⌄</span>
      </button>
      {open && <div className="collapsible-body">{children}</div>}
    </div>
  );
}

export default function Languages({ data, onChange }) {
  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  function updateLanguage(id, patch) {
    set("languages", data.languages.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  function addLanguage() {
    set("languages", [...data.languages, emptyLanguage()]);
  }

  function updateCertification(id, patch) {
    set("certifications", data.certifications.map((c) => (c.id === id ? { ...c, ...patch } : c)));
  }

  function addCertification() {
    set("certifications", [...data.certifications, emptyCertification()]);
  }

  return (
    <>
      <h1>Languages &amp; Additional Sections</h1>
      <p className="subtitle">Highlight languages you speak along with extra accomplishments, awards, and hobbies.</p>

      <CollapsibleSection title="Languages" defaultOpen>
        {data.languages.map((lang) => (
          <div className="field-row" key={lang.id}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Language Name</label>
              <input value={lang.name} onChange={(e) => updateLanguage(lang.id, { name: e.target.value })} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Proficiency Level</label>
              <select value={lang.level} onChange={(e) => updateLanguage(lang.id, { level: e.target.value })}>
                {PROFICIENCY_LEVELS.map((lvl) => (
                  <option key={lvl}>{lvl}</option>
                ))}
              </select>
            </div>
          </div>
        ))}
        <button className="auth-link" type="button" onClick={addLanguage} style={{ fontWeight: 600 }}>
          Add another language
        </button>
      </CollapsibleSection>

      <CollapsibleSection title="Certifications" defaultOpen>
        {data.certifications.map((cert) => (
          <div key={cert.id} style={{ marginBottom: 16 }}>
            <div className="field-row">
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Certification Name</label>
                <input value={cert.name} onChange={(e) => updateCertification(cert.id, { name: e.target.value })} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Issuing Organization</label>
                <input value={cert.issuer} onChange={(e) => updateCertification(cert.id, { issuer: e.target.value })} />
              </div>
            </div>
            <div className="field-row">
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Date Issued</label>
                <input
                  placeholder="MM / YYYY"
                  value={cert.dateIssued}
                  onChange={(e) => updateCertification(cert.id, { dateIssued: e.target.value })}
                />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label>Credential URL</label>
                <input
                  value={cert.credentialUrl}
                  onChange={(e) => updateCertification(cert.id, { credentialUrl: e.target.value })}
                />
              </div>
            </div>
          </div>
        ))}
        <button className="auth-link" type="button" onClick={addCertification} style={{ fontWeight: 600 }}>
          Add another certification
        </button>
      </CollapsibleSection>

      <CollapsibleSection title="Projects">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Describe a project you&rsquo;re proud of</label>
          <textarea value={data.projects} onChange={(e) => set("projects", e.target.value)} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Awards & Honors">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>List any awards or honors you&rsquo;ve received</label>
          <textarea value={data.awards} onChange={(e) => set("awards", e.target.value)} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Volunteering">
        <div className="field" style={{ marginBottom: 0 }}>
          <label>Volunteer roles or community involvement</label>
          <textarea value={data.volunteering} onChange={(e) => set("volunteering", e.target.value)} />
        </div>
      </CollapsibleSection>

      <CollapsibleSection title="Interests & Hobbies" defaultOpen>
        <label>Add things you enjoy outside work</label>
        <TagInput tags={data.interests} onChange={(tags) => set("interests", tags)} placeholder="Add tag" />
      </CollapsibleSection>
    </>
  );
}

export const emptyLanguagesData = {
  languages: [emptyLanguage()],
  certifications: [emptyCertification()],
  projects: "",
  awards: "",
  volunteering: "",
  interests: [],
};
