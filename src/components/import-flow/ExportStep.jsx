import { useState } from "react";

export default function ExportStep({ onBackToEditor }) {
  const [fileName, setFileName] = useState("John_Doe_Product_Designer_CV.pdf");
  const [paperSize, setPaperSize] = useState("A4");
  const [quality, setQuality] = useState("High quality");
  const [clickableLinks, setClickableLinks] = useState(true);
  const [downloaded, setDownloaded] = useState(false);

  return (
    <div style={{ width: "100%" }}>
      <h1>Export your CV</h1>
      <p className="subtitle">Review the final document and choose your download settings.</p>

      <div className="export-layout">
        <div className="resume-frame">
          <div className="resume-page">
            <h2>JOHN DOE</h2>
            <div className="role">PRODUCT DESIGNER</div>
            <div className="resume-section-label">PROFILE</div>
            <div className="resume-section-body">Recruiter-ready content formatted for clear ATS parsing.</div>
            <div className="resume-section-label">EXPERIENCE</div>
            <div className="resume-section-body">
              Product Designer — Figma, 2022–Present
              <br />
              Improved retention by 24% through a core workspace redesign.
            </div>
            <div className="resume-section-label">EDUCATION</div>
            <div className="resume-section-body">Recruiter-ready content formatted for clear ATS parsing.</div>
            <div className="resume-section-label">SKILLS</div>
            <div className="resume-section-body">Recruiter-ready content formatted for clear ATS parsing.</div>
          </div>
          <p className="paper-caption">Page 1 of 1 · 100%</p>
        </div>

        <div>
          <div className="export-panel">
            <h3>Export settings</h3>
            <div className="field">
              <label>File name</label>
              <input value={fileName} onChange={(e) => setFileName(e.target.value)} />
            </div>

            <div className="field">
              <label>Paper size</label>
              <div className="pill-group">
                {["A4", "US Letter"].map((size) => (
                  <button
                    key={size}
                    type="button"
                    className={`pill ${paperSize === size ? "selected" : ""}`}
                    onClick={() => setPaperSize(size)}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="field">
              <label>Quality</label>
              <div className="pill-group">
                {["High quality", "Smaller file"].map((q) => (
                  <button
                    key={q}
                    type="button"
                    className={`pill ${quality === q ? "selected" : ""}`}
                    onClick={() => setQuality(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            </div>

            <label className="checkbox-row">
              <input type="checkbox" checked={clickableLinks} onChange={(e) => setClickableLinks(e.target.checked)} />
              Include clickable links
            </label>

            <button className="btn btn-primary btn-full" type="button" onClick={() => setDownloaded(true)}>
              Download PDF
            </button>
          </div>

          <div className="banner banner-success" style={{ marginTop: 20, marginBottom: 20 }}>
            <span className="banner-icon">✅</span>
            <div>
              <strong>Ready to download</strong>
              <p>ATS score 88 · 1 page · Estimated file size 620 KB</p>
            </div>
          </div>

          {downloaded && (
            <div className="export-panel">
              <div style={{ fontSize: 20, marginBottom: 10 }}>✅</div>
              <h3>Your PDF is ready</h3>
              <p className="hint" style={{ marginBottom: 16 }}>
                {fileName} was generated successfully.
              </p>
              <div style={{ display: "flex", gap: 10 }}>
                <button className="btn btn-secondary" type="button" onClick={() => setDownloaded(true)}>
                  Download again
                </button>
                <button className="btn btn-secondary" type="button" onClick={onBackToEditor}>
                  Back to editor
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
