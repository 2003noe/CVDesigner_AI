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

- `lib/cvData.js` : `buildCvData(form)` convertit les réponses du questionnaire (toutes les étapes) en données
  affichées par les modèles. Tant que le questionnaire est vide, les modèles montrent `SAMPLE_CV` (John Doe).
- `templates/TemplatePage.jsx` : la galerie et l'éditeur de modèle (« Customize ») affichent désormais les vraies
  informations de l'utilisateur. Les sections vides sont masquées.
- **Photo** : le CV n'utilise que la photo ajoutée via **Add photo** dans l'éditeur de modèle (`design.photo`,
  réduite à 600 px par `lib/image.js`). Elle est partagée entre tous les modèles. La photo de l'étape
  « Personal Information » reste stockée dans Supabase Storage mais n'apparaît pas sur le CV.
- `FinalCv.jsx` : page finale — CV sur le modèle choisi, bouton **Download PDF**, et panneau d'édition qui
  réutilise les 7 étapes du questionnaire (modifier / ajouter des informations, changer photo, police, couleur).
- **PDF** : `window.print()` + règles `@media print` / `@page` (A5) dans `final-cv.css`. Dans la fenêtre
  d'impression, choisir « Enregistrer au format PDF » (marges : aucune). Le texte du PDF reste sélectionnable.
- Tout est sauvegardé automatiquement dans `cvs.content` (`form`, `templateDesigns`, `finished`) ; en rouvrant le
  CV terminé, l'utilisateur revient directement sur la page finale.
