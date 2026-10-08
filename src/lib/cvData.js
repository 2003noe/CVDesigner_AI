// Convertit les données saisies dans le questionnaire (form) en données
// directement affichables par les modèles de CV (ResumeDocument).

// Données d'exemple : utilisées uniquement quand le questionnaire est encore vide
// (galerie de modèles ouverte depuis la page d'accueil, par exemple).
export const SAMPLE_CV = {
  name: "John Doe",
  role: "Product Designer",
  location: "San Francisco, CA",
  email: "john.doe@email.com",
  phone: "+1 415 555 0182",
  website: "linkedin.com/in/johndoe",
  extraLinks: ["github.com/johndoe", "portfolio.example.com"],
  initials: "JD",
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
  education: [
    {
      degree: "B.Sc. Cognitive Science",
      school: "University of California, Berkeley",
      dates: "2018 — 2022",
      details: "",
    },
  ],
  skills: ["Figma", "UX Research", "Prototyping", "Design Systems", "Accessibility", "Product Strategy"],
  languages: [{ name: "English", level: "Native" }, { name: "Spanish", level: "Fluent" }],
  certifications: ["Professional Foundations Certificate", "Cloud Practitioner Certificate"],
  interests: ["Brand aesthetics", "Visual research", "Color theory"],
  awards: "Outstanding Contribution",
  isSample: true,
};

import { presentWord, ageWord } from "./cvLabels";

const clean = (value) => (typeof value === "string" ? value.trim() : "");

// Les données enregistrées peuvent être incomplètes ou d'une ancienne version :
// on normalise tout pour ne jamais faire planter l'affichage du CV.
const list = (value) => (Array.isArray(value) ? value : []);
const obj = (value) => (value && typeof value === "object" && !Array.isArray(value) ? value : {});

// Texte d'un élément de liste : « Excel » (tag) ou { name: "Excel", level: "Expert" } (compétence)
function label(item) {
  if (typeof item === "string") return item.trim();
  if (typeof item === "number") return String(item);
  const entry = obj(item);
  return clean(entry.name ?? entry.label ?? entry.title);
}

function labels(items) {
  const seen = new Set();
  return list(items)
    .map(label)
    .filter((text) => {
      const key = text.toLowerCase();
      if (!text || seen.has(key)) return false;
      seen.add(key);
      return true;
    });
}

function initialsOf(name) {
  const letters = clean(name)
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0].toUpperCase());
  return letters.join("") || "CV";
}

// "Level (C1)" -> "Level" pour garder un affichage compact dans le CV
function shortLevel(level) {
  return clean(level).replace(/\s*\(.*?\)\s*$/, "");
}

function dateRange(start, end, current, present = "Present") {
  const from = clean(start);
  const to = current ? present : clean(end);
  if (from && to) return `${from} — ${to}`;
  return from || to || "";
}

function splitLines(text) {
  return clean(text)
    .split(/\n+/)
    .map((line) => line.replace(/^[-•*·]\s*/, "").trim())
    .filter(Boolean);
}

function hasContent(form) {
  const f = obj(form);
  const p = obj(f.personalInfo);
  const sk = obj(f.skills);
  const lg = obj(f.languages);
  return Boolean(
    clean(p.fullName) ||
      clean(p.email) ||
      clean(p.phone) ||
      clean(p.city) ||
      clean(p.photo) ||
      clean(obj(f.careerGoal).targetJobTitle) ||
      clean(obj(f.summary).about) ||
      list(f.experience).some((e) => clean(obj(e).jobTitle) || clean(obj(e).company)) ||
      list(f.education).some((e) => clean(obj(e).institution) || clean(obj(e).fieldOfStudy)) ||
      [sk.technical, sk.soft, sk.tools, sk.programming].some((items) => list(items).length > 0) ||
      list(lg.languages).some((l) => clean(obj(l).name)) ||
      list(lg.certifications).some((c) => clean(obj(c).name)),
  );
}

// Vrai tant que l'utilisateur n'a rien saisi (l'éditeur affiche alors la page vierge)
export function isCvEmpty(form) {
  return !hasContent(form);
}

/**
 * options (tous facultatifs) :
 *  - language : "en" | "fr" (mot « Present »)
 *  - sections : { summary, experience, education, skills, languages, certifications, interests, awards } — false = masquée
 *  - header   : { email, phone, location, links } — false = masqué
 *  - allowSample : false pour ne jamais retomber sur le CV d'exemple (éditeur)
 */
export function buildCvData(form, options = {}) {
  const { language = "en", sections = {}, header = {}, allowSample = true } = options;
  if (!hasContent(form)) return allowSample ? SAMPLE_CV : buildEmptyCv(language);
  const show = (key) => sections[key] !== false;
  const head = (key) => header[key] !== false;

  const f = obj(form);
  const p = obj(f.personalInfo);
  const goal = obj(f.careerGoal);
  const summary = obj(f.summary);
  const skills = obj(f.skills);
  const langData = obj(f.languages);

  const addressText = head("address") ? clean(p.address) : "";
  const location = head("location") ? [addressText, clean(p.city), clean(p.country)].filter(Boolean).join(", ") : addressText;
  const ageNumber = clean(String(p.age ?? ""));
  const age = head("age") && ageNumber ? ageWord(language, ageNumber) : "";
  const [firstGuess = "", ...restGuess] = clean(p.fullName).split(/\s+/);
  const links = head("links") ? [clean(p.linkedin), clean(p.portfolio)].filter(Boolean) : [];

  const experience = list(f.experience)
    .map(obj)
    .filter((e) => clean(e.jobTitle) || clean(e.company))
    .map((e) => ({
      id: e.id,
      company: clean(e.company),
      role: clean(e.jobTitle),
      dates: dateRange(e.startDate, e.endDate, e.current, presentWord(language)),
      bullets: [...splitLines(e.responsibilities), ...splitLines(e.achievements)],
      tools: labels(e.tools),
    }));

  const education = list(f.education)
    .map(obj)
    .filter((e) => clean(e.institution) || clean(e.fieldOfStudy))
    .map((e) => ({
      degree: [clean(e.degreeType), clean(e.fieldOfStudy)].filter(Boolean).join(" — "),
      school: clean(e.institution),
      dates: dateRange(e.startDate, e.endDate, e.current, presentWord(language)),
      details: clean(e.achievements),
    }));

  const allSkills = labels([
    ...list(skills.technical),
    ...list(skills.programming),
    ...list(skills.tools),
    ...list(skills.soft),
  ]);

  const languages = list(langData.languages)
    .map(obj)
    .filter((l) => clean(l.name))
    .map((l) => ({ name: clean(l.name), level: shortLevel(l.level) }));

  const certifications = list(langData.certifications)
    .map(obj)
    .filter((c) => clean(c.name))
    .map((c) => [clean(c.name), clean(c.issuer)].filter(Boolean).join(" — "));

  return {
    name: clean(p.fullName),
    firstName: clean(p.firstName) || firstGuess,
    lastName: clean(p.lastName) || restGuess.join(" "),
    role: clean(goal.targetJobTitle),
    location,
    age,
    address: addressText,
    email: head("email") ? clean(p.email) : "",
    phone: head("phone") ? clean(p.phone) : "",
    website: links[0] ?? "",
    extraLinks: links.slice(1),
    initials: initialsOf(p.fullName),
    photo: typeof p.photo === "string" ? p.photo : "", // photo du questionnaire
    summary: show("summary") ? [clean(summary.about), clean(summary.objective)].filter(Boolean).join("\n\n") : "",
    experience: show("experience") ? experience : [],
    education: show("education") ? education : [],
    skills: show("skills") ? allSkills : [],
    strengths: labels(summary.strengths),
    languages: show("languages") ? languages : [],
    certifications: show("certifications") ? certifications : [],
    interests: show("interests") ? labels(langData.interests) : [],
    awards: show("awards") ? clean(langData.awards) : "",
    projects: clean(langData.projects),
    volunteering: clean(langData.volunteering),
    isSample: false,
  };
}

// CV sans aucune donnée (affichage de l'éditeur avant la première saisie)
function buildEmptyCv() {
  return {
    name: "", firstName: "", lastName: "", role: "", location: "", age: "", address: "", email: "", phone: "", website: "", extraLinks: [], initials: "CV", photo: "",
    summary: "", experience: [], education: [], skills: [], strengths: [], languages: [], certifications: [],
    interests: [], awards: "", projects: "", volunteering: "", isSample: false,
  };
}

/**
 * Pour les aperçus de modèles : si le CV est encore peu rempli (moins de 3 sections), les sections
 * vides sont complétées par le CV d'exemple afin de montrer le vrai rendu du modèle.
 * Le nom, le titre, les coordonnées et la photo restent ceux de l'utilisateur.
 */
export function withSampleFill(cv) {
  if (!cv || cv.isSample) return cv;
  const sections = ["summary", "experience", "education", "skills", "languages"];
  const filled = sections.filter((key) => (Array.isArray(cv[key]) ? cv[key].length : cv[key])).length;
  if (filled >= 3) return cv;
  const next = { ...cv };
  sections.forEach((key) => {
    const empty = Array.isArray(cv[key]) ? cv[key].length === 0 : !cv[key];
    if (empty) next[key] = SAMPLE_CV[key];
  });
  if (!next.certifications.length) next.certifications = SAMPLE_CV.certifications;
  if (!next.name) next.name = SAMPLE_CV.name;
  if (!next.role) next.role = SAMPLE_CV.role;
  if (!next.email && !next.phone && !next.location) {
    next.email = SAMPLE_CV.email;
    next.phone = SAMPLE_CV.phone;
    next.location = SAMPLE_CV.location;
  }
  return next;
}
