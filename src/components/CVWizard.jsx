import { useState } from "react";
import TopNav from "./TopNav";
import StepIndicator, { WIZARD_STEPS } from "./StepIndicator";
import WizardFooter from "./WizardFooter";
import WizardIntro from "./WizardIntro";
import AIPanel from "./AIPanel";
import PersonalInfo, { emptyPersonalInfo } from "./steps/PersonalInfo";
import CareerGoal, { emptyCareerGoal } from "./steps/CareerGoal";
import Summary, { emptySummary } from "./steps/Summary";
import Education, { emptyEducationEntries } from "./steps/Education";
import Experience, { emptyExperienceEntries } from "./steps/Experience";
import Skills, { emptySkills } from "./steps/Skills";
import Languages, { emptyLanguagesData } from "./steps/Languages";
import TemplatePage from "./templates/TemplatePage";
import { useAuth } from "../context/AuthContext";
import { useCvAutosave } from "../hooks/useCvAutosave";

function initialFormData() {
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

export default function CVWizard({ onNavigate, isAuthed }) {
  const [stepIndex, setStepIndex] = useState(-1); // -1 = intro screen
  const [form, setForm] = useState(initialFormData);
  const [aiPanelOpen, setAiPanelOpen] = useState(false);
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
    content: { form, templateName, templateDesigns, lastStep: stepIndex },
  };

  // Appelée une fois quand un CV existant est lu dans Supabase
  function handleLoaded(row) {
    const content = row.content ?? {};
    const saved = content.form ?? {};
    const defaults = initialFormData();
    setForm(
      Object.fromEntries(Object.entries(defaults).map(([key, value]) => [key, mergeSection(value, saved[key])]))
    );
    if (row.template_id) setTemplateId(row.template_id);
    if (content.templateName) setTemplateName(content.templateName);
    if (content.templateDesigns) setTemplateDesigns(content.templateDesigns);
    setEverFinished(row.status === "complete");
    if (typeof content.lastStep === "number") setStepIndex(content.lastStep); // reprend où l'utilisateur s'est arrêté
  }

  const { loading, loadError, retryLoad, saveStatus, saveNow } = useCvAutosave({
    userId: user.id,
    snapshot,
    onLoaded: handleLoaded,
  });

  const isLastStep = stepIndex === WIZARD_STEPS.length - 1;

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

  async function handleSaveProgress() {
    const { ok } = await saveNow();
    if (ok) onNavigate("landing");
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
        onBack={() => setChoosingTemplate(false)}
        onConfirm={({ templateId: chosenTemplateId, templateName: chosenTemplateName, design }) => {
          setTemplateId(chosenTemplateId);
          setTemplateName(chosenTemplateName);
          setTemplateDesigns((previous) => ({ ...previous, [chosenTemplateId]: design }));
          setChoosingTemplate(false);
          setFinished(true);
          setEverFinished(true);
        }}
      />
    );
  }

  if (finished) {
    return (
      <div className="app-shell">
        <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
        <div className="wizard-body">
          <div className="wizard-card" style={{ textAlign: "center" }}>
            <h1>Your CV is ready 🎉</h1>
            <p className="subtitle">
              We&rsquo;ve prepared {form.personalInfo.fullName || "your"} CV using the {templateName} design.
            </p>
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button
                className="btn btn-secondary"
                type="button"
                onClick={() => {
                  setFinished(false);
                  setChoosingTemplate(true);
                }}
              >
                Change template
              </button>
              <button className="btn btn-secondary" type="button" onClick={() => setFinished(false)}>
                Keep editing
              </button>
              <button className="btn btn-primary" type="button" onClick={() => onNavigate("landing")}>
                Back to home
              </button>
            </div>
          </div>
        </div>
      </div>
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

      {stepIndex === 2 && (
        <AIPanel
          open={aiPanelOpen}
          onToggle={() => setAiPanelOpen((o) => !o)}
          onApplySuggestion={(text) =>
            setForm((f) => ({ ...f, summary: { ...f.summary, about: text.replace(/(^"|"$)/g, "") } }))
          }
        />
      )}
    </div>
  );
}
