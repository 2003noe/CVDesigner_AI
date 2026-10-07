import { useState } from "react";
import TopNav from "./TopNav";
import { useAuth } from "../context/AuthContext";

function passwordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
}

const STRENGTH_LABELS = ["Too short", "Weak", "Fair", "Good", "Strong"];

export default function SignUp({ onNavigate }) {
  const { signUp, signInWithOAuth } = useAuth();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [agreed, setAgreed] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [checkEmail, setCheckEmail] = useState(false);

  const strength = passwordStrength(password);
  const passwordsMatch = confirmPassword.length === 0 || confirmPassword === password;

  async function handleSubmit(e) {
    e.preventDefault();
    if (!agreed || !passwordsMatch) return;
    if (password.length < 8) {
      setError("Password must be at least 8 characters.");
      return;
    }
    setError("");
    setLoading(true);
    const { data, error } = await signUp({ fullName, email, password });
    setLoading(false);

    if (error) {
      setError(error.message);
      return;
    }
    // Email déjà utilisé : Supabase ne renvoie pas d'erreur (anti-énumération),
    // mais "identities" est vide.
    if (data.user && data.user.identities?.length === 0) {
      setError("An account with this email already exists. Try signing in.");
      return;
    }
    // Confirmation d'email activée : pas encore de session -> on demande de vérifier la boîte mail.
    if (!data.session) setCheckEmail(true);
    // Sinon : session créée, App.jsx redirige vers le wizard.
  }

  async function handleOAuth(provider) {
    setError("");
    const { error } = await signInWithOAuth(provider);
    if (error) setError(error.message);
  }

  if (checkEmail) {
    return (
      <div className="app-shell">
        <TopNav onNavigate={onNavigate} />
        <div className="auth-wrap">
          <div className="auth-card">
            <h1>Check your email</h1>
            <p className="subtitle">
              We sent a confirmation link to <strong>{email}</strong>. Click it to activate your
              account, then sign in.
            </p>
            <button className="btn btn-primary btn-full" type="button" onClick={() => onNavigate("signin")}>
              Go to sign in
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="app-shell">
      <TopNav onNavigate={onNavigate} />
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Create your account</h1>
          <p className="subtitle">Start building your professional CV today</p>

          {error && <div className="auth-alert error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="signup-name">Full Name</label>
              <input
                id="signup-name"
                autoComplete="name"
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
                autoComplete="email"
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
                autoComplete="new-password"
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
                autoComplete="new-password"
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

            <button className="btn btn-primary btn-full" type="submit" disabled={!agreed || !passwordsMatch || loading}>
              {loading ? "Creating account…" : "Create account"}
            </button>
          </form>

          <div className="auth-divider">or continue with</div>
          <div className="oauth-row">
            <button className="btn btn-secondary" type="button" onClick={() => handleOAuth("google")}>
              ⓖ Google
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => handleOAuth("linkedin_oidc")}>
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
