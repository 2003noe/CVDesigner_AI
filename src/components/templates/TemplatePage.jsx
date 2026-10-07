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
    id: "andrade-blue",
    name: "Andrade Blue",
    style: "Professional",
    category: "Professional",
    layout: "Two columns",
    variant: "andrade",
    description: "A polished two-column profile with a blue sidebar, circular photo and softly highlighted experience.",
    badge: "Profile focused",
    typography: "Inter",
    spacing: "Balanced",
    accent: "#506789",
    tags: ["Marketing", "Management", "Business"],
  },
  {
    id: "parvati-classic",
    name: "Parvati Classic",
    style: "Classic",
    category: "Classic",
    layout: "Single column",
    variant: "parvati",
    description: "A clean, formal layout with centered identity, compact contact details and clearly ruled sections.",
    badge: "Classic format",
    typography: "Arial",
    spacing: "Compact",
    accent: "#30343b",
    tags: ["Management", "Business", "ATS-friendly"],
  },
  {
    id: "takahashi-brown",
    name: "Takahashi",
    style: "Creative",
    category: "Creative",
    layout: "Two columns",
    variant: "takahashi",
    description: "A warm editorial design with an overlapping profile photo, rich brown sidebar and clear work history.",
    badge: "Warm editorial",
    typography: "Inter",
    spacing: "Balanced",
    accent: "#80674f",
    tags: ["Design", "Creative", "Marketing"],
  },
  {
    id: "paterson-minimal",
    name: "Paterson Minimal",
    style: "Professional",
    category: "Professional",
    layout: "Two columns",
    variant: "paterson",
    description: "A crisp professional layout with a photo and contact column beside a spacious experience profile.",
    badge: "Clean & focused",
    typography: "Arial",
    spacing: "Balanced",
    accent: "#30343b",
    tags: ["Business", "Consulting", "Management"],
  },
  {
    id: "marchesi-editorial",
    name: "Marchesi Editorial",
    style: "Creative",
    category: "Creative",
    layout: "Editorial",
    variant: "marchesi",
    description: "A striking editorial resume with a vertical name panel, clean dividers and a profile photo.",
    badge: "Editorial",
    typography: "Arial",
    spacing: "Balanced",
    accent: "#252525",
    tags: ["Design", "Creative", "Brand"],
  },
  {
    id: "feig-noir",
    name: "Feig Noir",
    style: "Creative",
    category: "Creative",
    layout: "Two columns",
    variant: "feig",
    description: "A bold charcoal portfolio layout with a photo-led identity block and contrasting content panels.",
    badge: "Bold portfolio",
    typography: "Inter",
    spacing: "Balanced",
    accent: "#292929",
    tags: ["Design", "Art", "Creative"],
  },
  {
    id: "kaya-graduate",
    name: "Kaya Graduate",
    style: "ATS-friendly",
    category: "ATS-friendly",
    layout: "Single column",
    variant: "kaya",
    description: "A clear graduate resume with a compact photo header, two-column contact details and skill ratings.",
    badge: "Graduate ready",
    typography: "Arial",
    spacing: "Compact",
    accent: "#252525",
    tags: ["Graduate", "Engineering", "ATS"],
  },
  {
    id: "herrera-sales",
    name: "Herrera Sales",
    style: "Professional",
    category: "Professional",
    layout: "Full width",
    variant: "herrera",
    description: "A refined sales profile with a deep blue identity banner, circular photo and elegant serif typography.",
    badge: "Sales professional",
    typography: "Georgia",
    spacing: "Relaxed",
    accent: "#073d5a",
    tags: ["Sales", "Leadership", "Business"],
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

const TYPOGRAPHIES = [
  "Inter",
  "Arial",
  "Georgia",
  "Georgia + Inter",
  "Times New Roman",
  "Garamond",
  "Palatino Linotype",
  "Trebuchet MS",
  "Verdana",
  "Tahoma",
  "Courier New",
];

const FONT_FAMILIES = {
  Inter: 'Inter, Arial, sans-serif',
  Arial: 'Arial, Helvetica, sans-serif',
  Georgia: 'Georgia, "Times New Roman", serif',
  "Georgia + Inter": 'Georgia, "Times New Roman", serif',
  "Times New Roman": '"Times New Roman", Times, serif',
  Garamond: 'Garamond, "Times New Roman", serif',
  "Palatino Linotype": '"Palatino Linotype", "Book Antiqua", Palatino, serif',
  "Trebuchet MS": '"Trebuchet MS", sans-serif',
  Verdana: 'Verdana, Geneva, sans-serif',
  Tahoma: 'Tahoma, Geneva, sans-serif',
  "Courier New": '"Courier New", Courier, monospace',
};

const PAGE_SIZES = [
  { label: "A5 · 148 × 210 mm", width: "559px", height: "794px" },
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
  pageSize: PAGE_SIZES[0].label,
  zoom: 85,
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
  const pageSize = PAGE_SIZES.find((size) => size.label === design.pageSize) || PAGE_SIZES[1];
  const resumeStyle = {
    "--resume-accent": design.accent,
    "--resume-font": FONT_FAMILIES[design.typography] || FONT_FAMILIES.Inter,
    "--resume-gap":
      design.spacing === "Compact" ? "8px" : design.spacing === "Relaxed" ? "18px" : "12px",
    "--resume-page-width": pageSize.width,
    "--resume-page-height": pageSize.height,
    "--resume-zoom": Number(design.zoom || 85) / 100,
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
    <section className={`resume-section${["andrade", "parvati", "takahashi", "paterson", "kaya", "herrera"].includes(template.variant) ? ` resume-${template.variant}-section` : ""}`}>
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

      {template.variant === "andrade" && (
        <>
          <aside className="resume-andrade-sidebar">
            {hasPhoto ? (
              <img className="resume-andrade-photo" src={design.photo} alt="" />
            ) : (
              <div className="resume-andrade-avatar" aria-hidden="true">JD</div>
            )}
            <section className="resume-andrade-sidebar-section">
              <h3>Contact me</h3>
              <p>{SAMPLE.phone}</p>
              <p>{SAMPLE.email}</p>
              <p>{SAMPLE.location}</p>
              <p>{SAMPLE.website}</p>
            </section>
            <section className="resume-andrade-sidebar-section">
              <h3>Skills</h3>
              <ul>{SAMPLE.skills.split(" · ").map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </section>
            <section className="resume-andrade-sidebar-section">
              <h3>References</h3>
              <p>Available upon request</p>
            </section>
            <section className="resume-andrade-sidebar-section">
              <h3>Language</h3>
              <ul>{SAMPLE.languages.split(" · ").map((language) => <li key={language}>{language}</li>)}</ul>
            </section>
          </aside>
          <main className="resume-andrade-main">
            <header className="resume-andrade-header">
              <span>{SAMPLE.role}</span>
              <h2>{SAMPLE.name}</h2>
            </header>
            <section className="resume-section resume-andrade-section">
              <h3>About me</h3>
              <p>{SAMPLE.summary}</p>
            </section>
            {experience}
            <section className="resume-section resume-andrade-section">
              <h3>Education</h3>
              <p>{SAMPLE.education}</p>
            </section>
          </main>
        </>
      )}

      {template.variant === "parvati" && (
        <>
          <header className="resume-parvati-header">
            <h2>{SAMPLE.name}</h2>
            <span>{SAMPLE.role}</span>
            <div>
              <span>{SAMPLE.phone}</span>
              <span>{SAMPLE.location}</span>
              <span>{SAMPLE.email}</span>
            </div>
          </header>
          <section className="resume-section resume-parvati-section">
            <h3>About me</h3>
            <p>{SAMPLE.summary}</p>
          </section>
          <section className="resume-section resume-parvati-section">
            <h3>Education</h3>
            <p>{SAMPLE.education}</p>
          </section>
          {experience}
          <section className="resume-section resume-parvati-section">
            <h3>Skills</h3>
            <ul className="resume-parvati-skills">
              {SAMPLE.skills.split(" · ").map((skill) => <li key={skill}>{skill}</li>)}
            </ul>
          </section>
          <section className="resume-section resume-parvati-section">
            <h3>References</h3>
            <p>Available upon request</p>
          </section>
        </>
      )}

      {template.variant === "takahashi" && (
        <>
          <header className="resume-takahashi-header">
            {hasPhoto ? (
              <img className="resume-takahashi-photo" src={design.photo} alt="" />
            ) : (
              <div className="resume-takahashi-avatar" aria-hidden="true">JD</div>
            )}
            <div className="resume-takahashi-identity">
              <h2>{SAMPLE.name}</h2>
              <span>{SAMPLE.role}</span>
            </div>
          </header>
          <aside className="resume-takahashi-sidebar">
            <section className="resume-takahashi-section">
              <h3>Contact me</h3>
              <p>{SAMPLE.phone}</p>
              <p>{SAMPLE.website}</p>
              <p>{SAMPLE.email}</p>
            </section>
            <section className="resume-takahashi-section">
              <h3>Skills</h3>
              <ul>
                {SAMPLE.skills.split(" · ").map((skill) => (
                  <li key={skill}><span>{skill}</span><i /></li>
                ))}
              </ul>
            </section>
            <section className="resume-takahashi-section resume-takahashi-education">
              <h3>Education</h3>
              <p>{SAMPLE.education}</p>
            </section>
          </aside>
          <main className="resume-takahashi-main">
            <section className="resume-section resume-takahashi-section">
              <h3>About me</h3>
              <p>{SAMPLE.summary}</p>
            </section>
            {experience}
          </main>
        </>
      )}

      {template.variant === "paterson" && (
        <>
          <aside className="resume-paterson-sidebar">
            {hasPhoto ? (
              <img className="resume-paterson-photo" src={design.photo} alt="" />
            ) : (
              <div className="resume-paterson-avatar" aria-hidden="true">JD</div>
            )}
            <section className="resume-paterson-section">
              <h3>Contact</h3>
              <p>{SAMPLE.phone}</p>
              <p>{SAMPLE.email}</p>
              <p>{SAMPLE.location}</p>
              <p>{SAMPLE.website}</p>
            </section>
            <section className="resume-paterson-section">
              <h3>Expertise</h3>
              <ul>{SAMPLE.skills.split(" · ").map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </section>
            <section className="resume-paterson-section">
              <h3>Language</h3>
              <ul className="resume-paterson-languages">
                {SAMPLE.languages.split(" · ").map((language) => <li key={language}>{language}<span /></li>)}
              </ul>
            </section>
          </aside>
          <main className="resume-paterson-main">
            <header className="resume-paterson-header">
              <h2>{SAMPLE.name}</h2>
              <span>{SAMPLE.role}</span>
            </header>
            <section className="resume-section resume-paterson-section">
              <h3>About me</h3>
              <p>{SAMPLE.summary}</p>
            </section>
            {experience}
            <section className="resume-section resume-paterson-section">
              <h3>Education</h3>
              <p>{SAMPLE.education}</p>
            </section>
          </main>
        </>
      )}

      {template.variant === "marchesi" && (
        <>
          <main className="resume-marchesi-main">
            <header className="resume-marchesi-topline">
              <span>Graphic Designer</span>
              <span>Resume</span>
            </header>
            <section className="resume-marchesi-intro">
              <div className="resume-marchesi-about">
                <h3>About</h3>
                <p>{SAMPLE.summary}</p>
              </div>
              {hasPhoto ? (
                <img className="resume-marchesi-photo" src={design.photo} alt="" />
              ) : (
                <div className="resume-marchesi-photo-placeholder" aria-hidden="true">JD</div>
              )}
            </section>
            <section className="resume-marchesi-section">
              <h3>Work Experiences</h3>
              {SAMPLE.experience.map((job) => (
                <div className="resume-marchesi-entry" key={job.company}>
                  <div><strong>{job.company}</strong><span>{job.role}</span></div>
                  <time>{job.dates}</time>
                </div>
              ))}
            </section>
            <section className="resume-marchesi-section">
              <h3>Education History</h3>
              <div className="resume-marchesi-entry">
                <div><strong>{SAMPLE.education.split(" — ")[1]}</strong><span>{SAMPLE.education.split(" — ")[0]}</span></div>
                <time>2018 — 2022</time>
              </div>
            </section>
            <section className="resume-marchesi-bottom">
              <div><h3>Interests</h3><p>Brand aesthetics · Visual research · Color theory</p></div>
              <div><h3>Skills</h3><p>{SAMPLE.skills}</p></div>
            </section>
            <footer className="resume-marchesi-contact">
              <span>{SAMPLE.website}<br />{SAMPLE.phone}</span>
              <span>{SAMPLE.email}<br />{SAMPLE.location}</span>
            </footer>
          </main>
          <aside className="resume-marchesi-name" aria-label={SAMPLE.name}>{SAMPLE.name}</aside>
        </>
      )}

      {template.variant === "feig" && (
        <>
          <section className="resume-feig-profile">
            {hasPhoto ? (
              <img className="resume-feig-photo" src={design.photo} alt="" />
            ) : (
              <div className="resume-feig-photo-placeholder" aria-hidden="true">JD</div>
            )}
            <div className="resume-feig-identity">
              <h2>{SAMPLE.name}</h2>
              <span>{SAMPLE.role}</span>
            </div>
          </section>
          <section className="resume-feig-contact">
            <h3>Contact</h3>
            <p><strong>Phone</strong>{SAMPLE.phone}</p>
            <p><strong>Website</strong>{SAMPLE.website}</p>
            <p><strong>Mail</strong>{SAMPLE.email}</p>
            <p><strong>Address</strong>{SAMPLE.location}</p>
          </section>
          <section className="resume-feig-about">
            <h3>About</h3>
            <p>{SAMPLE.summary}</p>
          </section>
          <section className="resume-feig-education">
            <h3>Education</h3>
            <p><span>2020 — 2022</span><strong>{SAMPLE.education}</strong></p>
            <h3>Skills</h3>
            <ul>{SAMPLE.skills.split(" · ").map((skill) => <li key={skill}>{skill}</li>)}</ul>
          </section>
          <section className="resume-feig-experience">
            <h3>Work Experience</h3>
            {SAMPLE.experience.map((job) => (
              <div key={job.company}>
                <strong>{job.role}</strong>
                <span>{job.dates} | {job.company}</span>
                <p>{job.bullets[0]}</p>
              </div>
            ))}
            <h3>Award</h3>
            <div><span>2024 | Professional Recognition</span><strong>Outstanding Contribution</strong></div>
          </section>
        </>
      )}

      {template.variant === "kaya" && (
        <>
          <header className="resume-kaya-header">
            {hasPhoto ? (
              <img className="resume-kaya-photo" src={design.photo} alt="" />
            ) : (
              <div className="resume-kaya-photo-placeholder" aria-hidden="true">JD</div>
            )}
            <div className="resume-kaya-identity">
              <h2>{SAMPLE.name}</h2>
              <span>{SAMPLE.role}</span>
              <div className="resume-kaya-contact">
                <span>{SAMPLE.email}</span><span>{SAMPLE.phone}</span>
                <span>{SAMPLE.location}</span><span>{SAMPLE.website}</span>
                <span>github.com/johndoe</span><span>portfolio.example.com</span>
              </div>
            </div>
          </header>
          <section className="resume-section resume-kaya-section">
            <h3>Summary</h3>
            <p>{SAMPLE.summary}</p>
          </section>
          {experience}
          <section className="resume-section resume-kaya-section">
            <h3>Education</h3>
            <div className="resume-kaya-entry">
              <strong>{SAMPLE.education.split(" — ")[1]}</strong>
              <span>{SAMPLE.education.split(" — ")[0]}</span>
              <span>2018 — 2022 · {SAMPLE.location}</span>
            </div>
          </section>
          <section className="resume-section resume-kaya-section">
            <h3>Skills</h3>
            <ul className="resume-kaya-rated-list">
              {SAMPLE.skills.split(" · ").map((skill, index) => (
                <li key={skill}><span>{skill}</span><span className="resume-kaya-dots" aria-label={`${index % 4 + 2} out of 5`}>
                  {Array.from({ length: 5 }, (_, dot) => <i className={dot < index % 4 + 2 ? "filled" : ""} key={dot} />)}
                </span></li>
              ))}
            </ul>
          </section>
          <section className="resume-section resume-kaya-section">
            <h3>Languages</h3>
            <ul className="resume-kaya-rated-list">
              {SAMPLE.languages.split(" · ").map((language, index) => (
                <li key={language}><span>{language}</span><span className="resume-kaya-dots" aria-label={`${index ? 4 : 5} out of 5`}>
                  {Array.from({ length: 5 }, (_, dot) => <i className={dot < (index ? 4 : 5) ? "filled" : ""} key={dot} />)}
                </span></li>
              ))}
            </ul>
          </section>
          <section className="resume-section resume-kaya-section">
            <h3>Certificates</h3>
            <ul className="resume-kaya-certificates">
              <li>Professional Foundations Certificate</li>
              <li>Cloud Practitioner Certificate</li>
            </ul>
          </section>
        </>
      )}

      {template.variant === "herrera" && (
        <>
          <header className="resume-herrera-header">
            <div>
              <h2>{SAMPLE.name}</h2>
              <span>{SAMPLE.role}</span>
              <section>
                <span>{SAMPLE.email}</span><span>{SAMPLE.phone}</span>
                <span>{SAMPLE.location}</span><span>{SAMPLE.website}</span>
              </section>
            </div>
            {hasPhoto ? (
              <img className="resume-herrera-photo" src={design.photo} alt="" />
            ) : (
              <div className="resume-herrera-photo-placeholder" aria-hidden="true">JD</div>
            )}
          </header>
          <main className="resume-herrera-main">
            <section className="resume-section resume-herrera-section">
              <h3>Summary</h3>
              <p>{SAMPLE.summary}</p>
            </section>
            {experience}
            <section className="resume-section resume-herrera-section">
              <h3>Education</h3>
              <div className="resume-herrera-entry">
                <strong>Bachelor of Business Administration</strong>
                <span>2014 — 2018</span>
                <em>Monterrey Business University · {SAMPLE.location}</em>
              </div>
            </section>
            <section className="resume-section resume-herrera-section">
              <h3>Skills</h3>
              <ul>{SAMPLE.skills.split(" · ").map((skill) => <li key={skill}>{skill}</li>)}</ul>
            </section>
            <section className="resume-section resume-herrera-section">
              <h3>Languages</h3>
              <ul>{SAMPLE.languages.split(" · ").map((language) => <li key={language}>{language}</li>)}</ul>
            </section>
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

      {!["atlantic", "andrade", "parvati", "takahashi", "paterson", "marchesi", "feig", "kaya", "herrera", "leaves", "creative"].includes(template.variant) && (
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
        <span>{template.layout} · {design.pageSize || PAGE_SIZES[0].label}</span>
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
            <label><span>Typography</span><select value={design.typography} onChange={(e) => updateDesign("typography", e.target.value)}>{TYPOGRAPHIES.map((font) => <option key={font}>{font}</option>)}</select></label>
            <label><span>Spacing</span><select value={design.spacing} onChange={(e) => updateDesign("spacing", e.target.value)}><option>Compact</option><option>Balanced</option><option>Relaxed</option></select></label>
            <label><span>Page size</span><select value={design.pageSize || PAGE_SIZES[0].label} onChange={(e) => updateDesign("pageSize", e.target.value)}>{PAGE_SIZES.map((size) => <option key={size.label}>{size.label}</option>)}</select></label>
            <label className="designer-zoom-control">
              <span><span>Preview size</span><output>{design.zoom || 85}%</output></span>
              <input
                type="range"
                min="50"
                max="120"
                step="5"
                value={design.zoom || 85}
                onChange={(e) => updateDesign("zoom", Number(e.target.value))}
                aria-label="Preview size"
              />
              <small>Adjust the preview without changing the A5 page format.</small>
            </label>

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
              <span>✓ A5 · 148 × 210 mm page format</span>
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
