const SAVE_LABELS = {
  dirty: "Unsaved changes…",
  saving: "Saving…",
  saved: "All changes saved",
  error: "Couldn’t save — check your connection",
};

export default function WizardFooter({
  onBack,
  onSave,
  onSkip,
  onContinue,
  continueLabel = "Continue",
  showBack = true,
  saveStatus = "idle",
}) {
  const saveLabel = SAVE_LABELS[saveStatus];

  return (
    <footer className="wizard-footer">
      <div className="wizard-footer-left">
        {showBack && (
          <button className="btn btn-secondary" type="button" onClick={onBack}>
            Back
          </button>
        )}
        <button className="link-btn" type="button" onClick={onSave}>
          Save progress
        </button>
        {saveLabel && (
          <span
            role="status"
            style={{
              fontSize: 13,
              color: saveStatus === "error" ? "var(--color-danger)" : "inherit",
              opacity: saveStatus === "error" ? 1 : 0.65,
            }}
          >
            {saveLabel}
          </span>
        )}
      </div>
      <div className="wizard-footer-left">
        {onSkip && (
          <button className="link-btn" type="button" onClick={onSkip}>
            Skip optional fields
          </button>
        )}
        <button className="btn btn-primary" type="button" onClick={onContinue}>
          {continueLabel}
        </button>
      </div>
    </footer>
  );
}
