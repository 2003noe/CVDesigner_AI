export default function ValidateStep({ data, onChange }) {
  function set(section, field, value) {
    onChange({ ...data, [section]: { ...data[section], [field]: value } });
  }

  function removeSkill(name) {
    onChange({ ...data, skills: data.skills.filter((s) => s !== name) });
  }

  return (
    <div style={{ width: "100%" }}>
      <h1>Validate imported information</h1>
      <p className="subtitle">Confirm the details we found. Fields with lower confidence need a quick review.</p>

      <div className="banner banner-warning">
        <span className="banner-icon">✦</span>
        <div>
          <strong>3 items need attention</strong>
          <p>Check the highlighted date, job title, and skill before continuing.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
        <div className="wizard-card" style={{ maxWidth: "none" }}>
          <div className="side-card-header">
            <h3>Personal information</h3>
            <span className="confidence-label">98% confidence</span>
          </div>
          <div className="field-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Full name</label>
              <input value={data.personal.fullName} onChange={(e) => set("personal", "fullName", e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Email address</label>
              <input value={data.personal.email} onChange={(e) => set("personal", "email", e.target.value)} />
            </div>
          </div>
          <div className="field-row" style={{ marginTop: 20, marginBottom: 0 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Phone</label>
              <input value={data.personal.phone} onChange={(e) => set("personal", "phone", e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Location</label>
              <input value={data.personal.location} onChange={(e) => set("personal", "location", e.target.value)} />
            </div>
          </div>
        </div>

        <div className="wizard-card" style={{ maxWidth: "none" }}>
          <div className="side-card-header">
            <h3>Education</h3>
            <span className="confidence-label">94%</span>
          </div>
          <div className="field">
            <label>Degree</label>
            <input value={data.education.degree} onChange={(e) => set("education", "degree", e.target.value)} />
          </div>
          <div className="field">
            <label>Institution</label>
            <input value={data.education.institution} onChange={(e) => set("education", "institution", e.target.value)} />
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Dates</label>
            <input value={data.education.dates} onChange={(e) => set("education", "dates", e.target.value)} />
          </div>
        </div>

        <div className="wizard-card" style={{ maxWidth: "none" }}>
          <div className="side-card-header">
            <h3>Experience</h3>
            <span className="confidence-label">84% confidence</span>
          </div>
          <div className="field-row">
            <div className="field needs-review" style={{ marginBottom: 0 }}>
              <label>
                Job title <span className="field-flag">Review</span>
              </label>
              <input value={data.experience.jobTitle} onChange={(e) => set("experience", "jobTitle", e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Company</label>
              <input value={data.experience.company} onChange={(e) => set("experience", "company", e.target.value)} />
            </div>
          </div>
          <div className="field-row" style={{ marginTop: 20 }}>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Start date</label>
              <input value={data.experience.startDate} onChange={(e) => set("experience", "startDate", e.target.value)} />
            </div>
            <div className="field needs-review" style={{ marginBottom: 0 }}>
              <label>
                End date <span className="field-flag">Review</span>
              </label>
              <input value={data.experience.endDate} onChange={(e) => set("experience", "endDate", e.target.value)} />
            </div>
          </div>
          <div className="field" style={{ marginBottom: 0 }}>
            <label>Key achievement</label>
            <input
              value={data.experience.achievement}
              onChange={(e) => set("experience", "achievement", e.target.value)}
            />
          </div>
        </div>

        <div className="wizard-card" style={{ maxWidth: "none" }}>
          <div className="side-card-header">
            <h3>Skills</h3>
            <span className="confidence-label">88%</span>
          </div>
          <div>
            {data.skills.map((skill) => (
              <span className={`skill-chip ${skill === "JavaScript" ? "flagged" : ""}`} key={skill}>
                {skill}
              </span>
            ))}
          </div>
          <p className="skill-warning">⚠ &ldquo;JavaScript&rdquo; may be a tool rather than a core skill.</p>
        </div>
      </div>
    </div>
  );
}

export const initialValidateData = {
  personal: {
    fullName: "John Doe",
    email: "john.doe@gmail.com",
    phone: "+1 (415) 555-2671",
    location: "San Francisco, CA",
  },
  education: {
    degree: "B.Sc. Cognitive Science",
    institution: "UC Berkeley",
    dates: "2018 — 2022",
  },
  experience: {
    jobTitle: "Product Designer",
    company: "Figma",
    startDate: "June 2022",
    endDate: "Present",
    achievement: "Increased retention by 24% through a workspace redesign.",
  },
  skills: ["User Research", "Figma", "Prototyping", "Design Systems", "JavaScript"],
};
