export const WIZARD_STEPS = [
  { key: "personalInfo", label: "Personal Info" },
  { key: "careerGoal", label: "Career Goal" },
  { key: "summary", label: "Summary" },
  { key: "education", label: "Education" },
  { key: "experience", label: "Experience" },
  { key: "skills", label: "Skills" },
  { key: "languages", label: "Languages" },
];

export const IMPORT_STEPS = [
  { key: "import", label: "Import" },
  { key: "validate", label: "Validate" },
  { key: "review", label: "Review" },
  { key: "template", label: "Template" },
  { key: "generate", label: "Generate" },
  { key: "edit", label: "Edit" },
  { key: "export", label: "Export" },
];

export default function StepIndicator({
  currentIndex,
  onStepClick,
  steps = WIZARD_STEPS,
  interactive = true,
}) {
  return (
    <div className="stepper">
      {steps.map((step, i) => {
        const state = i < currentIndex ? "done" : i === currentIndex ? "active" : "";
        const canNavigate = interactive && i <= currentIndex && Boolean(onStepClick);
        return (
          <div className="step-item-wrap" key={step.key} style={{ display: "flex", alignItems: "center" }}>
            <div
              className={`step-item ${state}`}
              onClick={canNavigate ? () => onStepClick(i) : undefined}
              style={{ cursor: canNavigate ? "pointer" : "default" }}
            >
              <span className="step-circle">{state === "done" ? "✓" : i + 1}</span>
              <span className="step-label">{step.label}</span>
            </div>
            {i < steps.length - 1 && (
              <span className={`step-divider ${i < currentIndex ? "done" : ""}`} />
            )}
          </div>
        );
      })}
    </div>
  );
}
