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

const clean = (value) => (typeof value === "string" ? value.trim() : "");

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

function dateRange(start, end, current) {
  const from = clean(start);
  const to = current ? "Present" : clean(end);
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
  if (!form) return false;
  const p = form.personalInfo ?? {};
  return Boolean(
    clean(p.fullName) ||
      clean(p.email) ||
      clean(form.summary?.about) ||
      (form.experience ?? []).some((e) => clean(e.jobTitle) || clean(e.company)) ||
      (form.education ?? []).some((e) => clean(e.institution) || clean(e.fieldOfStudy)),
  );
}

export function buildCvData(form) {
  if (!hasContent(form)) return SAMPLE_CV;

  const p = form.personalInfo ?? {};
  const goal = form.careerGoal ?? {};
  const summary = form.summary ?? {};
  const skills = form.skills ?? {};
  const langData = form.languages ?? {};

  const location = [clean(p.city), clean(p.country)].filter(Boolean).join(", ");
  const links = [clean(p.linkedin), clean(p.portfolio)].filter(Boolean);

  const experience = (form.experience ?? [])
    .filter((e) => clean(e.jobTitle) || clean(e.company))
    .map((e) => ({
      company: clean(e.company),
      role: clean(e.jobTitle),
      dates: dateRange(e.startDate, e.endDate, e.current),
      bullets: [...splitLines(e.responsibilities), ...splitLines(e.achievements)],
      tools: e.tools ?? [],
    }));

  const education = (form.education ?? [])
    .filter((e) => clean(e.institution) || clean(e.fieldOfStudy))
    .map((e) => ({
      degree: [clean(e.degreeType), clean(e.fieldOfStudy)].filter(Boolean).join(" — "),
      school: clean(e.institution),
      dates: dateRange(e.startDate, e.endDate, e.current),
      details: clean(e.achievements),
    }));

  const allSkills = [
    ...(skills.technical ?? []),
    ...(skills.programming ?? []),
    ...(skills.tools ?? []),
    ...(skills.soft ?? []),
  ].filter(Boolean);

  const languages = (langData.languages ?? [])
    .filter((l) => clean(l.name))
    .map((l) => ({ name: clean(l.name), level: shortLevel(l.level) }));

  const certifications = (langData.certifications ?? [])
    .filter((c) => clean(c.name))
    .map((c) => [clean(c.name), clean(c.issuer)].filter(Boolean).join(" — "));

  return {
    name: clean(p.fullName),
    role: clean(goal.targetJobTitle),
    location,
    email: clean(p.email),
    phone: clean(p.phone),
    website: links[0] ?? "",
    extraLinks: links.slice(1),
    initials: initialsOf(p.fullName),
    summary: [clean(summary.about), clean(summary.objective)].filter(Boolean).join("\n\n"),
    experience,
    education,
    skills: allSkills,
    strengths: summary.strengths ?? [],
    languages,
    certifications,
    interests: langData.interests ?? [],
    awards: clean(langData.awards),
    projects: clean(langData.projects),
    volunteering: clean(langData.volunteering),
    isSample: false,
  };
}
