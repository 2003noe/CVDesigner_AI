import { TEMPLATES, makeInitialDesigns } from "../components/templates/TemplatePage";

// Réglages de design propres à l'éditeur, ajoutés aux réglages de base d'un modèle.
// null = « valeur du modèle » : tant que l'utilisateur n'y touche pas, le modèle garde son propre style.
export const EDITOR_DESIGN_DEFAULTS = {
  language: "en",
  fontScale: 100,
  nameScale: 100,
  headingScale: 100,
  lineHeight: null,
  sectionGap: null,
  entryGap: null,
  datePos: "right",
  bullets: "disc",
  headingCase: "default",
  nameFont: "same",
  photoShape: "default",
  accentCustom: false,
  typographyCustom: false,
  header: { email: true, phone: true, location: true, links: true },
  footer: { pageNumber: true, name: true, email: false },
  sections: { summary: true, experience: true, education: true, skills: true, languages: true, certifications: true, interests: true, awards: true },
};

// « Une colonne » ou « deux colonnes » (barre latérale, éditorial…) d'après le champ layout du modèle
export function templateKind(template) {
  return /two|sidebar|editorial/i.test(template.layout) ? "two" : "one";
}

export function normalizeDesign(raw, templateId) {
  const all = makeInitialDesigns();
  const base = all[templateId] ?? all[TEMPLATES[0].id];
  const saved = raw && typeof raw === "object" ? raw : {};
  return {
    ...base,
    ...EDITOR_DESIGN_DEFAULTS,
    ...saved,
    header: { ...EDITOR_DESIGN_DEFAULTS.header, ...(saved.header ?? {}) },
    footer: { ...EDITOR_DESIGN_DEFAULTS.footer, ...(saved.footer ?? {}) },
    sections: { ...EDITOR_DESIGN_DEFAULTS.sections, ...(saved.sections ?? {}) },
  };
}

// Changement de modèle : le design de l'utilisateur est conservé ; couleur et police ne suivent le
// nouveau modèle que si l'utilisateur ne les a pas choisies lui-même.
export function designForTemplate(design, templateId) {
  const base = makeInitialDesigns()[templateId];
  if (!base) return design;
  return {
    ...design,
    accent: design.accentCustom ? design.accent : base.accent,
    typography: design.typographyCustom ? design.typography : base.typography,
    spacing: base.spacing,
  };
}

// Texte du pied de page du PDF pour la page `page` sur `total`
export function footerFor(design, cv) {
  const options = { pageNumber: true, name: true, email: false, ...(design.footer ?? {}) };
  const parts = [options.name && cv.name, options.email && cv.email].filter(Boolean);
  return (page, total) => {
    const number = options.pageNumber ? (total > 1 ? `${page} / ${total}` : `${page}`) : null;
    const text = [...parts, number].filter(Boolean).join(" · ");
    return text || null;
  };
}
