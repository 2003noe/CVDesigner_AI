import { Fragment, useContext, useMemo, useState } from "react";
import TopNav from "../TopNav";
import StepIndicator, { IMPORT_STEPS } from "../StepIndicator";
import { SAMPLE_CV } from "../../lib/cvData";
import PhotoCropper from "../PhotoCropper";
import { E, EditContext } from "../editor/Editable";
import { labelsFor } from "../../lib/cvLabels";
import { TEMPLATE_META } from "../../lib/templateMeta";

const BASE_TEMPLATES = [
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

export const TEMPLATES = BASE_TEMPLATES.map((template) => ({ ...template, ...TEMPLATE_META[template.id] }));

const FILTERS = ["All", "Professional", "Modern", "Classic", "Minimal", "Creative", "ATS-friendly"];
export const ACCENTS = [
  { name: "Atlantic", color: "#173b4d" },
  { name: "Blue", color: "#2563eb" },
  { name: "Teal", color: "#0f766e" },
  { name: "Charcoal", color: "#24272c" },
  { name: "Purple", color: "#7c3aed" },
  { name: "Terracotta", color: "#be5b45" },
  { name: "Forest", color: "#315b50" },
];

export const TYPOGRAPHIES = [
  "Inter",
  "Poppins",
  "Montserrat",
  "Roboto",
  "Lato",
  "Open Sans",
  "Merriweather",
  "Playfair Display",
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

export const FONT_FAMILIES = {
  Inter: 'Inter, Arial, sans-serif',
  Poppins: 'Poppins, "Segoe UI", sans-serif',
  Montserrat: 'Montserrat, "Segoe UI", sans-serif',
  Roboto: 'Roboto, Arial, sans-serif',
  Lato: 'Lato, "Segoe UI", sans-serif',
  "Open Sans": '"Open Sans", "Segoe UI", sans-serif',
  Merriweather: 'Merriweather, Georgia, serif',
  "Playfair Display": '"Playfair Display", Georgia, serif',
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

export const PAGE_SIZES = [
  { label: "A5 · 148 × 210 mm", width: "559px", height: "794px" },
];

const DEFAULT_DESIGN = {
  typography: "Inter",
  spacing: "Balanced",
  pageSize: PAGE_SIZES[0].label,
  zoom: 85,
  accent: "#2563eb",
  photo: null, // null = photo du questionnaire (si elle existe) · texte = photo choisie ici · false = aucune photo
  photoPosition: "Right",
  fontScale: 100, // taille du texte du CV, en % (la page garde sa taille)
};

// Photo réellement affichée sur le CV
export function resolvePhoto(design, cv) {
  if (design.photo === false || design.showPhoto === false) return "";
  return design.photo || cv?.photo || "";
}

export function makeInitialDesigns() {
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

const has = (list) => Array.isArray(list) && list.length > 0;
const langText = (language) => (language.level ? `${language.name} (${language.level})` : language.name);
const educationText = (entry) =>
  [entry.degree, entry.school].filter(Boolean).join(" — ") + (entry.dates ? ` (${entry.dates})` : "");
export const DEFAULT_SECTION_ORDER = ["summary", "experience", "education", "skills", "languages", "certifications"];
const SECTION_CLASS_VARIANTS = ["andrade", "parvati", "takahashi", "paterson", "kaya", "herrera"];

export function ResumeDocument({ template, design, cv: cvProp = SAMPLE_CV, preview = false }) {
  let cv = cvProp;
  const edit = useContext(EditContext);
  const labels = labelsFor(design.language);
  const L = (text) => labels[text] ?? text;
  // Le modèle prévoit-il une photo ? (sinon : jamais de photo ni de pastille vide)
  const photoAllowed = template.photo !== false;
  const photo = photoAllowed ? resolvePhoto(design, cv) : "";
  const hasPhoto = Boolean(photo);
  // L'âge n'apparaît que dans les modèles qui le prévoient (la donnée, elle, est toujours conservée)
  cv = { ...cv, location: [cv.location, template.showAge ? cv.age : ""].filter(Boolean).join(" · ") };
  const pageSize = PAGE_SIZES.find((size) => size.label === design.pageSize) || PAGE_SIZES[0];
  // Un nom très long réduit un peu sa taille pour ne pas se casser en plein mot
  const nameLength = (cv.name || "").length;
  const nameFit = nameLength > 34 ? 0.68 : nameLength > 26 ? 0.78 : nameLength > 20 ? 0.88 : 1;
  const spacingGap = design.spacing === "Compact" ? 8 : design.spacing === "Relaxed" ? 18 : 12;
  // Police des titres : celle choisie à part, sinon (si l'utilisateur a choisi la police du corps) la même,
  // sinon celle propre au modèle.
  const chosenHeading = design.headingFont ?? design.nameFont;
  const headingFont = chosenHeading && chosenHeading !== "same" ? chosenHeading : design.typographyCustom ? design.typography : "same";
  const resumeStyle = {
    "--resume-accent": design.accent,
    "--resume-secondary": design.secondary || undefined,
    "--resume-text": design.textColor || undefined,
    "--resume-bg": design.background || undefined,
    "--resume-font": FONT_FAMILIES[design.typography] || FONT_FAMILIES.Inter,
    "--resume-heading-font": FONT_FAMILIES[headingFont] || undefined,
    "--resume-gap": `${design.sectionGap ?? spacingGap}px`,
    "--resume-page-width": pageSize.width,
    "--resume-page-height": pageSize.height,
    "--resume-zoom": Number(design.zoom || 85) / 100,
    "--resume-font-scale": Number(design.fontScale || 100) / 100,
    "--resume-name-scale": (Number(design.nameScale || 100) / 100) * nameFit,
    "--resume-heading-scale": Number(design.headingScale || 100) / 100,
    "--resume-photo-scale": Number(design.photoScale || 100) / 100,
    "--resume-line-height": design.lineHeight || undefined,
    "--resume-entry-gap": design.entryGap != null ? `${design.entryGap}px` : undefined,
  };
  const dataAttrs = {
    "data-lh": design.lineHeight ? "1" : undefined,
    "data-entry-gap": design.entryGap != null ? "1" : undefined,
    "data-date-pos": design.datePos && design.datePos !== "right" ? design.datePos : undefined,
    "data-bullets": design.bullets && design.bullets !== "disc" ? design.bullets : undefined,
    "data-heading-case": design.headingCase && design.headingCase !== "default" ? design.headingCase : undefined,
    "data-font-custom": design.typographyCustom ? "1" : undefined,
    "data-heading-font": headingFont && headingFont !== "same" ? "1" : undefined,
    "data-photo-shape": design.photoShape && design.photoShape !== "default" ? design.photoShape : undefined,
    "data-photo-scale": design.photoScale && design.photoScale !== 100 ? "1" : undefined,
    "data-secondary": design.secondary ? "1" : undefined,
    "data-text": design.textColor ? "1" : undefined,
    "data-bg": design.background ? "1" : undefined,
  };
  const footerOptions = { pageNumber: true, name: true, email: false, ...(design.footer || {}) };
  const footerText = [footerOptions.name && cv.name, footerOptions.email && cv.email, footerOptions.pageNumber && "01"]
    .filter(Boolean)
    .join(" · ");

  const skills = cv.skills ?? [];
  const languages = cv.languages ?? [];
  const education = cv.education ?? [];
  const certifications = cv.certifications ?? [];
  const interests = cv.interests ?? [];
  const skillsText = skills.join(" · ");
  const languagesText = languages.map(langText).join(" · ");
  const contactLine = [cv.location, cv.email, cv.website].filter(Boolean).join(" · ");
  const firstEducation = education[0];

  const educationBlock = has(education)
    ? education.map((entry, index) => (
        <p key={`${entry.school}-${index}`}>
          {educationText(entry)}
          {entry.details && <><br /><small>{entry.details}</small></>}
        </p>
      ))
    : null;

  const secondary = (
    <aside className="resume-secondary">
      {cv.summary && <section><h3>{L("Profile")}</h3><p><E f="summary" v={cv.summary} ph="Write a short summary" /></p></section>}
      {has(skills) && <section><h3>{L("Skills")}</h3><p>{skillsText}</p></section>}
      {has(education) && <section><h3>{L("Education")}</h3><strong>{educationText(education[0])}</strong></section>}
      {has(languages) && <section><h3>{L("Languages")}</h3><p>{languagesText}</p></section>}
    </aside>
  );

  const experience = has(cv.experience) ? (
    <section className={`resume-section${SECTION_CLASS_VARIANTS.includes(template.variant) ? ` resume-${template.variant}-section` : ""}`}>
      <h3>{L("Professional Experience")}</h3>
      {cv.experience.map((job, jobIndex) => (
        <div className="resume-job" key={job.id ?? `${job.company}-${job.role}-${jobIndex}`}>
          <div className="resume-job-heading">
            <strong><E f="job.role" id={job.id} v={job.role || job.company} ph="Job title" readOnly={!job.role} /></strong>
            <span>{job.dates}</span>
          </div>
          {job.role && job.company && <b><E f="job.company" id={job.id} v={job.company} ph="Company" /></b>}
          {has(job.bullets) && (
            <ul>
              {job.bullets.map((bullet, index) => <li key={index}>{bullet}</li>)}
            </ul>
          )}
        </div>
      ))}
    </section>
  ) : null;

  const header = (
    <header className="resume-header">
      {photoAllowed &&
        (hasPhoto ? (
          <img className="resume-photo" src={photo} alt="" />
        ) : (
          <div className="resume-avatar" aria-hidden="true">{cv.initials}</div>
        ))}
      <div className="resume-heading">
        <span><E f="role" v={cv.role} ph="Job title" /></span>
        <h2><E f="name" v={cv.name} ph="Your name" /></h2>
        <p>{contactLine}</p>
        <small>{cv.phone}</small>
      </div>
    </header>
  );

  const avatar = (className) =>
    !photoAllowed ? null : hasPhoto ? (
      <img className={className.photo} src={photo} alt="" />
    ) : (
      <div className={className.placeholder} aria-hidden="true">{cv.initials}</div>
    );

  return (
    <article
      className={`resume-document resume-${template.variant} ${preview ? "resume-preview" : ""} ${edit ? "cv-edit-mode" : ""}`}
      style={resumeStyle}
      {...dataAttrs}
    >
      {template.variant === "atlantic" && (
        <>
          <div className="resume-sidebar">
            {avatar({ photo: "resume-sidebar-photo", placeholder: "resume-sidebar-avatar" })}
            <h2><E f="name" v={cv.name} ph="Your name" /></h2>
            <span><E f="role" v={cv.role} ph="Job title" /></span>
            <div className="resume-sidebar-contact">
              {[cv.location, cv.email, cv.phone, cv.website].filter(Boolean).map((line, index) => (
                <span key={index}>{line}<br /></span>
              ))}
            </div>
            {has(languages) && <><h4>{L("Languages")}</h4><p>{languagesText}</p></>}
            {has(skills) && <><h4>{L("Skills")}</h4><p>{skillsText}</p></>}
          </div>
          <main className="resume-main">
            {cv.summary && <section className="resume-section"><h3>{L("Summary")}</h3><p><E f="summary" v={cv.summary} ph="Write a short summary" /></p></section>}
            {experience}
            {has(education) && <section className="resume-section"><h3>{L("Education")}</h3>{educationBlock}</section>}
          </main>
        </>
      )}

      {template.variant === "andrade" && (
        <>
          <aside className="resume-andrade-sidebar">
            {avatar({ photo: "resume-andrade-photo", placeholder: "resume-andrade-avatar" })}
            <section className="resume-andrade-sidebar-section">
              <h3>{L("Contact me")}</h3>
              {[cv.phone, cv.email, cv.location, cv.website, ...(cv.extraLinks ?? [])].filter(Boolean).map((line, index) => (
                <p key={index}>{line}</p>
              ))}
            </section>
            {has(skills) && (
              <section className="resume-andrade-sidebar-section">
                <h3>{L("Skills")}</h3>
                <ul>{skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
              </section>
            )}
            {has(languages) && (
              <section className="resume-andrade-sidebar-section">
                <h3>{L("Language")}</h3>
                <ul>{languages.map((language, index) => <li key={index}>{langText(language)}</li>)}</ul>
              </section>
            )}
          </aside>
          <main className="resume-andrade-main">
            <header className="resume-andrade-header">
              <span><E f="role" v={cv.role} ph="Job title" /></span>
              <h2><E f="name" v={cv.name} ph="Your name" /></h2>
            </header>
            {cv.summary && (
              <section className="resume-section resume-andrade-section">
                <h3>{L("About me")}</h3>
                <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
              </section>
            )}
            {experience}
            {has(education) && (
              <section className="resume-section resume-andrade-section">
                <h3>{L("Education")}</h3>
                {educationBlock}
              </section>
            )}
          </main>
        </>
      )}

      {template.variant === "parvati" && (
        <>
          <header className="resume-parvati-header">
            <h2><E f="name" v={cv.name} ph="Your name" /></h2>
            <span><E f="role" v={cv.role} ph="Job title" /></span>
            <div>
              {[cv.phone, cv.location, cv.email].filter(Boolean).map((line, index) => <span key={index}>{line}</span>)}
            </div>
          </header>
          {cv.summary && (
            <section className="resume-section resume-parvati-section">
              <h3>{L("About me")}</h3>
              <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
            </section>
          )}
          {has(education) && (
            <section className="resume-section resume-parvati-section">
              <h3>{L("Education")}</h3>
              {educationBlock}
            </section>
          )}
          {experience}
          {has(skills) && (
            <section className="resume-section resume-parvati-section">
              <h3>{L("Skills")}</h3>
              <ul className="resume-parvati-skills">
                {skills.map((skill, index) => <li key={index}>{skill}</li>)}
              </ul>
            </section>
          )}
          {has(languages) && (
            <section className="resume-section resume-parvati-section">
              <h3>{L("Languages")}</h3>
              <p>{languagesText}</p>
            </section>
          )}
        </>
      )}

      {template.variant === "takahashi" && (
        <>
          <header className="resume-takahashi-header">
            {avatar({ photo: "resume-takahashi-photo", placeholder: "resume-takahashi-avatar" })}
            <div className="resume-takahashi-identity">
              <h2><E f="name" v={cv.name} ph="Your name" /></h2>
              <span><E f="role" v={cv.role} ph="Job title" /></span>
            </div>
          </header>
          <aside className="resume-takahashi-sidebar">
            <section className="resume-takahashi-section">
              <h3>{L("Contact me")}</h3>
              {[cv.phone, cv.website, cv.email, cv.location].filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}
            </section>
            {has(skills) && (
              <section className="resume-takahashi-section">
                <h3>{L("Skills")}</h3>
                <ul>
                  {skills.map((skill, index) => (
                    <li key={index}><span>{skill}</span><i /></li>
                  ))}
                </ul>
              </section>
            )}
            {has(education) && (
              <section className="resume-takahashi-section resume-takahashi-education">
                <h3>{L("Education")}</h3>
                {educationBlock}
              </section>
            )}
          </aside>
          <main className="resume-takahashi-main">
            {cv.summary && (
              <section className="resume-section resume-takahashi-section">
                <h3>{L("About me")}</h3>
                <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
              </section>
            )}
            {experience}
          </main>
        </>
      )}

      {template.variant === "paterson" && (
        <>
          <aside className="resume-paterson-sidebar">
            {avatar({ photo: "resume-paterson-photo", placeholder: "resume-paterson-avatar" })}
            <section className="resume-paterson-section">
              <h3>{L("Contact")}</h3>
              {[cv.phone, cv.email, cv.location, cv.website].filter(Boolean).map((line, index) => <p key={index}>{line}</p>)}
            </section>
            {has(skills) && (
              <section className="resume-paterson-section">
                <h3>{L("Expertise")}</h3>
                <ul>{skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
              </section>
            )}
            {has(languages) && (
              <section className="resume-paterson-section">
                <h3>{L("Language")}</h3>
                <ul className="resume-paterson-languages">
                  {languages.map((language, index) => <li key={index}>{langText(language)}<span /></li>)}
                </ul>
              </section>
            )}
          </aside>
          <main className="resume-paterson-main">
            <header className="resume-paterson-header">
              <h2><E f="name" v={cv.name} ph="Your name" /></h2>
              <span><E f="role" v={cv.role} ph="Job title" /></span>
            </header>
            {cv.summary && (
              <section className="resume-section resume-paterson-section">
                <h3>{L("About me")}</h3>
                <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
              </section>
            )}
            {experience}
            {has(education) && (
              <section className="resume-section resume-paterson-section">
                <h3>{L("Education")}</h3>
                {educationBlock}
              </section>
            )}
          </main>
        </>
      )}

      {template.variant === "marchesi" && (
        <>
          <main className="resume-marchesi-main">
            <header className="resume-marchesi-topline">
              <span><E f="role" v={cv.role} ph="Job title" /></span>
              <span>{L("Resume")}</span>
            </header>
            <section className="resume-marchesi-intro">
              <div className="resume-marchesi-about">
                <h3>{L("About")}</h3>
                <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
              </div>
              {avatar({ photo: "resume-marchesi-photo", placeholder: "resume-marchesi-photo-placeholder" })}
            </section>
            {has(cv.experience) && (
              <section className="resume-marchesi-section">
                <h3>{L("Work Experiences")}</h3>
                {cv.experience.map((job, index) => (
                  <div className="resume-marchesi-entry" key={index}>
                    <div><strong>{job.company || job.role}</strong>{job.company && <span>{job.role}</span>}</div>
                    <time>{job.dates}</time>
                  </div>
                ))}
              </section>
            )}
            {has(education) && (
              <section className="resume-marchesi-section">
                <h3>{L("Education History")}</h3>
                {education.map((entry, index) => (
                  <div className="resume-marchesi-entry" key={index}>
                    <div><strong>{entry.school || entry.degree}</strong>{entry.school && <span>{entry.degree}</span>}</div>
                    <time>{entry.dates}</time>
                  </div>
                ))}
              </section>
            )}
            <section className="resume-marchesi-bottom">
              {has(interests) && <div><h3>{L("Interests")}</h3><p>{interests.join(" · ")}</p></div>}
              {has(skills) && <div><h3>{L("Skills")}</h3><p>{skillsText}</p></div>}
            </section>
            <footer className="resume-marchesi-contact">
              <span>{cv.website}<br />{cv.phone}</span>
              <span>{cv.email}<br />{cv.location}</span>
            </footer>
          </main>
          <aside className="resume-marchesi-name" aria-label={cv.name}><E f="name" v={cv.name} ph="Your name" /></aside>
        </>
      )}

      {template.variant === "feig" && (
        <>
          <section className="resume-feig-profile">
            {avatar({ photo: "resume-feig-photo", placeholder: "resume-feig-photo-placeholder" })}
            <div className="resume-feig-identity">
              <h2><E f="name" v={cv.name} ph="Your name" /></h2>
              <span><E f="role" v={cv.role} ph="Job title" /></span>
            </div>
          </section>
          <section className="resume-feig-contact">
            <h3>{L("Contact")}</h3>
            {cv.phone && <p><strong>{L("Phone")}</strong>{cv.phone}</p>}
            {cv.website && <p><strong>{L("Website")}</strong>{cv.website}</p>}
            {cv.email && <p><strong>{L("Mail")}</strong>{cv.email}</p>}
            {cv.location && <p><strong>{L("Address")}</strong>{cv.location}</p>}
          </section>
          <section className="resume-feig-about">
            <h3>{L("About")}</h3>
            <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
          </section>
          <section className="resume-feig-education">
            {has(education) && (
              <>
                <h3>{L("Education")}</h3>
                {education.map((entry, index) => (
                  <p key={index}><span>{entry.dates}</span><strong>{[entry.degree, entry.school].filter(Boolean).join(" — ")}</strong></p>
                ))}
              </>
            )}
            {has(skills) && (
              <>
                <h3>{L("Skills")}</h3>
                <ul>{skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
              </>
            )}
          </section>
          <section className="resume-feig-experience">
            {has(cv.experience) && (
              <>
                <h3>{L("Work Experience")}</h3>
                {cv.experience.map((job, index) => (
                  <div key={index}>
                    <strong><E f="job.role" id={job.id} v={job.role || job.company} ph="Job title" readOnly={!job.role} /></strong>
                    <span>{[job.dates, job.role && job.company].filter(Boolean).join(" | ")}</span>
                    {has(job.bullets) && <p>{job.bullets.join(" ")}</p>}
                  </div>
                ))}
              </>
            )}
            {cv.awards && (
              <>
                <h3>{L("Award")}</h3>
                <div><strong>{cv.awards}</strong></div>
              </>
            )}
          </section>
        </>
      )}

      {template.variant === "kaya" && (
        <>
          <header className={`resume-kaya-header ${photoAllowed ? "" : "is-plain"}`}>
            {avatar({ photo: "resume-kaya-photo", placeholder: "resume-kaya-photo-placeholder" })}
            <div className="resume-kaya-identity">
              <h2><E f="name" v={cv.name} ph="Your name" /></h2>
              <span><E f="role" v={cv.role} ph="Job title" /></span>
              <div className="resume-kaya-contact">
                {[cv.email, cv.phone, cv.location, cv.website, ...(cv.extraLinks ?? [])].filter(Boolean).map((line, index) => (
                  <span key={index}>{line}</span>
                ))}
              </div>
            </div>
          </header>
          {cv.summary && (
            <section className="resume-section resume-kaya-section">
              <h3>{L("Summary")}</h3>
              <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
            </section>
          )}
          {experience}
          {has(education) && (
            <section className="resume-section resume-kaya-section">
              <h3>{L("Education")}</h3>
              {education.map((entry, index) => (
                <div className="resume-kaya-entry" key={index}>
                  <strong>{entry.school || entry.degree}</strong>
                  {entry.school && <span>{entry.degree}</span>}
                  {entry.dates && <span>{entry.dates}</span>}
                </div>
              ))}
            </section>
          )}
          {has(skills) && (
            <section className="resume-section resume-kaya-section">
              <h3>{L("Skills")}</h3>
              <ul className="resume-kaya-rated-list">
                {skills.map((skill, index) => <li key={index}><span>{skill}</span></li>)}
              </ul>
            </section>
          )}
          {has(languages) && (
            <section className="resume-section resume-kaya-section">
              <h3>{L("Languages")}</h3>
              <ul className="resume-kaya-rated-list">
                {languages.map((language, index) => <li key={index}><span>{langText(language)}</span></li>)}
              </ul>
            </section>
          )}
          {has(certifications) && (
            <section className="resume-section resume-kaya-section">
              <h3>{L("Certificates")}</h3>
              <ul className="resume-kaya-certificates">
                {certifications.map((certification, index) => <li key={index}>{certification}</li>)}
              </ul>
            </section>
          )}
        </>
      )}

      {template.variant === "herrera" && (
        <>
          <header className="resume-herrera-header">
            <div>
              <h2><E f="name" v={cv.name} ph="Your name" /></h2>
              <span><E f="role" v={cv.role} ph="Job title" /></span>
              <section>
                {[cv.email, cv.phone, cv.location, cv.website].filter(Boolean).map((line, index) => <span key={index}>{line}</span>)}
              </section>
            </div>
            {avatar({ photo: "resume-herrera-photo", placeholder: "resume-herrera-photo-placeholder" })}
          </header>
          <main className="resume-herrera-main">
            {cv.summary && (
              <section className="resume-section resume-herrera-section">
                <h3>{L("Summary")}</h3>
                <p><E f="summary" v={cv.summary} ph="Write a short summary" /></p>
              </section>
            )}
            {experience}
            {has(education) && (
              <section className="resume-section resume-herrera-section">
                <h3>{L("Education")}</h3>
                {education.map((entry, index) => (
                  <div className="resume-herrera-entry" key={index}>
                    <strong>{entry.degree || entry.school}</strong>
                    <span>{entry.dates}</span>
                    {entry.degree && entry.school && <em>{entry.school}</em>}
                  </div>
                ))}
              </section>
            )}
            {has(skills) && (
              <section className="resume-section resume-herrera-section">
                <h3>{L("Skills")}</h3>
                <ul>{skills.map((skill, index) => <li key={index}>{skill}</li>)}</ul>
              </section>
            )}
            {has(languages) && (
              <section className="resume-section resume-herrera-section">
                <h3>{L("Languages")}</h3>
                <ul>{languages.map((language, index) => <li key={index}>{langText(language)}</li>)}</ul>
              </section>
            )}
          </main>
        </>
      )}

      {template.variant === "leaves" && (
        <>
          <div className="resume-leaves-strip"><span>LEAVES</span></div>
          <main className="resume-leaves-main">
            {header}
            {experience}
            {has(education) && <section className="resume-section"><h3>{L("Education")}</h3>{educationBlock}</section>}
          </main>
          <aside className="resume-leaves-side">{secondary}</aside>
        </>
      )}

      {template.variant === "creative" && (
        <>
          <aside className="resume-creative-side">
            {hasPhoto ? (
              <img className="creative-mark creative-photo" src={photo} alt="" />
            ) : (
              <div className="creative-mark">{cv.initials}</div>
            )}
            <h2><E f="name" v={cv.name} ph="Your name" /></h2>
            <span><E f="role" v={cv.role} ph="Job title" /></span>
            {[cv.location, cv.email, cv.phone, cv.website].filter(Boolean).map((line, index) => <div key={index}>{line}</div>)}
            {has(skills) && <><h4>{L("Core skills")}</h4><p>{skillsText}</p></>}
            {has(languages) && <><h4>{L("Languages")}</h4><p>{languagesText}</p></>}
          </aside>
          <main className="resume-main resume-creative-main">
            <div className="creative-title"><span>{L("Selected profile")}</span><h2><E f="name" v={cv.name} ph="Your name" /></h2><p><E f="summary" v={cv.summary} ph="Write a short summary" /></p></div>
            {experience}
            {has(education) && <section className="resume-section"><h3>{L("Education")}</h3>{educationBlock}</section>}
          </main>
        </>
      )}

      {!["atlantic", "andrade", "parvati", "takahashi", "paterson", "marchesi", "feig", "kaya", "herrera", "leaves", "creative"].includes(template.variant) && (
        <>
          {header}
          <div className="resume-body">
            {template.variant === "horizon" && <div className="horizon-rule" />}
            {template.variant === "executive" && cv.summary && <div className="executive-intro"><span>{L("PROFILE")}</span><p><E f="summary" v={cv.summary} ph="Write a short summary" /></p></div>}
            {template.variant === "nova" && cv.summary && <div className="nova-intro"><p><E f="summary" v={cv.summary} ph="Write a short summary" /></p></div>}
            {template.variant === "mono" && <div className="mono-contact">{[cv.location, cv.email, cv.phone].filter(Boolean).join(" · ")}</div>}
            {template.variant === "technical" && has(skills) && (
              <section className="resume-section tech-skills"><h3>{L("Technical Skills")}</h3><p>{skillsText}</p></section>
            )}
            {(design.sectionOrder ?? DEFAULT_SECTION_ORDER).map((key) => (
              <Fragment key={key}>
                {key === "summary" && !["executive", "nova"].includes(template.variant) && cv.summary && (
                  <section className="resume-section"><h3>{L("Profile")}</h3><p><E f="summary" v={cv.summary} ph="Write a short summary" /></p></section>
                )}
                {key === "experience" && experience}
                {key === "education" && has(education) && (
                  <section className="resume-section">
                    <h3>{L(template.variant === "executive" ? "Education & Credentials" : "Education")}</h3>
                    {educationBlock}
                  </section>
                )}
                {key === "skills" && template.variant !== "technical" && has(skills) && (
                  <section className="resume-section"><h3>{L("Skills")}</h3><p>{skillsText}</p></section>
                )}
                {key === "languages" && has(languages) && <section className="resume-section"><h3>{L("Languages")}</h3><p>{languagesText}</p></section>}
                {key === "certifications" && has(certifications) && <section className="resume-section"><h3>{L("Certifications")}</h3><p>{certifications.join(" · ")}</p></section>}
              </Fragment>
            ))}
            {template.variant === "steady" && has(cv.strengths) && (
              <section className="resume-section"><h3>{L("Core Competencies")}</h3><p>{cv.strengths.join(" · ")}</p></section>
            )}
          </div>
        </>
      )}
      {footerText && <small className="resume-page-number">{footerText}</small>}
    </article>
  );
}

function TemplateCard({ template, design, cv, selected, onPreview }) {
  return (
    <article className={`gallery-card ${selected ? "is-selected" : ""}`}>
      <button className="gallery-preview" type="button" onClick={() => onPreview(template.id)} aria-label={`Preview ${template.name}`}>
        <ResumeDocument template={template} design={design} cv={cv} preview />
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

function TemplateDesigner({ template, design, cv, onDesignChange, onBack, onChoose }) {
  const [photoError, setPhotoError] = useState("");
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const photoShown = resolvePhoto(design, cv);

  function updateDesign(key, value) {
    onDesignChange({ ...design, [key]: value });
  }

  // La photo choisie passe d'abord par la fenêtre de cadrage (PhotoCropper)
  function handlePhoto(event) {
    const file = event.target.files?.[0];
    event.target.value = "";
    setPhotoError("");
    if (file) setPendingPhoto(file);
  }

  return (
    <main className="template-designer-v2">
      {pendingPhoto && (
        <PhotoCropper
          file={pendingPhoto}
          onCancel={() => setPendingPhoto(null)}
          onDone={(dataUrl) => {
            updateDesign("photo", dataUrl);
            setPendingPhoto(null);
          }}
        />
      )}
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
          <div className="designer-v2-caption"><span>LIVE PREVIEW</span><span>{cv.name || "Your CV"} · 1 page</span></div>
          <div className="designer-v2-paper">
            <ResumeDocument template={template} design={design} cv={cv} />
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

            <label className="designer-zoom-control">
              <span><span>Text size</span><o>{design.fontScale || 100}%</o></span>
              <input
                type="range"
                min="70"
                max="140"
                step="5"
                value={design.fontScale || 100}
                onChange={(e) => updateDesign("fontScale", Number(e.target.value))}
                aria-label="Text size"
              />
              <small>Makes the CV text bigger or smaller. The page size does not change.</small>
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
                {photoShown ? <img src={photoShown} alt="" /> : <span>+</span>}
                <div><strong>Profile photo</strong><small>Optional</small></div>
              </div>
              <label className="photo-button">{photoShown ? "Change" : "Add photo"}<input type="file" accept="image/png,image/jpeg,image/webp" onChange={handlePhoto} /></label>
              {photoShown && <button type="button" onClick={() => updateDesign("photo", false)}>Remove</button>}
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
  cvData = SAMPLE_CV,
  embedded = false,
  isAuthed,
}) {
  const normalizedInitial = TEMPLATES.some((template) => template.id === initialSelectedId)
    ? initialSelectedId
    : TEMPLATES[0].id;
  const [selectedId, setSelectedId] = useState(normalizedInitial);
  const [editingId, setEditingId] = useState(null);
  const [designs, setDesigns] = useState(() => {
    const sharedPhoto = initialDesigns[normalizedInitial]?.photo ?? null;
    const merged = { ...makeInitialDesigns(), ...initialDesigns };
    return Object.fromEntries(Object.entries(merged).map(([id, design]) => [id, { ...design, photo: sharedPhoto }]));
  });
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
    setDesigns((previous) => {
      const next = { ...previous, [templateId]: design };
      // La photo est la même pour tous les modèles : on la recopie partout
      if (design.photo !== previous[templateId]?.photo) {
        for (const id of Object.keys(next)) next[id] = { ...next[id], photo: design.photo };
      }
      return next;
    });
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
            cv={cvData}
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
                      cv={cvData}
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
