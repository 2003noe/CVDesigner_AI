import TagInput from "../TagInput";

const EXPERIENCE_TYPES = [
  "Work experience",
  "Internships",
  "Freelance",
  "Volunteering",
  "Academic projects",
  "Personal projects",
  "No experience yet",
];

function emptyEntry() {
  return {
    id: crypto.randomUUID(),
    jobTitle: "",
    company: "",
    startDate: "",
    endDate: "",
    current: false,
    responsibilities: "",
    achievements: "",
    tools: [],
  };
}

export default function Experience({ experienceType, onExperienceTypeChange, entries, onChange }) {
  function updateEntry(id, patch) {
    onChange(entries.map((e) => (e.id === id ? { ...e, ...patch } : e)));
  }

  function removeEntry(id) {
    onChange(entries.filter((e) => e.id !== id));
  }

  function addEntry() {
    onChange([...entries, emptyEntry()]);
  }

  return (
    <>
      <div className="sub-card" style={{ marginBottom: 24 }}>
        <label style={{ fontWeight: 700, fontSize: 14, display: "block", marginBottom: 14 }}>
          What type of experience do you have?
        </label>
        <div className="pill-group">
          {EXPERIENCE_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`pill ${experienceType === type ? "selected" : ""}`}
              onClick={() => onExperienceTypeChange(type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      {entries.map((entry, i) => (
        <div className="sub-card" key={entry.id}>
          <div className="sub-card-header">
            <h3>Experience Entry #{i + 1}</h3>
            {entries.length > 1 && (
              <button className="remove-btn" type="button" onClick={() => removeEntry(entry.id)}>
                Remove
              </button>
            )}
          </div>

          <div className="field-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Job Title</label>
              <input
                placeholder="e.g. Software Engineer"
                value={entry.jobTitle}
                onChange={(e) => updateEntry(entry.id, { jobTitle: e.target.value })}
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Company / Organization</label>
              <input
                placeholder="e.g. Google"
                value={entry.company}
                onChange={(e) => updateEntry(entry.id, { company: e.target.value })}
              />
            </div>
          </div>

          <div className="field-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Start Date</label>
              <input
                placeholder="MM / YYYY"
                value={entry.startDate}
                onChange={(e) => updateEntry(entry.id, { startDate: e.target.value })}
              />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>End Date</label>
              <input
                placeholder={entry.current ? "Present" : "MM / YYYY"}
                value={entry.current ? "Present" : entry.endDate}
                onChange={(e) => updateEntry(entry.id, { endDate: e.target.value })}
                disabled={entry.current}
              />
            </div>
          </div>

          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={entry.current}
              onChange={(e) => updateEntry(entry.id, { current: e.target.checked })}
            />
            Currently working here
          </label>

          {(entry.jobTitle || entry.company) && (
            <>
              <div className="field">
                <label>Key Responsibilities</label>
                <textarea
                  value={entry.responsibilities}
                  onChange={(e) => updateEntry(entry.id, { responsibilities: e.target.value })}
                />
              </div>

              <div className="field">
                <label>Key Achievements</label>
                <textarea
                  value={entry.achievements}
                  onChange={(e) => updateEntry(entry.id, { achievements: e.target.value })}
                />
              </div>

              <div className="field" style={{ marginBottom: 0 }}>
                <label>Technologies &amp; Tools Used</label>
                <TagInput
                  tags={entry.tools}
                  onChange={(tags) => updateEntry(entry.id, { tools: tags })}
                  placeholder="Add tag"
                />
              </div>
            </>
          )}
        </div>
      ))}

      <button className="add-entry-btn" type="button" onClick={addEntry}>
        + Add another experience
      </button>
    </>
  );
}

export const emptyExperienceEntries = [emptyEntry()];
