import { useMemo, useState } from "react";
import TopNav from "../TopNav";
import StepIndicator, { IMPORT_STEPS } from "../StepIndicator";

const TEMPLATES = [
  {
    id: "modern-focus",
    name: "Modern Focus",
    style: "Modern",
    layout: "Single column",
    description: "Crisp sans typography, a compact contact masthead and restrained color for a focused first impression.",
    badge: "Recommended for you",
    details: "Matches your technology industry, modern visual style and single-column preference. Clear section labels give a mid-career product design profile a confident structure.",
    features: ["Compact contact masthead", "Subtle section labels", "Aligned, easy-to-scan content"],
    variant: "modern",
    typography: "Inter",
    spacing: "Balanced",
  },
  {
    id: "compact-ats",
    name: "Compact ATS",
    style: "Text-first",
    layout: "Single column",
    description: "A simple, text-first single-column CV with conventional headings and high legibility.",
    badge: "Text-first · compact",
    details: "Fits a single-column preference when content should do the talking. Straightforward headings and compact spacing favor a plain presentation; this is not a certification of ATS performance.",
    features: ["Conventional text-only sections", "No decorative graphs or rating bars", "Compact spacing, clear reading order"],
    variant: "compact",
    typography: "Inter",
    spacing: "Compact",
  },
  {
    id: "classic-professional",
    name: "Classic Professional",
    style: "Classic",
    layout: "Single column",
    description: "A timeless single-column CV with serif headings, fine rules and a clear chronological story.",
    badge: "Classic · formal",
    details: "A strong starting point for established organizations and a traditional professional style. The familiar reading order keeps experience easy to follow.",
    features: ["Disciplined, ruled sections", "Centered serif masthead", "One clear reading column"],
    variant: "classic",
    typography: "Georgia + Inter",
    spacing: "Balanced",
  },
  {
    id: "minimal-grid",
    name: "Minimal Grid",
    style: "Minimal",
    layout: "Two columns",
    description: "Quiet sans typography, generous whitespace and a precisely aligned two-column grid.",
    badge: "Minimal · structured",
    details: "A natural choice for a minimal professional style and a two-column layout. Profile, skills and education sit alongside a dedicated experience and project column.",
    features: ["Precisely aligned two-column grid", "Dedicated skills and profile column", "Quiet typography with room to breathe"],
    variant: "grid",
    typography: "Inter",
    spacing: "Relaxed",
  },
  {
    id: "executive",
    name: "Executive",
    style: "Editorial",
    layout: "Single column",
    description: "An editorial, serif-led hierarchy with monochrome sophistication and achievements in the foreground.",
    badge: "Editorial · impact-led",
    details: "For a refined, achievement-led presentation. Its experience-first organization suits professionals who want their contribution to lead the story without implying a more senior job title.",
    features: ["Experience and impact first", "Generous editorial name treatment", "Sophisticated monochrome palette"],
    variant: "editorial",
    typography: "Georgia + Inter",
    spacing: "Relaxed",
  },
  {
    id: "creative-profile",
    name: "Creative Profile",
    style: "Creative",
    layout: "Sidebar",
    description: "A distinctive, polished sidebar layout for portfolios, creative roles and visual storytelling.",
    badge: "Creative · portfolio-ready",
    details: "A structured color sidebar gives contact information and skills their own space while keeping achievements readable.",
    features: ["Color-accented profile sidebar", "Prominent portfolio and contact details", "Clear experience hierarchy"],
    variant: "creative",
    typography: "Inter",
    spacing: "Balanced",
  },
  {
    id: "technical-focus",
    name: "Technical Focus",
    style: "Technical",
    layout: "Single column",
    description: "A precise, information-dense layout for engineering, data and technology roles.",
    badge: "Technical · skills-forward",
    details: "Technical strengths are easy to locate, with a compact header and consistent hierarchy for project and experience details.",
    features: ["Skills-forward section order", "Compact technical project entries", "Simple, readable typography"],
    variant: "technical",
    typography: "Inter",
    spacing: "Compact",
  },
  {
    id: "warm-profile",
    name: "Warm Profile",
    style: "Personal",
    layout: "Single column",
    description: "A welcoming, human-centered layout with soft accents and room for a professional portrait.",
    badge: "Personal · portrait-friendly",
    details: "A balanced layout with a photo-ready masthead for roles where personal presentation is useful. The portrait is always optional.",
    features: ["Portrait-ready contact masthead", "Soft, restrained accent color", "Comfortable section spacing"],
    variant: "warm",
    typography: "Georgia + Inter",
    spacing: "Balanced",
  },
];

const ACCENTS = [
  { name: "Slate", color: "#344256" },
  { name: "Blue", color: "#2563eb" },
  { name: "Teal", color: "#39756f" },
  { name: "Charcoal", color: "#24272c" },
  { name: "Burgundy", color: "#8b3d50" },
  { name: "Forest", color: "#357256" },
];

const INITIAL_PREFERENCES = {
  typography: "Inter",
  spacing: "Balanced",
  pageSize: "A4 · 210 × 297 mm",
  accent: "#2563eb",
  photo: "",
  photoPosition: "Right",
};

const EXPERIENCE = [
  "Led end-to-end product design and increased workspace retention by 24%.",
  "Built reusable patterns that accelerated engineering handoff.",
  "Partnered with product managers and engineers to turn research into clear, accessible workflows.",
];

function makeInitialDesigns() {
  return Object.fromEntries(
    TEMPLATES.map((template) => [
      template.id,
      {
        ...INITIAL_PREFERENCES,
        typography: template.typography,
        spacing: template.spacing,
        accent: template.variant === "editorial" || template.variant === "classic" ? "#344256" : "#2563eb",
      },
    ]),
  );
}

function ResumeDocument({ template, design }) {
  const hasPhoto = Boolean(design.photo);
  const resumeStyle = {
    "--resume-accent": design.accent,
    "--resume-font": design.typography === "Georgia + Inter" ? 'Georgia, "Times New Roman", serif' : "Inter, Arial, sans-serif",
    "--resume-gap": design.spacing === "Compact" ? "9px" : design.spacing === "Relaxed" ? "20px" : "14px",
    "--resume-page-width": design.pageSize.startsWith("Letter") ? "430px" : "420px",
  };

  return (
    <article
      className={`resume-document resume-document-${template.variant} resume-document-spacing-${design.spacing.toLowerCase()}`}
      style={resumeStyle}
    >
      <header className={`resume-document-header resume-photo-${design.photoPosition.toLowerCase()}`}>
        {hasPhoto && (
          <img className="resume-profile-photo" src={design.photo} alt="Profile portrait" />
        )}
        <div className="resume-identity">
          <span className="resume-occupation">PRODUCT DESIGNER</span>
          <h2>John Doe</h2>
          <p>San Francisco · john.doe@email.com · linkedin.com/in/johndoe</p>
        </div>
      </header>

      <div className="resume-document-layout">
        <aside className="resume-column resume-column-secondary">
          <section className="resume-document-section">
            <h3>Profile</h3>
            <p>Product Designer with 4+ years of experience creating intuitive SaaS workflows and scalable design systems.</p>
          </section>
          <section className="resume-document-section">
            <h3>Expertise</h3>
            <p>User Research · Interaction Design · Figma · Prototyping · Design Systems</p>
          </section>
          <section className="resume-document-section">
            <h3>Education</h3>
            <b>B.Sc. Cognitive Science</b>
            <p>University of California, Berkeley · 2022</p>
          </section>
        </aside>

        <div className="resume-column resume-column-primary">
          {template.variant === "editorial" && (
            <section className="resume-document-section">
              <h3>Experience &amp; impact</h3>
              <b>Product Designer — Figma</b>
              <p>2022–Present</p>
              <ul>{EXPERIENCE.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}
          {template.variant !== "editorial" && (
            <section className="resume-document-section">
              <h3>Experience</h3>
              <b>Product Designer — Figma</b>
              <p>2022–Present</p>
              <ul>{EXPERIENCE.map((item) => <li key={item}>{item}</li>)}</ul>
            </section>
          )}
          <section className="resume-document-section">
            <h3>Selected project</h3>
            <b>Workspace onboarding</b>
            <p>Product design project · 2023</p>
            <ul>
              <li>Mapped onboarding journeys through user interviews and usability testing.</li>
              <li>Created interactive prototypes and documented patterns for a consistent first-use experience.</li>
            </ul>
          </section>
          {template.variant === "editorial" && (
            <section className="resume-document-section">
              <h3>Professional profile</h3>
              <p>Product Designer with 4+ years of experience creating intuitive SaaS workflows and scalable design systems.</p>
            </section>
          )}
          {template.variant !== "grid" && template.variant !== "creative" && (
            <section className="resume-document-section resume-main-education">
              <h3>Education</h3>
              <b>B.Sc. Cognitive Science — University of California, Berkeley</b>
              <p>Graduated 2022</p>
            </section>
          )}
          {template.variant === "technical" && (
            <section className="resume-document-section">
              <h3>Technical skills</h3>
              <p>Figma · Prototyping · Design Systems · Accessibility · User Research</p>
            </section>
          )}
        </div>
      </div>
      <small className="resume-document-page">John Doe · 1</small>
    </article>
  );
}

function TemplateCard({ template, selected, onChoose }) {
  const design = template.initialDesign;
  return (
    <article className={`design-card ${selected ? "design-card-selected" : ""}`}>
      <div className="design-card-preview">
        <ResumeDocument template={template} design={design} />
      </div>
      <div className="design-card-details">
        <span className="design-recommendation">{selected ? "Recommended · selected" : template.badge}</span>
        <h3>{template.name}</h3>
        <span className="design-style">{template.style} style · {template.layout.toLowerCase()}</span>
        <p>{template.description}</p>
        <div className="design-card-actions">
          <button className="btn btn-secondary" type="button" onClick={() => onChoose(template.id, true)}>
            Preview
          </button>
          <button className="btn btn-primary" type="button" onClick={() => onChoose(template.id, false)}>
            {selected ? "Edit chosen" : "Choose"}
          </button>
        </div>
      </div>
    </article>
  );
}

function TemplateDesigner({ template, design, onDesignChange, onBack, onChoose }) {
  const [photoError, setPhotoError] = useState("");
  const isTwoColumn = template.variant === "grid" || template.variant === "creative";

  function updateDesign(key, value) {
    onDesignChange({ ...design, [key]: value });
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setPhotoError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Choisissez un fichier image (JPG, PNG ou WebP).");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("La photo doit faire 5 Mo maximum.");
      return;
    }

    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result !== "string") {
        setPhotoError("Impossible de lire cette image. Essayez un autre fichier.");
        return;
      }
      updateDesign("photo", reader.result);
    };
    reader.onerror = () => setPhotoError("Impossible de lire cette image. Essayez un autre fichier.");
    reader.readAsDataURL(file);
  }

  return (
    <main className="template-designer">
      <div className="designer-topline">
        <button className="designer-back-link" type="button" onClick={onBack}>‹ Back to template gallery</button>
      </div>
      <header className="designer-title">
        <div>
          <h1>{template.name}</h1>
          <p>{template.description}</p>
        </div>
        <span className="designer-page-badge">{template.layout} · {design.pageSize.split(" · ")[0]}</span>
      </header>

      <div className="designer-workspace">
        <section className="designer-preview-panel" aria-label={`${template.name} editable CV preview`}>
          <div className="designer-preview-caption">
            <span>SAMPLE CONTENT · JOHN DOE</span>
            <span>Full page · 100%</span>
          </div>
          <div className="designer-paper-wrap">
            <ResumeDocument template={template} design={design} />
          </div>
          <div className="designer-preview-footnote">Page 1 of 1 · Editable text preview</div>
        </section>

        <aside className="designer-controls">
          <section className="designer-info-card">
            <span className="designer-badge">{template.badge}</span>
            <h2>Designed for your next step</h2>
            <p>{template.details}</p>
            <ul>{template.features.map((feature) => <li key={feature}>{feature}</li>)}</ul>
          </section>

          <section className="designer-settings-card">
            <h2>Make it yours</h2>
            <div className="designer-photo-setting">
              <div className="designer-photo-copy">
                {design.photo ? (
                  <img className="designer-photo-thumbnail" src={design.photo} alt="Profile photo preview" />
                ) : (
                  <span className="designer-photo-placeholder" aria-hidden="true">+</span>
                )}
                <span>
                  <b>Profile photo</b>
                  <small>Optional · shown in the CV header</small>
                </span>
              </div>
              <label className="photo-upload-button">
                {design.photo ? "Change" : "Add photo"}
                <input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={handlePhoto} />
              </label>
              {design.photo && (
                <button className="remove-photo-button" type="button" onClick={() => updateDesign("photo", "")}>
                  Remove photo
                </button>
              )}
              {design.photo && (
                <label className="designer-setting photo-position-setting">
                  <span>Photo position</span>
                  <select value={design.photoPosition} onChange={(event) => updateDesign("photoPosition", event.target.value)}>
                    <option>Right</option>
                    <option>Left</option>
                  </select>
                </label>
              )}
              {photoError && <span className="photo-error" role="alert">{photoError}</span>}
            </div>
            <label className="designer-setting">
              <span>Typography</span>
              <select value={design.typography} onChange={(event) => updateDesign("typography", event.target.value)}>
                <option>Inter</option>
                <option>Georgia + Inter</option>
                <option>Arial</option>
                <option>Georgia</option>
              </select>
            </label>
            <label className="designer-setting">
              <span>Spacing</span>
              <select value={design.spacing} onChange={(event) => updateDesign("spacing", event.target.value)}>
                <option>Compact</option>
                <option>Balanced</option>
                <option>Relaxed</option>
              </select>
            </label>
            <label className="designer-setting">
              <span>Page size</span>
              <select value={design.pageSize} onChange={(event) => updateDesign("pageSize", event.target.value)}>
                <option>A4 · 210 × 297 mm</option>
                <option>Letter · 8.5 × 11 in</option>
              </select>
            </label>

            <fieldset className="designer-accent-setting">
              <legend>Accent color</legend>
              <div className="designer-accent-options">
                {ACCENTS.map((option) => (
                  <button
                    className={design.accent === option.color ? "active" : ""}
                    key={option.color}
                    type="button"
                    aria-label={option.name}
                    aria-pressed={design.accent === option.color}
                    onClick={() => updateDesign("accent", option.color)}
                  >
                    <span style={{ backgroundColor: option.color }} />
                  </button>
                ))}
                <label className="custom-accent-picker" title="Choose a custom accent color">
                  <input
                    aria-label="Choose a custom accent color"
                    type="color"
                    value={design.accent}
                    onChange={(event) => updateDesign("accent", event.target.value)}
                  />
                </label>
              </div>
              <small>{ACCENTS.find((option) => option.color === design.accent)?.name || "Custom"} · headings only</small>
            </fieldset>

            <p className="designer-layout-note">
              {isTwoColumn ? "Two-column layout is part of this template." : "Single-column layout is part of this template."}
              {" "}Your content stays editable.
            </p>
            <button className="btn btn-primary designer-confirm-button" type="button" onClick={onChoose}>
              Choose this template
            </button>
          </section>

          <p className="designer-sample-note">
            Same sample profile in every preview. Choosing a template changes the design, not your information.
          </p>
        </aside>
      </div>
      <footer className="designer-footer">
        <div>
          <button className="btn btn-secondary" type="button" onClick={onBack}>Back to templates</button>
          <button className="link-btn" type="button" onClick={onBack}>Save progress</button>
        </div>
        <div>
          <span>{template.name} · 1 page</span>
          <button className="btn btn-primary" type="button" onClick={onChoose}>Choose this template</button>
        </div>
      </footer>
    </main>
  );
}

export default function TemplatePage({
  onNavigate,
  onBack = () => onNavigate("landing"),
  onConfirm,
  initialSelectedId = "modern-focus",
  initialDesigns = {},
  embedded = false,
  isAuthed,
}) {
  const [selectedId, setSelectedId] = useState(initialSelectedId);
  const [editingId, setEditingId] = useState(null);
  const [designs, setDesigns] = useState(() => ({ ...makeInitialDesigns(), ...initialDesigns }));
  const [industry, setIndustry] = useState("Technology & SaaS");
  const [careerStage, setCareerStage] = useState("Mid-career · 3–7 years");
  const [visualStyle, setVisualStyle] = useState("Modern");
  const [layout, setLayout] = useState("Single column");
  const [recommendationsUpdated, setRecommendationsUpdated] = useState(false);

  const recommendations = useMemo(() => {
    return [...TEMPLATES].sort((first, second) => {
      function score(template) {
        let total = Number(template.style === visualStyle) * 3 + Number(template.layout === layout);
        if (industry === "Technology & SaaS" && template.variant === "technical") total += 2;
        if (industry === "Design & Creative" && ["creative", "editorial", "warm"].includes(template.variant)) total += 2;
        if (industry === "Business & Finance" && ["classic", "editorial"].includes(template.variant)) total += 2;
        if (industry === "Healthcare" && ["classic", "compact"].includes(template.variant)) total += 2;
        if (industry === "Education" && ["classic", "modern"].includes(template.variant)) total += 2;
        if (careerStage === "Executive" && template.variant === "editorial") total += 3;
        if (careerStage === "Senior · 8+ years" && ["editorial", "classic"].includes(template.variant)) total += 1;
        if (careerStage === "Early career · 0–2 years" && ["compact", "modern"].includes(template.variant)) total += 1;
        return total;
      }

      const firstScore = score(first);
      const secondScore = score(second);
      return secondScore - firstScore;
    });
  }, [careerStage, industry, layout, visualStyle]);

  function updateDesign(templateId, design) {
    setDesigns((previous) => ({ ...previous, [templateId]: design }));
  }

  function chooseTemplate() {
    if (onConfirm) {
      onConfirm({
        templateId: editingId,
        templateName: editingTemplate.name,
        design: designs[editingId],
      });
      return;
    }
    setSelectedId(editingId);
    setEditingId(null);
  }

  const editingTemplate = TEMPLATES.find((template) => template.id === editingId);

  return (
    <div className="app-shell template-app">
      <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
      <div className="template-wizard">
        <StepIndicator steps={IMPORT_STEPS} currentIndex={3} interactive={false} />
        {editingTemplate ? (
          <TemplateDesigner
            template={editingTemplate}
            design={designs[editingTemplate.id]}
            onDesignChange={(design) => updateDesign(editingTemplate.id, design)}
            onBack={() => setEditingId(null)}
            onChoose={chooseTemplate}
          />
        ) : (
          <>
            <main className="template-selection">
              <header className="template-selection-header">
                <div>
                  <h1>Find the right look for your next role</h1>
                  <p>Tell us what feels like you. Compare professional designs with the same sample profile.</p>
                </div>
                <span className="template-step-badge">Step 4 of 7 · Template</span>
              </header>

              <div className="template-selection-layout">
                <aside className="template-preferences">
                  <h2>Your preferences</h2>
                  <p className="preferences-hint">A starting point, not a rule. You can always change any template.</p>

                  <label className="preference-field">
                    <span>Target industry</span>
                    <select value={industry} onChange={(event) => setIndustry(event.target.value)}>
                      <option>Technology &amp; SaaS</option>
                      <option>Business &amp; Finance</option>
                      <option>Design &amp; Creative</option>
                      <option>Healthcare</option>
                      <option>Education</option>
                    </select>
                  </label>
                  <label className="preference-field">
                    <span>Career stage</span>
                    <select value={careerStage} onChange={(event) => setCareerStage(event.target.value)}>
                      <option>Early career · 0–2 years</option>
                      <option>Mid-career · 3–7 years</option>
                      <option>Senior · 8+ years</option>
                      <option>Executive</option>
                    </select>
                  </label>

                  <fieldset className="preference-group">
                    <legend>Preferred visual style</legend>
                    {["Modern", "Classic", "Minimal", "Editorial", "Creative", "Technical", "Personal"].map((style) => (
                      <label className={`style-choice ${visualStyle === style ? "active" : ""}`} key={style}>
                        <input
                          type="radio"
                          name="visual-style"
                          value={style}
                          checked={visualStyle === style}
                          onChange={() => setVisualStyle(style)}
                        />
                        <span><b>{style}</b></span>
                      </label>
                    ))}
                  </fieldset>

                  <fieldset className="preference-group">
                    <legend>Document layout</legend>
                    <div className="layout-choice">
                      {["Single column", "Two columns"].map((option) => (
                        <button
                          className={layout === option ? "active" : ""}
                          key={option}
                          type="button"
                          aria-pressed={layout === option}
                          onClick={() => setLayout(option)}
                        >
                          {layout === option ? "✓ " : ""}{option === "Single column" ? "One column" : "Two columns"}
                        </button>
                      ))}
                    </div>
                  </fieldset>

                  <button
                    className="btn btn-primary update-recommendations"
                    type="button"
                    onClick={() => setRecommendationsUpdated(true)}
                  >
                    Update recommendations
                  </button>
                  {recommendationsUpdated && (
                    <p className="recommendation-status" role="status">
                      Recommendations updated for {industry} · {careerStage}.
                    </p>
                  )}
                  <button
                    className="reset-preferences"
                    type="button"
                    onClick={() => {
                      setIndustry("Technology & SaaS");
                      setCareerStage("Mid-career · 3–7 years");
                      setVisualStyle("Modern");
                      setLayout("Single column");
                      setRecommendationsUpdated(false);
                    }}
                  >
                    Reset preferences
                  </button>
                  <div className="design-note">
                    <b>A design match, not a score</b>
                    <span>Recommendations reflect your style and layout choices. They do not predict hiring outcomes or certify ATS performance.</span>
                  </div>
                </aside>

                <section className="template-recommendations" aria-label="Recommended CV templates">
                  <div className="recommendations-heading">
                    <div>
                      <h2>Recommended for you</h2>
                      <p>{industry} · {visualStyle} · {layout} · Customizable colors</p>
                    </div>
                    <span>{TEMPLATES.length} professional designs</span>
                  </div>
                  <div className="sample-content">
                    <b>Sample content</b>
                    <span>John Doe, Product Designer · identical content in every preview</span>
                  </div>
                  <div className="design-grid">
                    {recommendations.map((template) => (
                      <TemplateCard
                        key={template.id}
                        template={{ ...template, initialDesign: designs[template.id] }}
                        selected={template.id === selectedId}
                        onChoose={(id) => {
                          setEditingId(id);
                          if (template.id === selectedId) setSelectedId(id);
                        }}
                      />
                    ))}
                  </div>
                  <p className="template-disclaimer">
                    Choose a design to customize its typography, spacing, color and optional profile photo before use.
                  </p>
                </section>
              </div>
            </main>
            <footer className="template-selection-footer">
              <div className="template-footer-left">
                <button className="btn btn-secondary" type="button" onClick={onBack}>
                  {embedded ? "Back to questionnaire" : "Back"}
                </button>
                {!embedded && (
                  <button className="link-btn" type="button" onClick={onBack}>Save progress</button>
                )}
              </div>
              <div className="template-footer-right">
                <span aria-live="polite">{TEMPLATES.find((template) => template.id === selectedId)?.name} selected</span>
                <button className="btn btn-primary" type="button" onClick={() => setEditingId(selectedId)}>
                  {embedded ? "Customize selected template" : "Edit selected template"}
                </button>
              </div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
