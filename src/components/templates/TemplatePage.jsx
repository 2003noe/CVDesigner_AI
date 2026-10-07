import { useMemo, useState } from "react";
import TopNav from "../TopNav";
import StepIndicator, { IMPORT_STEPS } from "../StepIndicator";

const TEMPLATES = [
  {
    id: "atlantic-blue",
    name: "Atlantic Blue",
    style: "Professional",
    category: "Professional",
    layout: "Two columns",
    variant: "atlantic",
    description: "A confident two-column layout with a deep blue sidebar and a strong executive hierarchy.",
    badge: "Corporate classic",
    typography: "Georgia + Inter",
    spacing: "Balanced",
    accent: "#173b4d",
    tags: ["Business", "Finance", "Management"],
  },
  {
    id: "modern-focus",
    name: "Mercury Flow",
    style: "Modern",
    category: "Modern",
    layout: "Single column",
    variant: "mercury",
    description: "Clean, airy and contemporary. A polished choice for product, marketing and business roles.",
    badge: "Modern favorite",
    typography: "Inter",
    spacing: "Balanced",
    accent: "#64748b",
    tags: ["Modern", "Marketing", "Product"],
  },
  {
    id: "steady-form",
    name: "Steady Form",
    style: "Corporate",
    category: "Professional",
    layout: "Single column",
    variant: "steady",
    description: "Structured and information-rich, designed for engineering, operations and established companies.",
    badge: "Structured",
    typography: "Inter",
    spacing: "Compact",
    accent: "#1f2937",
    tags: ["Engineering", "Operations", "Corporate"],
  },
  {
    id: "classic-serif",
    name: "Classic Serif",
    style: "Classic",
    category: "Classic",
    layout: "Single column",
    variant: "classic",
    description: "An elegant serif-led resume with refined rules and a timeless editorial rhythm.",
    badge: "Timeless",
    typography: "Georgia + Inter",
    spacing: "Balanced",
    accent: "#30343b",
    tags: ["Law", "Academia", "Executive"],
  },
  {
    id: "leaves",
    name: "Leaves",
    style: "Creative",
    category: "Creative",
    layout: "Two columns",
    variant: "leaves",
    description: "A distinctive organic sidebar brings personality without sacrificing professional readability.",
    badge: "Creative",
    typography: "Inter",
    spacing: "Balanced",
    accent: "#315b50",
    tags: ["Design", "Creative", "Communications"],
  },
  {
    id: "executive",
    name: "Executive",
    style: "Premium",
    category: "Professional",
    layout: "Single column",
    variant: "executive",
    description: "A premium monochrome presentation built around leadership, achievements and credibility.",
    badge: "Executive",
    typography: "Georgia + Inter",
    spacing: "Relaxed",
    accent: "#24272c",
    tags: ["Leadership", "Director", "Consulting"],
  },
  {
    id: "nova-minimal",
    name: "Nova Minimal",
    style: "Minimal",
    category: "Minimal",
    layout: "Single column",
    variant: "nova",
    description: "Minimalist typography, generous whitespace and a subtle accent for a modern first impression.",
    badge: "Minimal",
    typography: "Inter",
    spacing: "Relaxed",
    accent: "#2563eb",
    tags: ["Startup", "Product", "General"],
  },
  {
    id: "horizon",
    name: "Horizon",
    style: "Modern",
    category: "Modern",
    layout: "Two columns",
    variant: "horizon",
    description: "A modern split layout with a compact identity block and clear visual grouping.",
    badge: "Contemporary",
    typography: "Inter",
    spacing: "Balanced",
    accent: "#7c3aed",
    tags: ["Tech", "Marketing", "Product"],
  },
  {
    id: "monochrome-ats",
    name: "Monochrome",
    style: "ATS-friendly",
    category: "ATS-friendly",
    layout: "Single column",
    variant: "mono",
    description: "Text-first and highly legible, with conventional headings and no distracting decoration.",
    badge: "ATS-ready layout",
    typography: "Arial",
    spacing: "Compact",
    accent: "#111827",
    tags: ["ATS", "Engineering", "Applications"],
  },
  {
    id: "corporate-pro",
    name: "Corporate Pro",
    style: "Corporate",
    category: "Professional",
    layout: "Two columns",
    variant: "corporate",
    description: "A sharp business template with a compact profile column and achievement-focused experience.",
    badge: "Business",
    typography: "Inter",
    spacing: "Compact",
    accent: "#0f766e",
    tags: ["Finance", "Consulting", "Business"],
  },
  {
    id: "creative-edge",
    name: "Creative Edge",
    style: "Creative",
    category: "Creative",
    layout: "Sidebar",
    variant: "creative",
    description: "A bold but polished layout for designers, communicators and portfolio-led candidates.",
    badge: "Portfolio-ready",
    typography: "Inter",
    spacing: "Balanced",
    accent: "#be5b45",
    tags: ["Design", "Brand", "Media"],
  },
  {
    id: "tech-focus",
    name: "Tech Focus",
    style: "Technical",
    category: "ATS-friendly",
    layout: "Single column",
    variant: "technical",
    description: "A dense, precise layout that gives projects, technologies and measurable results priority.",
    badge: "For tech roles",
    typography: "Inter",
    spacing: "Compact",
    accent: "#0f4c81",
    tags: ["Software", "Data", "IT"],
  },
];

const FILTERS = ["All", "Professional", "Modern", "Classic", "Minimal", "Creative", "ATS-friendly"];
const ACCENTS = [
  { name: "Atlantic", color: "#173b4d" },
  { name: "Blue", color: "#2563eb" },
  { name: "Teal", color: "#0f766e" },
  { name: "Charcoal", color: "#24272c" },
  { name: "Purple", color: "#7c3aed" },
  { name: "Terracotta", color: "#be5b45" },
  { name: "Forest", color: "#315b50" },
];

const SAMPLE = {
  name: "John Doe",
  role: "Product Designer",
  location: "San Francisco, CA",
  email: "john.doe@email.com",
  phone: "+1 415 555 0182",
  website: "linkedin.com/in/johndoe",
  summary:
    "Product Designer with 4+ years of experience creating intuitive digital products, scalable design systems and measurable user experiences.",
  experience: [
    {
      company: "Figma",
      role: "Product Designer",
      dates: "2022 — Present",
      bullets: [
        "Led end-to-end product design and increased workspace retention by 24%.",
        "Built reusable patterns that accelerated engineering handoff.",
      ],
    },
    {
      company: "Northstar Studio",
      role: "UX Designer",
      dates: "2020 — 2022",
      bullets: [
        "Translated research into accessible workflows used by 12k+ monthly users.",
        "Partnered with product and engineering teams on new product launches.",
      ],
    },
  ],
  education: "B.Sc. Cognitive Science — University of California, Berkeley",
  skills: "Figma · UX Research · Prototyping · Design Systems · Accessibility · Product Strategy",
  languages: "English · Spanish",
};

const DEFAULT_DESIGN = {
  typography: "Inter",
  spacing: "Balanced",
  pageSize: "A4 · 210 × 297 mm",
  accent: "#2563eb",
  photo: "",
  photoPosition: "Right",
};

function makeInitialDesigns() {
  return Object.fromEntries(
    TEMPLATES.map((template) => [
      template.id,
      {
        ...DEFAULT_DESIGN,
        typography: template.typography,
        spacing: template.spacing,
        accent: template.accent,
      },
    ]),
  );
}

function ResumeDocument({ template, design, preview = false }) {
  const hasPhoto = Boolean(design.photo);
  const resumeStyle = {
    "--resume-accent": design.accent,
    "--resume-font":
      design.typography === "Georgia + Inter"
        ? 'Georgia, "Times New Roman", serif'
        : design.typography === "Arial"
          ? "Arial, Helvetica, sans-serif"
          : 'Inter, Arial, sans-serif',
    "--resume-gap":
      design.spacing === "Compact" ? "8px" : design.spacing === "Relaxed" ? "18px" : "12px",
  };

  const secondary = (
    <aside className="resume-secondary">
      <section>
        <h3>Profile</h3>
        <p>{SAMPLE.summary}</p>
      </section>
      <section>
        <h3>Skills</h3>
        <p>{SAMPLE.skills}</p>
      </section>
      <section>
        <h3>Education</h3>
        <strong>{SAMPLE.education}</strong>
      </section>
      <section>
        <h3>Languages</h3>
        <p>{SAMPLE.languages}</p>
      </section>
    </aside>
  );

  const experience = (
    <section className="resume-section">
      <h3>Professional Experience</h3>
      {SAMPLE.experience.map((job) => (
        <div className="resume-job" key={`${job.company}-${job.role}`}>
          <div className="resume-job-heading">
            <strong>{job.role}</strong>
            <span>{job.dates}</span>
          </div>
          <b>{job.company}</b>
          <ul>
            {job.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
          </ul>
        </div>
      ))}
    </section>
  );

  const header = (
    <header className="resume-header">
      {hasPhoto ? (
        <img className="resume-photo" src={design.photo} alt="" />
      ) : (
        <div className="resume-avatar" aria-hidden="true">JD</div>
      )}
      <div className="resume-heading">
        <span>{SAMPLE.role}</span>
        <h2>{SAMPLE.name}</h2>
        <p>{SAMPLE.location} · {SAMPLE.email} · {SAMPLE.website}</p>
        <small>{SAMPLE.phone}</small>
      </div>
    </header>
  );

  return (
    <article
      className={`resume-document resume-${template.variant} ${preview ? "resume-preview" : ""}`}
      style={resumeStyle}
    >
      {template.variant === "atlantic" && (
        <>
          <div className="resume-sidebar">
            {hasPhoto ? <img className="resume-sidebar-photo" src={design.photo} alt="" /> : <div className="resume-sidebar-avatar">JD</div>}
            <h2>{SAMPLE.name}</h2>
            <span>{SAMPLE.role}</span>
            <div className="resume-sidebar-contact">{SAMPLE.location}<br />{SAMPLE.email}<br />{SAMPLE.phone}<br />{SAMPLE.website}</div>
            <h4>Languages</h4><p>{SAMPLE.languages}</p>
            <h4>Skills</h4><p>{SAMPLE.skills}</p>
          </div>
          <main className="resume-main">
            <section className="resume-section"><h3>Summary</h3><p>{SAMPLE.summary}</p></section>
            {experience}
            <section className="resume-section"><h3>Education</h3><p>{SAMPLE.education}</p></section>
          </main>
        </>
      )}

      {template.variant === "leaves" && (
        <>
          <div className="resume-leaves-strip"><span>LEAVES</span></div>
          <main className="resume-leaves-main">
            {header}
            {experience}
            <section className="resume-section"><h3>Education</h3><p>{SAMPLE.education}</p></section>
          </main>
          <aside className="resume-leaves-side">{secondary}</aside>
        </>
      )}

      {template.variant === "creative" && (
        <>
          <aside className="resume-creative-side">
            <div className="creative-mark">JD</div>
            <h2>{SAMPLE.name}</h2>
            <span>{SAMPLE.role}</span>
            <div>{SAMPLE.location}</div><div>{SAMPLE.email}</div><div>{SAMPLE.website}</div>
            <h4>Core skills</h4><p>{SAMPLE.skills}</p>
            <h4>Languages</h4><p>{SAMPLE.languages}</p>
          </aside>
          <main className="resume-main resume-creative-main">
            <div className="creative-title"><span>Selected profile</span><h2>{SAMPLE.name}</h2><p>{SAMPLE.summary}</p></div>
            {experience}
            <section className="resume-section"><h3>Education</h3><p>{SAMPLE.education}</p></section>
          </main>
        </>
      )}

      {!["atlantic", "leaves", "creative"].includes(template.variant) && (
        <>
          {header}
          <div className="resume-body">
            {template.variant === "horizon" && <div className="horizon-rule" />}
            {template.variant === "executive" && <div className="executive-intro"><span>PROFILE</span><p>{SAMPLE.summary}</p></div>}
            {template.variant === "nova" && <div className="nova-intro"><p>{SAMPLE.summary}</p></div>}
            {template.variant === "mono" && <div className="mono-contact">{SAMPLE.location} · {SAMPLE.email} · {SAMPLE.phone}</div>}
            {template.variant === "technical" && (
              <section className="resume-section tech-skills"><h3>Technical Skills</h3><p>{SAMPLE.skills}</p></section>
            )}
            {experience}
            <section className="resume-section">
              <h3>{template.variant === "executive" ? "Education & Credentials" : "Education"}</h3>
              <p>{SAMPLE.education}</p>
            </section>
            {template.variant === "steady" && <section className="resume-section"><h3>Core Competencies</h3><p>Product Strategy · Stakeholder Management · Design Systems · Agile Delivery</p></section>}
          </div>
        </>
      )}
      <small className="resume-page-number">John Doe · 01</small>
    </article>
  );
}

function TemplateCard({ template, design, selected, onPreview }) {
  return (
    <article className={`gallery-card ${selected ? "is-selected" : ""}`}>
      <button className="gallery-preview" type="button" onClick={() => onPreview(template.id)} aria-label={`Preview ${template.name}`}>
        <ResumeDocument template={template} design={design} preview />
        <span className="gallery-overlay">Preview</span>
      </button>
      <div className="gallery-card-body">
        <div className="gallery-card-heading">
          <div>
            <span className="gallery-badge">{selected ? "Selected" : template.badge}</span>
            <h3>{template.name}</h3>
          </div>
          {selected && <span className="selected-check">✓</span>}
        </div>
        <p>{template.description}</p>
        <div className="gallery-tags">
          <span>{template.style}</span><span>{template.layout}</span>
        </div>
        <button className="btn btn-primary gallery-use" type="button" onClick={() => onPreview(template.id)}>
          Customize template
        </button>
      </div>
    </article>
  );
}

function TemplateDesigner({ template, design, onDesignChange, onBack, onChoose }) {
  const [photoError, setPhotoError] = useState("");

  function updateDesign(key, value) {
    onDesignChange({ ...design, [key]: value });
  }

  function handlePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setPhotoError("");
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setPhotoError("Please choose a JPG, PNG or WebP image.");
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      setPhotoError("The photo must be 5 MB or smaller.");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      if (typeof reader.result === "string") updateDesign("photo", reader.result);
      else setPhotoError("Could not read this image.");
    };
    reader.onerror = () => setPhotoError("Could not read this image.");
    reader.readAsDataURL(file);
  }

  return (
    <main className="template-designer-v2">
      <div className="designer-v2-top">
        <button className="designer-back-link" type="button" onClick={onBack}>‹ Back to templates</button>
        <span>{template.layout} · A4</span>
      </div>

      <header className="designer-v2-title">
        <div>
          <span className="gallery-badge">{template.badge}</span>
          <h1>{template.name}</h1>
          <p>{template.description}</p>
        </div>
        <button className="btn btn-primary" type="button" onClick={onChoose}>Use this template</button>
      </header>

      <div className="designer-v2-workspace">
        <section className="designer-v2-preview">
          <div className="designer-v2-caption"><span>LIVE PREVIEW</span><span>John Doe · 1 page</span></div>
          <div className="designer-v2-paper">
            <ResumeDocument template={template} design={design} />
          </div>
        </section>

        <aside className="designer-v2-controls">
          <div className="designer-control-card">
            <h2>Customize</h2>
            <label><span>Typography</span><select value={design.typography} onChange={(e) => updateDesign("typography", e.target.value)}><option>Inter</option><option>Georgia + Inter</option><option>Arial</option><option>Georgia</option></select></label>
            <label><span>Spacing</span><select value={design.spacing} onChange={(e) => updateDesign("spacing", e.target.value)}><option>Compact</option><option>Balanced</option><option>Relaxed</option></select></label>
            <label><span>Page size</span><select value={design.pageSize} onChange={(e) => updateDesign("pageSize", e.target.value)}><option>A4 · 210 × 297 mm</option><option>Letter · 8.5 × 11 in</option></select></label>

            <fieldset>
              <legend>Accent color</legend>
              <div className="designer-v2-colors">
                {ACCENTS.map((color) => (
                  <button key={color.color} className={design.accent === color.color ? "active" : ""} type="button" aria-label={color.name} onClick={() => updateDesign("accent", color.color)}>
                    <span style={{ background: color.color }} />
                  </button>
                ))}
                <label className="custom-color"><input type="color" value={design.accent} onChange={(e) => updateDesign("accent", e.target.value)} /></label>
              </div>
            </fieldset>

            <div className="designer-photo-v2">
              <div>
                {design.photo ? <img src={design.photo} alt="" /> : <span>+</span>}
                <div><strong>Profile photo</strong><small>Optional</small></div>
              </div>
              <label className="photo-button">{design.photo ? "Change" : "Add photo"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} /></label>
              {design.photo && <button type="button" onClick={() => updateDesign("photo", "")}>Remove</button>}
            </div>
            {photoError && <p className="photo-error">{photoError}</p>}

            <div className="designer-features">
              <strong>Included in this template</strong>
              <span>✓ Professional typography hierarchy</span>
              <span>✓ Editable content structure</span>
              <span>✓ A4 / Letter page support</span>
            </div>
          </div>
          <button className="btn btn-primary btn-full" type="button" onClick={onChoose}>Use {template.name}</button>
        </aside>
      </div>
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
  const normalizedInitial = TEMPLATES.some((template) => template.id === initialSelectedId)
    ? initialSelectedId
    : TEMPLATES[0].id;
  const [selectedId, setSelectedId] = useState(normalizedInitial);
  const [editingId, setEditingId] = useState(null);
  const [designs, setDesigns] = useState(() => ({ ...makeInitialDesigns(), ...initialDesigns }));
  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [sort, setSort] = useState("Recommended");

  const visibleTemplates = useMemo(() => {
    const search = query.trim().toLowerCase();
    const filtered = TEMPLATES.filter((template) => {
      const matchesFilter = filter === "All" || template.category === filter;
      const haystack = `${template.name} ${template.style} ${template.description} ${template.tags.join(" ")}`.toLowerCase();
      return matchesFilter && (!search || haystack.includes(search));
    });
    if (sort === "A–Z") return [...filtered].sort((a, b) => a.name.localeCompare(b.name));
    if (sort === "Style") return [...filtered].sort((a, b) => a.style.localeCompare(b.style));
    return filtered;
  }, [filter, query, sort]);

  function updateDesign(templateId, design) {
    setDesigns((previous) => ({ ...previous, [templateId]: design }));
  }

  function openTemplate(id) {
    setSelectedId(id);
    setEditingId(id);
  }

  function chooseTemplate() {
    const template = TEMPLATES.find((item) => item.id === editingId);
    if (!template) return;
    setSelectedId(template.id);
    if (onConfirm) {
      onConfirm({
        templateId: template.id,
        templateName: template.name,
        design: designs[template.id],
      });
      return;
    }
    setEditingId(null);
  }

  const editingTemplate = TEMPLATES.find((template) => template.id === editingId);

  return (
    <div className="app-shell template-app">
      <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
      <div className="template-wizard-v2">
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
            <main className="template-gallery-v2">
              <header className="gallery-header-v2">
                <div>
                  <span className="gallery-eyebrow">CV DESIGN LIBRARY</span>
                  <h1>Choose a template that feels like you.</h1>
                  <p>Professional, modern and creative layouts — all built as real editable React templates.</p>
                </div>
                <div className="gallery-count"><strong>{TEMPLATES.length}</strong><span>professional designs</span></div>
              </header>

              <div className="gallery-toolbar">
                <div className="gallery-filters">
                  {FILTERS.map((item) => (
                    <button key={item} type="button" className={filter === item ? "active" : ""} onClick={() => setFilter(item)}>
                      {item}
                    </button>
                  ))}
                </div>
                <div className="gallery-tools">
                  <label className="gallery-search">
                    <span>⌕</span>
                    <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search templates" />
                  </label>
                  <select value={sort} onChange={(e) => setSort(e.target.value)} aria-label="Sort templates">
                    <option>Recommended</option>
                    <option>A–Z</option>
                    <option>Style</option>
                  </select>
                </div>
              </div>

              <div className="gallery-selected-banner">
                <div><span className="selected-dot" /><strong>{TEMPLATES.find((t) => t.id === selectedId)?.name}</strong><span>is selected</span></div>
                <button type="button" onClick={() => openTemplate(selectedId)}>Customize selected template →</button>
              </div>

              {visibleTemplates.length ? (
                <section className="gallery-grid-v2">
                  {visibleTemplates.map((template) => (
                    <TemplateCard
                      key={template.id}
                      template={template}
                      design={designs[template.id]}
                      selected={template.id === selectedId}
                      onPreview={openTemplate}
                    />
                  ))}
                </section>
              ) : (
                <div className="gallery-empty"><h2>No templates found</h2><p>Try another category or search term.</p><button className="btn btn-secondary" type="button" onClick={() => { setFilter("All"); setQuery(""); }}>Clear filters</button></div>
              )}

              <p className="gallery-disclaimer">Templates are editable designs. Visual style does not guarantee ATS compatibility or hiring outcomes.</p>
            </main>

            <footer className="template-gallery-footer">
              <button className="btn btn-secondary" type="button" onClick={onBack}>{embedded ? "Back to questionnaire" : "Back"}</button>
              <div><span>{TEMPLATES.find((t) => t.id === selectedId)?.name} selected</span><button className="btn btn-primary" type="button" onClick={() => openTemplate(selectedId)}>Customize &amp; continue</button></div>
            </footer>
          </>
        )}
      </div>
    </div>
  );
}
