import { useEffect, useRef, useState } from "react";

const PARSED_SECTIONS = [
  { label: "Personal information", count: "8 fields found" },
  { label: "Work experience", count: "2 positions found" },
  { label: "Education", count: "1 degree found" },
  { label: "Skills", count: "14 skills found" },
  { label: "Languages", count: "2 languages found" },
];

export default function ImportStep({ onContinue }) {
  const [fileName, setFileName] = useState(null);
  const [progress, setProgress] = useState(0);
  const intervalRef = useRef(null);

  function startExtraction(name) {
    setFileName(name);
    setProgress(0);
    clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setProgress((p) => {
        const next = Math.min(p + 20, 100);
        if (next === 100) clearInterval(intervalRef.current);
        return next;
      });
    }, 300);
  }

  useEffect(() => () => clearInterval(intervalRef.current), []);

  function handleFileChange(e) {
    const file = e.target.files?.[0];
    if (file) startExtraction(file.name);
    else startExtraction("JohnDoe_Resume_2026.pdf");
  }

  function handleDrop(e) {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    startExtraction(file ? file.name : "JohnDoe_Resume_2026.pdf");
  }

  if (!fileName || progress < 100) {
    return (
      <div className="wizard-card import-card" style={{ margin: "0 auto" }}>
        <h1 style={{ textAlign: "center" }}>Import your existing CV</h1>
        <p className="subtitle" style={{ textAlign: "center" }}>
          Upload your CV and we&rsquo;ll extract the information automatically.
        </p>

        <div className="dropzone" onDragOver={(e) => e.preventDefault()} onDrop={handleDrop}>
          <div className="cloud-icon">⬆</div>
          <p>Drag &amp; drop your CV here</p>
          <div className="hint">Supports PDF, DOCX, or RTF up to 10MB</div>
          <label className="btn btn-secondary" style={{ display: "inline-block", cursor: "pointer" }}>
            Browse Files
            <input type="file" accept=".pdf,.docx,.rtf" style={{ display: "none" }} onChange={handleFileChange} />
          </label>
        </div>

        {fileName && (
          <div className="progress-card">
            <div className="progress-card-top">
              <span>✦ Extracting information from your CV...</span>
              <span>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-bar-fill" style={{ width: `${progress}%` }} />
            </div>
            <div className="progress-file">
              <span>{fileName}</span>
              <span>Parsing skills, employment dates, and degree hierarchies...</span>
            </div>
          </div>
        )}
      </div>
    );
  }

  return (
    <div style={{ width: "100%" }}>
      <h1>Your CV has been extracted</h1>
      <p className="subtitle">We analyzed {fileName}. Review the parsed sections before continuing.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1.6fr 1fr", gap: 24, alignItems: "start" }}>
        <div className="wizard-card" style={{ maxWidth: "none" }}>
          <div className="banner banner-success">
            <span className="banner-icon">✅</span>
            <div>
              <strong>Extraction complete</strong>
              <p>100% complete · 27 fields identified in 8 seconds</p>
            </div>
          </div>
          <div className="progress-bar" style={{ marginBottom: 24 }}>
            <div className="progress-bar-fill" style={{ width: "100%" }} />
          </div>

          <div className="section-title" style={{ marginTop: 0 }}>
            Parsed sections
          </div>
          <div className="parsed-list">
            {PARSED_SECTIONS.map((s) => (
              <div className="parsed-row" key={s.label}>
                <span>✓ {s.label}</span>
                <span className="count">{s.count}</span>
              </div>
            ))}
          </div>

          <button className="btn btn-primary btn-full" type="button" style={{ marginTop: 16 }} onClick={onContinue}>
            Validate extracted information
          </button>
        </div>

        <div className="file-card">
          <div className="file-icon">📄</div>
          <div className="file-name">{fileName}</div>
          <div className="file-meta">2 pages · 1.8 MB · English</div>
          <div className="quality-note">
            <div className="label">✦ High quality scan</div>
            <div>Overall extraction confidence: 92%</div>
          </div>
          <p className="hint" style={{ marginBottom: 16 }}>
            3 items need your attention. They are highlighted on the next screen.
          </p>
          <button className="btn btn-secondary btn-full" type="button" onClick={() => { setFileName(null); setProgress(0); }}>
            Replace file
          </button>
        </div>
      </div>
    </div>
  );
}
