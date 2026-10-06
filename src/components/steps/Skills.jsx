import { useState } from "react";

const PROFICIENCY_LEVELS = ["Beginner", "Intermediate", "Advanced", "Expert"];

const SUGGESTED_SKILLS = ["Prototyping", "Design Systems", "UI Design", "Information Architecture"];

const CATEGORY_LABELS = {
  technical: "Technical Skills",
  soft: "Soft Skills",
  tools: "Tools & Software",
  programming: "Programming Languages",
};

function SkillCategory({ label, skills, onAdd, onRemove, onLevelChange }) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  function commit() {
    const value = draft.trim();
    if (value) onAdd(value);
    setDraft("");
    setAdding(false);
  }

  return (
    <>
      <div className="section-title">{label}</div>
      <div className="sub-card">
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginBottom: 12 }}>
          {skills.map((skill) => (
            <span className="tag" key={skill.name} style={{ paddingRight: 4 }}>
              {skill.name}
              <select
                value={skill.level}
                onChange={(e) => onLevelChange(skill.name, e.target.value)}
                style={{
                  border: "none",
                  background: "transparent",
                  color: "var(--color-primary)",
                  fontWeight: 600,
                  fontSize: 12,
                }}
              >
                {PROFICIENCY_LEVELS.map((lvl) => (
                  <option key={lvl}>{lvl}</option>
                ))}
              </select>
              <button type="button" onClick={() => onRemove(skill.name)} aria-label={`Remove ${skill.name}`}>
                ✕
              </button>
            </span>
          ))}
        </div>
        {adding ? (
          <input
            className="tag-add-input"
            autoFocus
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && commit()}
            onBlur={commit}
            style={{ border: "1px solid var(--color-border)", borderRadius: 8, padding: "6px 10px" }}
          />
        ) : (
          <button className="add-tag-btn" type="button" onClick={() => setAdding(true)}>
            + Add skill
          </button>
        )}
      </div>
    </>
  );
}

export default function Skills({ data, onChange }) {
  function addSkill(category, name) {
    if (data[category].some((s) => s.name.toLowerCase() === name.toLowerCase())) return;
    onChange({ ...data, [category]: [...data[category], { name, level: "Intermediate" }] });
  }

  function removeSkill(category, name) {
    onChange({ ...data, [category]: data[category].filter((s) => s.name !== name) });
  }

  function setLevel(category, name, level) {
    onChange({
      ...data,
      [category]: data[category].map((s) => (s.name === name ? { ...s, level } : s)),
    });
  }

  return (
    <>
      <h1>Skills &amp; Proficiencies</h1>
      <p className="subtitle">Map out your key abilities and grade your proficiency so recruiters see your exact strengths.</p>

      <div className="ai-suggestion" style={{ marginBottom: 24 }}>
        <div className="label">✦ Based on your experience, we suggest:</div>
        <div style={{ display: "flex", flexWrap: "wrap", gap: 10, marginTop: 8 }}>
          {SUGGESTED_SKILLS.map((skill) => (
            <span key={skill} style={{ fontSize: 13 }}>
              {skill}{" "}
              <button
                type="button"
                className="auth-link"
                style={{ fontWeight: 700 }}
                onClick={() => addSkill("technical", skill)}
              >
                + Add
              </button>
            </span>
          ))}
        </div>
      </div>

      {Object.entries(CATEGORY_LABELS).map(([key, label]) => (
        <SkillCategory
          key={key}
          label={label}
          skills={data[key]}
          onAdd={(name) => addSkill(key, name)}
          onRemove={(name) => removeSkill(key, name)}
          onLevelChange={(name, level) => setLevel(key, name, level)}
        />
      ))}
    </>
  );
}

export const emptySkills = {
  technical: [],
  soft: [],
  tools: [],
  programming: [],
};
