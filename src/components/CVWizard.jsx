import { useEffect, useMemo, useState } from "react";
import TopNav from "./TopNav";
import StepIndicator, { WIZARD_STEPS } from "./StepIndicator";
import WizardFooter from "./WizardFooter";
import WizardIntro from "./WizardIntro";
import PersonalInfo from "./steps/PersonalInfo";
import CareerGoal from "./steps/CareerGoal";
import Summary from "./steps/Summary";
import Education from "./steps/Education";
import Experience from "./steps/Experience";
import Skills from "./steps/Skills";
import Languages from "./steps/Languages";
import TemplatePage, { makeInitialDesigns } from "./templates/TemplatePage";
import FinalCv from "./FinalCv";
import { buildCvData } from "../lib/cvData";
import { initialFormData, mergeForm } from "../lib/formDefaults";
import { useAuth } from "../context/AuthContext";
import { useCvAutosave } from "../hooks/useCvAutosave";

// La photo du CV est identique pour tous les modèles
function withSharedPhoto(designs, photo) {
  return Object.fromEntries(Object.entries(designs).map(([id, design]) => [id, { ...design, photo }]));
}

// cvId : CV à ouvrir (null = nouveau CV) · onOpenDashboard : retour à « My CVs »
// registerAiApply : permet à l'assistant IA global d'appliquer une suggestion au résumé
export default function CVWizard({ onNavigate, isAuthed, cvId = null, onOpenDashboard, registerAiApply }) {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = intro screen
  const [form, setForm] = useState(initialFormData);
  const [customTitle, setCustomTitle] = useState("");
  const [finished, setFinished] = useState(false);
  const [choosingTemplate, setChoosingTemplate] = useState(false);
  const [templateId, setTemplateId] = useState("modern-focus");
  const [templateName, setTemplateName] = useState("Mercury Flow");
  const [templateDesigns, setTemplateDesigns] = useState({});
  const [everFinished, setEverFinished] = useState(false);
  const { user } = useAuth();

  // Tout ce qui doit être sauvegardé dans la table "cvs"
  const snapshot = {
    templateId,
    status: everFinished ? "complete" : "draft",
    content: { form, templateName, templateDesigns, lastStep: stepIndex, finished, customTitle },
  };

  // Appelée une fois quand un CV existant est lu dans Supabase
  function handleLoaded(row) {
    const content = row.content ?? {};
    setForm(mergeForm(content.form));
    if (row.template_id) setTemplateId(row.template_id);
    if (content.customTitle) setCustomTitle(content.customTitle);
    if (content.templateName) setTemplateName(content.templateName);
    if (content.templateDesigns) setTemplateDesigns(content.templateDesigns);
    setEverFinished(row.status === "complete");
    if (content.finished) setFinished(true); // revient directement sur le CV final
    if (typeof content.lastStep === "number") setStepIndex(content.lastStep); // reprend où l'utilisateur s'est arrêté
  }

  const { loading, loadError, retryLoad, saveStatus, saveNow } = useCvAutosave({
    userId: user.id,
    cvId,
    snapshot,
    onLoaded: handleLoaded,
  });

  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;
  const cvData = useMemo(() => buildCvData(form), [form]);
  const currentDesign = templateDesigns[templateId] ?? makeInitialDesigns()[templateId];

  // section = clé de form ; value = nouvelle valeur ou fonction (état précédent) => nouvel état
  function updateSection(section, value) {
    setForm((f) => ({ ...f, [section]: typeof value === "function" ? value(f[section]) : value }));
  }

  function goTo(index) {
    setStepIndex(Math.max(-1, Math.min(index, WIZARD_STEPS.length - 1)));
  }

  function handleContinue() {
    if (isLastStep) {
      setChoosingTemplate(true);
    } else {
      goTo(stepIndex + 1);
    }
  }

  function handleBack() {
    if (stepIndex === 0) {
      goTo(-1);
    } else {
      goTo(stepIndex - 1);
    }
  }

  // L'assistant IA global peut appliquer son texte au résumé de ce CV
  useEffect(() => {
    if (!registerAiApply) return undefined;
    registerAiApply((text) =>
      setForm((f) => ({ ...f, summary: { ...f.summary, about: text.replace(/(^"|"$)/g, "") } }))
    );
    return () => registerAiApply(null);
  }, [registerAiApply]);

  async function handleOpenDashboard() {
    await saveNow(); // ne rien perdre de la dernière saisie
    onOpenDashboard?.();
  }

  async function handleSaveProgress() {
    const { ok } = await saveNow();
    if (ok) (onOpenDashboard ?? (() => onNavigate("landing")))();
  }

  if (loadError) {
    return (
      <div className="app-shell">
        <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
        <div className="wizard-body">
          <div className="wizard-card" style={{ textAlign: "center" }}>
            <h1>Couldn’t load your CV</h1>
            <p className="subtitle">{loadError}</p>
            <button className="btn btn-primary" type="button" onClick={retryLoad}>
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="app-shell">
        <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
        <div className="wizard-body">
          <p style={{ textAlign: "center" }}>Loading your CV…</p>
        </div>
      </div>
    );
  }

  if (choosingTemplate) {
    return (
      <TemplatePage
        embedded
        onNavigate={onNavigate}
        isAuthed={isAuthed}
        initialSelectedId={templateId}
        initialDesigns={templateDesigns}
        cvData={cvData}
        onBack={() => setChoosingTemplate(false)}
        onConfirm={({ templateId: chosenTemplateId, templateName: chosenTemplateName, design }) => {
          setTemplateId(chosenTemplateId);
          setTemplateName(chosenTemplateName);
          setTemplateDesigns((previous) => withSharedPhoto({ ...previous, [chosenTemplateId]: design }, design.photo));
          setChoosingTemplate(false);
          setFinished(true);
          setEverFinished(true);
        }}
      />
    );
  }

  if (finished) {
    return (
      <FinalCv
        form={form}
        onFormChange={updateSection}
        templateId={templateId}
        design={currentDesign}
        onDesignChange={(design) =>
          setTemplateDesigns((previous) => withSharedPhoto({ ...previous, [templateId]: design }, design.photo))
        }
        onChangeTemplate={() => {
          setFinished(false);
          setChoosingTemplate(true);
        }}
        onBackToQuestionnaire={() => setFinished(false)}
        onOpenDashboard={onOpenDashboard ? handleOpenDashboard : undefined}
        onNavigate={onNavigate}
        isAuthed={isAuthed}
        saveStatus={saveStatus}
      />
    );
  }

  if (stepIndex === -1) {
    return (
      <div className="app-shell">
        <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
        <WizardIntro onStart={() => goTo(0)} onNavigate={onNavigate} />
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
      <div className="wizard">
        <StepIndicator currentIndex={stepIndex} onStepClick={goTo} />
        <div className="wizard-body">
          <div className="wizard-card">
            {stepIndex === 0 && (
              <PersonalInfo
                data={form.personalInfo}
                // v peut être un objet, ou une fonction (état précédent) => nouvel état
                onChange={(v) =>
                  setForm((f) => ({ ...f, personalInfo: typeof v === "function" ? v(f.personalInfo) : v }))
                }
              />
            )}
            {stepIndex === 1 && (
              <CareerGoal data={form.careerGoal} onChange={(v) => setForm((f) => ({ ...f, careerGoal: v }))} />
            )}
            {stepIndex === 2 && (
              <Summary data={form.summary} onChange={(v) => setForm((f) => ({ ...f, summary: v }))} />
            )}
            {stepIndex === 3 && (
              <Education entries={form.education} onChange={(v) => setForm((f) => ({ ...f, education: v }))} />
            )}
            {stepIndex === 4 && (
              <Experience
                experienceType={form.experienceType}
                onExperienceTypeChange={(v) => setForm((f) => ({ ...f, experienceType: v }))}
                entries={form.experience}
                onChange={(v) => setForm((f) => ({ ...f, experience: v }))}
              />
            )}
            {stepIndex === 5 && <Skills data={form.skills} onChange={(v) => setForm((f) => ({ ...f, skills: v }))} />}
            {stepIndex === 6 && (
              <Languages data={form.languages} onChange={(v) => setForm((f) => ({ ...f, languages: v }))} />
            )}
          </div>
        </div>
        <WizardFooter
          onBack={handleBack}
          onSave={handleSaveProgress}
          saveStatus={saveStatus}
          onSkip={!isLastStep ? () => handleContinue() : undefined}
          onContinue={handleContinue}
          continueLabel={isLastStep ? "Choose a template" : "Continue"}
        />
      </div>

    </div>
  );
}
