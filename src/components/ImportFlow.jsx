import { useState } from "react";
import TopNav from "./TopNav";
import EditorTopBar from "./EditorTopBar";
import StepIndicator, { IMPORT_STEPS } from "./StepIndicator";
import WizardFooter from "./WizardFooter";
import TemplatePage from "./templates/TemplatePage";
import ImportStep from "./import-flow/ImportStep";
import ValidateStep, { initialValidateData } from "./import-flow/ValidateStep";
import ReviewStep from "./import-flow/ReviewStep";
import { DEFAULT_TEMPLATE_ID } from "./import-flow/TemplateStep";
import GenerateStep from "./import-flow/GenerateStep";
import EditStep from "./import-flow/EditStep";
import ExportStep from "./import-flow/ExportStep";

const STEP_KEYS = IMPORT_STEPS.map((s) => s.key); // import, validate, review, template, generate, edit, export

export default function ImportFlow({ onNavigate, onBack }) {
  const [stepIndex, setStepIndex] = useState(0);
  const [validateData, setValidateData] = useState(initialValidateData);
  const [templateId, setTemplateId] = useState(DEFAULT_TEMPLATE_ID);
  const [templateName, setTemplateName] = useState("Modern Focus");
  const [templateDesigns, setTemplateDesigns] = useState({});

  const currentKey = STEP_KEYS[stepIndex];
  const isEditorStep = currentKey === "edit" || currentKey === "export";

  function goTo(index) {
    setStepIndex(Math.max(0, Math.min(index, STEP_KEYS.length - 1)));
  }

  function next() {
    goTo(stepIndex + 1);
  }

  function back() {
    if (stepIndex === 0) {
      onBack ? onBack() : onNavigate("landing");
    } else {
      goTo(stepIndex - 1);
    }
  }

  const CONTINUE_LABELS = {
    validate: "Confirm & review answers",
    review: "Choose a template",
    template: "Generate my CV",
    generate: "Open full editor",
  };

  if (currentKey === "template") {
    return (
      <TemplatePage
        embedded
        initialSelectedId={templateId}
        initialDesigns={templateDesigns}
        onBack={() => goTo(2)}
        onConfirm={({ templateId: chosenTemplateId, templateName: chosenTemplateName, design }) => {
          setTemplateId(chosenTemplateId);
          setTemplateName(chosenTemplateName);
          setTemplateDesigns((previous) => ({ ...previous, [chosenTemplateId]: design }));
          goTo(4);
        }}
      />
    );
  }

  return (
    <div className="app-shell">
      {isEditorStep ? (
        <EditorTopBar onNavigate={onNavigate} onSave={() => {}} />
      ) : (
        <TopNav onNavigate={onNavigate} />
      )}

      <div className="wizard">
        <StepIndicator steps={IMPORT_STEPS} currentIndex={stepIndex} onStepClick={goTo} />

        {currentKey === "edit" ? (
          <EditStep onPreview={() => {}} onExportPdf={next} />
        ) : (
          <div className="wizard-body" style={{ maxWidth: 1100, margin: "0 auto", width: "100%", flexDirection: "column" }}>
            <div style={{ width: "100%", maxWidth: 1080 }}>
              {currentKey === "import" && <ImportStep onContinue={next} />}
              {currentKey === "validate" && <ValidateStep data={validateData} onChange={setValidateData} />}
              {currentKey === "review" && <ReviewStep onEditSection={() => goTo(1)} />}
              {currentKey === "generate" && (
                <GenerateStep templateName={templateName} onOpenEditor={() => goTo(5)} />
              )}
              {currentKey === "export" && <ExportStep onBackToEditor={() => goTo(5)} />}
            </div>
          </div>
        )}

        {!isEditorStep && currentKey !== "import" && (
          <WizardFooter
            onBack={back}
            onSave={() => onNavigate("landing")}
            onContinue={next}
            continueLabel={CONTINUE_LABELS[currentKey] || "Continue"}
          />
        )}
      </div>
    </div>
  );
}
