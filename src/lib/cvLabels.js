// Libellés des titres de section affichés sur le CV, par langue (réglage « Document › Language »).
// La clé est le texte anglais utilisé dans les modèles.
export const CV_LANGUAGES = [
  { id: "en", label: "English" },
  { id: "fr", label: "Français" },
];

const FR = {
  About: "À propos",
  "About me": "À propos de moi",
  Address: "Adresse",
  Award: "Distinction",
  Certificates: "Certificats",
  Certifications: "Certifications",
  Contact: "Contact",
  "Contact me": "Me contacter",
  "Core Competencies": "Compétences clés",
  "Core skills": "Compétences clés",
  Education: "Formation",
  "Education & Credentials": "Formation et diplômes",
  "Education History": "Parcours scolaire",
  Expertise: "Expertise",
  Interests: "Centres d'intérêt",
  Language: "Langue",
  Languages: "Langues",
  Mail: "E-mail",
  PROFILE: "PROFIL",
  Phone: "Téléphone",
  "Professional Experience": "Expérience professionnelle",
  Profile: "Profil",
  Resume: "CV",
  "Selected profile": "Profil",
  Skills: "Compétences",
  Summary: "Résumé",
  "Technical Skills": "Compétences techniques",
  Website: "Site web",
  "Work Experience": "Expérience",
  "Work Experiences": "Expériences",
  Present: "Présent",
};

export function labelsFor(language) {
  return language === "fr" ? FR : {};
}

export function presentWord(language) {
  return language === "fr" ? "Présent" : "Present";
}

export function ageWord(language, age) {
  return language === "fr" ? `${age} ans` : `${age} years old`;
}
