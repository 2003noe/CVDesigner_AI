import { useState } from "react";
import TopNav from "./TopNav";

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

export default function SignUp({ onNavigate, onSignedUp }) {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(true);

  const strength = passwordStrength(password);
  const passwordsMatch = confirmPassword.length === 0 || confirmPassword === password;

  function handleSubmit(e) {
    e.preventDefault();
    if (!agreed || !passwordsMatch) return;
    onSignedUp({ fullName, email });
  }

  return (
    <div className="app-shell">
      <TopNav onNavigate={onNavigate} />
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="subtitle">Start building your professional CV today</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="signup-email">Email Address</label>
              <input
                id="signup-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <label htmlFor="signup-password">Password</label>
              <input
                id="signup-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              {password && (
                <>
                  <div className="password-strength">
                    {[0, 1, 2, 3].map((i) => (
                      <span key={i} className={`bar ${i < strength ? "filled" : ""}`} />
                    ))}
                  </div>
                  <div className="password-strength-label">{STRENGTH_LABELS[strength]}</div>
                </>
              )}
            </div>

            <div className="field">
              <label htmlFor="signup-confirm">Confirm Password</label>
              <input
                id="signup-confirm"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              {!passwordsMatch && <div className="hint" style={{ color: "var(--color-danger)" }}>Passwords don&rsquo;t match</div>}
            </div>

            <label className="checkbox-line">
              <input type="checkbox" checked={agreed} onChange={(e) => setAgreed(e.target.checked)} />
              I agree to the <a href="#terms" onClick={(e) => e.preventDefault()}>Terms of Service</a> and{" "}
              <a href="#privacy" onClick={(e) => e.preventDefault()}>Privacy Policy</a>
            </label>

            <button className="btn btn-primary btn-full" type="submit" disabled={!agreed || !passwordsMatch}>
              Create account
            </button>
          </form>

          <div className="auth-divider">or continue with</div>
          <div className="oauth-row">
            <button className="btn btn-secondary" type="button">
              ⓖ Google
            </button>
            <button className="btn btn-secondary" type="button">
              in LinkedIn
            </button>
          </div>

          <p className="auth-footer">
            Already have an account?{" "}
            <button className="auth-link" type="button" onClick={() => onNavigate("signin")}>
              Sign in
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
