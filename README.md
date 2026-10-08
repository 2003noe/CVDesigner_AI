# CVDesigner AI — React front-end

Front-end React (Vite) recréant les écrans de votre maquette CVDesigner AI :
page d'accueil, connexion / inscription, import de CV, et l'assistant guidé
en 7 étapes (Infos personnelles → Objectif de carrière → Résumé → Formation →
Expérience → Compétences → Langues).

## Structure

```
src/
  App.jsx                 # navigation entre les écrans (landing, auth, import, wizard)
  App.css                 # tous les styles (couleurs, cartes, formulaires...)
  components/
    LandingPage.jsx
    SignIn.jsx
    SignUp.jsx
    ImportFlow.jsx          # orchestre le parcours d'import : Import → Validate → Review → Template → Generate → Edit → Export
    EditorTopBar.jsx        # barre du haut affichée sur Edit/Export (nom + bouton Save au lieu de Sign In)
    import-flow/
      ImportStep.jsx        # dépôt du fichier + écran "Your CV has been extracted"
      ValidateStep.jsx      # champs éditables avec scores de confiance et alertes
      ReviewStep.jsx        # récapitulatif de toutes les sections avec bouton Edit
      TemplateStep.jsx      # grille de 8 modèles filtrable + recherche
      GenerateStep.jsx      # aperçu du CV généré, score ATS, suggestions IA
      EditStep.jsx          # éditeur 3 colonnes (sections / aperçu / assistant IA)
      ExportStep.jsx        # réglages d'export et téléchargement du PDF
    CVWizard.jsx           # orchestre les 7 étapes + indicateur + footer
    WizardIntro.jsx        # écran "Let's create your professional CV"
    StepIndicator.jsx
    WizardFooter.jsx
    TopNav.jsx / BrandMark.jsx
    TagInput.jsx           # champ de tags réutilisable (coursework, skills, interests)
    AIPanel.jsx            # panneau assistant IA flottant (étape Résumé)
    steps/
      PersonalInfo.jsx
      CareerGoal.jsx
      Summary.jsx
      Education.jsx
      Experience.jsx
      Skills.jsx
      Languages.jsx
```

## Lancer le projet

```bash
npm install
npm run dev
```

Puis ouvrez l'URL indiquée (en général http://localhost:5173).

## Notes

- Aucune librairie UI externe : uniquement du CSS simple dans `App.css`, facile
  à adapter si vous utilisez déjà Tailwind ou une autre stack.
- La navigation entre écrans est gérée par un simple état React dans `App.jsx`
  (pas de react-router) — à remplacer par votre routeur si le projet grandit.
- Toutes les données du formulaire sont conservées en mémoire (`useState`) dans
  `CVWizard.jsx` ; il n'y a pas encore d'appel API réel (upload de CV, envoi à
  une IA, génération de PDF) — ce sont des simulations à brancher sur votre
  backend.

## Mises à jour récentes

- **Correctif** : le logo "CVDesigner AI" était invisible sur la page d'accueil
  (texte sombre sur fond sombre). `BrandMark` accepte maintenant une prop
  `variant="light"` utilisée sur le fond sombre de `LandingPage`.
- **Nouveau** : le parcours "Importer un CV existant" est désormais un flux
  complet à 7 étapes (`ImportFlow.jsx`) : Import → Validate → Review →
  Template → Generate → Edit → Export, avec son propre indicateur d'étapes
  (`IMPORT_STEPS` dans `StepIndicator.jsx`, désormais générique via la prop
  `steps`).


## Template library

The CV template experience now includes 12 editable React/CSS designs: Atlantic Blue, Mercury Flow, Steady Form, Classic Serif, Leaves, Executive, Nova Minimal, Horizon, Monochrome, Corporate Pro, Creative Edge and Tech Focus. The gallery supports filtering, search, sorting, live previews, template customization, typography, spacing, page size, accent colors and optional profile photos.

`node_modules` and the previous build output are intentionally excluded from the project archive. Run `npm install` before starting the project.

## Du questionnaire au CV final (PDF)

- `lib/cvData.js` : `buildCvData(form)` convertit les réponses du questionnaire en données affichées par les
  modèles. Tant que le questionnaire est vide, les modèles montrent `SAMPLE_CV` (John Doe).
- `templates/TemplatePage.jsx` : la galerie et l'éditeur de modèle affichent les vraies informations de
  l'utilisateur ; les sections vides sont masquées.
- **Photo** : deux endroits, tous deux avec cadrage (`PhotoCropper.jsx` : déplacer + zoomer, sortie carrée 600 px).
  1) la page « Personal Information » du questionnaire : la photo cadrée est enregistrée dans la base avec le CV
     (`content.form.personalInfo.photo`, pas de Supabase Storage) ;
  2) « Customize template » / page finale : remplace la photo pour ce CV (`design.photo`). Sans choix, le CV
     reprend la photo du questionnaire ; « Remove » (`design.photo = false`) retire la photo du CV.
- **Taille du texte** : curseur « Text size » (70–140 %) dans « Customize template » et sur la page finale
  (`design.fontScale`). Les règles de police des modèles utilisent `var(--resume-font-scale)` ; la page garde sa taille.
- **Robustesse** : `buildCvData` normalise toutes les données (compétences `{ name, level }`, tags, listes absentes…)
  et `ErrorBoundary.jsx` affiche un message avec un bouton « Reload » au lieu d'une page blanche en cas d'erreur.
- `FinalCv.jsx` : page finale — CV sur le modèle choisi, panneau d'édition (réutilise les 7 étapes), photo,
  police, couleur, bouton **Download PDF**.
- **PDF** (`lib/pdf.js`) : généré directement (html2canvas-pro + jsPDF, chargés à la demande). Le CV remplit toute la
  page A4, sans marge ni en-tête de navigateur ; un CV long est découpé sur plusieurs pages. Une couche de texte
  invisible garde le texte sélectionnable et lisible par les ATS.

## Plusieurs CV (« My CVs ») et éditeur

- `components/Dashboard.jsx` : liste des CV (miniature, statut, date, filtres). La **première carte est un CV vierge « + »** qui
  ouvre l'éditeur ; « Prefer questions? » ouvre l'ancien questionnaire guidé (`CVWizard`), conservé en option.
- `components/editor/CvEditor.jsx` : l'éditeur — barre du haut (retour, nom du CV, état de sauvegarde, annuler/rétablir,
  Download PDF), **barre verticale défilante** (Content : infos, résumé, expérience, formation, compétences, langues ·
  Design : document, modèles, mise en page, taille du texte, espacement, entrées, titres, police, couleurs, en-tête, photo,
  pied de page, sections), panneaux de réglages (`EditorPanels.jsx`) et page A4 en direct.
- **Modification sur la page** : nom, titre, résumé, poste et entreprise se tapent directement sur le CV
  (`Editable.jsx`) ; un clic sur un autre texte ouvre le panneau correspondant. Tant que le CV est vide, `EmptySheet.jsx`
  affiche la page vierge ; la première lettre tapée fait apparaître le vrai modèle.
- **Réglages de design** (`lib/editorDesign.js`) : stockés dans `content.design` (et recopiés dans
  `content.templateDesigns[<modèle>]` pour la compatibilité). Ils s'appliquent aux 20 modèles par variables CSS et attributs
  `data-*` (fin de `App.css`). `null` = valeur propre au modèle. Langue du CV : `lib/cvLabels.js`.
- `lib/cvs.js` : accès à la table `cvs` (une ligne par CV). `hooks/useCvAutosave.js` ouvre un CV par son `id` ; un nouveau CV
  n'est créé en base qu'à sa première modification. Le nom choisi est dans `content.customTitle`.
- **Suppression** : la table `cvs` doit autoriser le DELETE à son propriétaire. Si la suppression est refusée, exécuter
  dans l'éditeur SQL de Supabase :

```sql
drop policy if exists "Users can delete their own cvs" on public.cvs;
create policy "Users can delete their own cvs"
  on public.cvs for delete
  using (auth.uid() = user_id);
```

## Assistant IA

`AIPanel` est monté dans `App.jsx` : le bouton ✦ AI est visible sur toutes les pages. Les réponses restent simulées
(pas encore de backend IA). Dans l'éditeur ou le questionnaire, « Apply to my CV » écrit le texte dans le résumé.
