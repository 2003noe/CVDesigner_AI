// Identité de chaque modèle : style, photo ou non, et affichage de l'âge.
// Le contenu du CV n'appartient jamais au modèle : le modèle ne fait que le présenter.
export const TEMPLATE_STYLES = ["Professional", "Modern", "Executive", "Creative", "Minimal", "Academic", "Elegant", "Compact"];

// photo : le modèle prévoit une photo (false = il n'en affiche jamais, sans laisser d'espace vide)
// showAge : le modèle affiche l'âge dans ses coordonnées (l'âge est toujours conservé dans les données)
// featured : les 4 modèles montrés d'abord, avant « More templates »
export const TEMPLATE_META = {
  "corporate-pro": { style: "Professional", photo: false, showAge: false, featured: 1, pitch: "Sober and corporate. Clear headings, no photo." },
  "classic-serif": { style: "Professional", photo: false, showAge: false, pitch: "Serif typography and a traditional structure." },
  "steady-form": { style: "Professional", photo: false, showAge: false, pitch: "A steady single column with a core competencies block." },
  "herrera-sales": { style: "Professional", photo: true, showAge: false, pitch: "Header with photo, built for sales and business profiles." },
  "modern-focus": { style: "Modern", photo: false, showAge: false, featured: 2, pitch: "Clean hierarchy with a bold name and accent line." },
  horizon: { style: "Modern", photo: false, showAge: false, pitch: "A light layout with a horizon rule and airy spacing." },
  "andrade-blue": { style: "Modern", photo: true, showAge: true, pitch: "Round photo, coloured sidebar and soft highlighted entries." },
  executive: { style: "Executive", photo: true, showAge: true, featured: 3, pitch: "Premium look for experienced profiles, with an opening profile." },
  "atlantic-blue": { style: "Executive", photo: true, showAge: true, pitch: "Confident two-column layout with a deep sidebar." },
  "feig-noir": { style: "Executive", photo: true, showAge: true, pitch: "Dark and elegant, with a large portrait." },
  "creative-edge": { style: "Creative", photo: true, showAge: true, featured: 4, pitch: "A bold coloured side column, still professional." },
  "takahashi-brown": { style: "Creative", photo: true, showAge: true, pitch: "Warm header, skill bars and a rounded photo." },
  "marchesi-editorial": { style: "Creative", photo: true, showAge: false, pitch: "Editorial layout with a vertical name." },
  leaves: { style: "Creative", photo: true, showAge: false, pitch: "A fresh side strip with a soft secondary column." },
  "nova-minimal": { style: "Minimal", photo: false, showAge: false, pitch: "Lots of white space and a short intro." },
  "paterson-minimal": { style: "Minimal", photo: true, showAge: false, pitch: "Understated sidebar with a clean portrait." },
  "monochrome-ats": { style: "Minimal", photo: false, showAge: false, pitch: "Black and white, simple structure that ATS software reads well." },
  "kaya-graduate": { style: "Academic", photo: false, showAge: true, pitch: "For students and researchers: education first, certificates." },
  "parvati-classic": { style: "Elegant", photo: false, showAge: false, pitch: "Centred name and refined, classic proportions." },
  "tech-focus": { style: "Compact", photo: false, showAge: false, pitch: "Dense but readable: fits a lot on one page." },
};

export const FEATURED_IDS = Object.entries(TEMPLATE_META)
  .filter(([, meta]) => meta.featured)
  .sort((a, b) => a[1].featured - b[1].featured)
  .map(([id]) => id);
