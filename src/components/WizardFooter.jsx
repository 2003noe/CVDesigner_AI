export default function WizardFooter({
  onBack,
  onSave,
  onSkip,
  onContinue,
  continueLabel = "Continue",
  showBack = true,
}) {
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
