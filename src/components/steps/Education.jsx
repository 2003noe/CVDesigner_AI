import TagInput from "../TagInput";

function emptyEntry() {
  return {
    id: crypto.randomUUID(),
    degreeType: "Bachelor's Degree",
    fieldOfStudy: "",
    institution: "",
    startDate: "",
    endDate: "",
    current: false,
    coursework: [],
    achievements: "",
  };
}

export default function Education({ entries, onChange }) {
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
      <h1>Education</h1>
      <p className="subtitle">Add details about your degrees, academic achievements, and core coursework.</p>

      {entries.map((entry, i) => (
        <div className="sub-card" key={entry.id}>
          {entries.length > 1 && (
            <div className="sub-card-header">
              <h3>Education Entry #{i + 1}</h3>
              <button className="remove-btn" type="button" onClick={() => removeEntry(entry.id)}>
                Remove
              </button>
            </div>
          )}

          <div className="field-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Degree Type</label>
              <select
                value={entry.degreeType}
                onChange={(e) => updateEntry(entry.id, { degreeType: e.target.value })}
              >
                <option>High School Diploma</option>
                <option>Associate Degree</option>
                <option>Bachelor's Degree</option>
                <option>Master's Degree</option>
                <option>Doctorate</option>
              </select>
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label>Field of Study</label>
              <input
                value={entry.fieldOfStudy}
                onChange={(e) => updateEntry(entry.id, { fieldOfStudy: e.target.value })}
              />
            </div>
          </div>

          <div className="field">
            <label>Institution Name</label>
            <input
              value={entry.institution}
              onChange={(e) => updateEntry(entry.id, { institution: e.target.value })}
            />
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
                placeholder="MM / YYYY"
                value={entry.endDate}
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
            I&rsquo;m currently studying here
          </label>

          <div className="field">
            <label>
              Relevant Coursework <span className="optional">Optional</span>
            </label>
            <TagInput
              tags={entry.coursework}
              onChange={(tags) => updateEntry(entry.id, { coursework: tags })}
              placeholder="Add tag"
            />
          </div>

          <div className="field" style={{ marginBottom: 0 }}>
            <label>
              Academic Achievements <span className="optional">Optional</span>
            </label>
            <textarea
              value={entry.achievements}
              onChange={(e) => updateEntry(entry.id, { achievements: e.target.value })}
            />
          </div>
        </div>
      ))}

      <button className="add-entry-btn" type="button" onClick={addEntry}>
        + Add another education
      </button>
    </>
  );
}

export const emptyEducationEntries = [emptyEntry()];
