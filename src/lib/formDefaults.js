import { emptyPersonalInfo } from "../components/steps/PersonalInfo";
import { emptyCareerGoal } from "../components/steps/CareerGoal";
import { emptySummary } from "../components/steps/Summary";
import { emptyEducationEntries } from "../components/steps/Education";
import { emptyExperienceEntries } from "../components/steps/Experience";
import { emptySkills } from "../components/steps/Skills";
import { emptyLanguagesData } from "../components/steps/Languages";

// Données d'un CV vide — partagées par le questionnaire (CVWizard) et l'éditeur (CvEditor)
export function initialFormData() {
  return {
    personalInfo: emptyPersonalInfo,
    careerGoal: emptyCareerGoal,
    summary: emptySummary,
    education: emptyEducationEntries,
    experienceType: "Work experience",
    experience: emptyExperienceEntries,
    skills: emptySkills,
    languages: emptyLanguagesData,
  };
}

// Fusionne une section sauvegardée avec ses valeurs par défaut
// (si on ajoute un champ plus tard, les anciens CV restent valides)
function mergeSection(defaults, saved) {
  if (saved === undefined || saved === null) return defaults;
  if (Array.isArray(defaults) || typeof defaults !== "object") return saved;
  return { ...defaults, ...saved };
}

export function mergeForm(saved = {}) {
  const defaults = initialFormData();
  return Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, mergeSection(value, saved?.[key])]));
}
