const OPPORTUNITY_TYPES = ["Internship", "First job", "Full-time", "Freelance", "Academic"];

export default function CareerGoal({ data, onChange }) {
  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  return (
    <>
      <h1>Target Career Goal</h1>
      <p className="subtitle">Define your objective so our AI can structure descriptions tailored precisely to your target roles.</p>

      <div className="field">
        <label htmlFor="targetJobTitle">Target Job Title</label>
        <input id="targetJobTitle" value={data.targetJobTitle} onChange={(e) => set("targetJobTitle", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="sector">Professional Field / Sector</label>
        <select id="sector" value={data.sector} onChange={(e) => set("sector", e.target.value)}>
          <option>Design &amp; Creative</option>
          <option>Software Engineering</option>
          <option>Data &amp; Analytics</option>
          <option>Marketing</option>
          <option>Finance</option>
          <option>Other</option>
        </select>
      </div>

      <div className="field">
        <label>Target Opportunity Type</label>
        <div className="pill-group">
          {OPPORTUNITY_TYPES.map((type) => (
            <button
              key={type}
              type="button"
              className={`pill ${data.opportunityType === type ? "selected" : ""}`}
              onClick={() => set("opportunityType", type)}
            >
              {type}
            </button>
          ))}
        </div>
      </div>

      <div className="field">
        <label htmlFor="location">Target Location</label>
        <input id="location" value={data.location} onChange={(e) => set("location", e.target.value)} />
      </div>

      <div className="field">
        <label htmlFor="jobDescription">
          Paste a Job Description <span className="optional">Optional</span>
        </label>
        <textarea
          id="jobDescription"
          placeholder="Copy and paste the exact target job description here..."
          value={data.jobDescription}
          onChange={(e) => set("jobDescription", e.target.value)}
        />
        <p className="hint">We will automatically scan this text for industry keywords and match your achievements to these metrics.</p>
      </div>
    </>
  );
}

export const emptyCareerGoal = {
  targetJobTitle: "",
  sector: "Design & Creative",
  opportunityType: "Full-time",
  location: "",
  jobDescription: "",
};
