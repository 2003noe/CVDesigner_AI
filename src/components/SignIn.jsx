import { useState } from "react";
import TopNav from "./TopNav";
import { useAuth } from "../context/AuthContext";

export default function SignIn({ onNavigate }) {
  const { signIn, signInWithOAuth, resetPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    setLoading(true);
    const { error } = await signIn({ email, password });
    setLoading(false);
    if (error) {
      setError(
        error.message === "Invalid login credentials"
          ? "Incorrect email or password."
          : error.message
      );
    }
    // Succès : AuthContext met la session à jour, App.jsx redirige vers le wizard.
  }

  async function handleForgotPassword(e) {
    e.preventDefault();
    setError("");
    setInfo("");
    if (!email) {
      setError("Enter your email address above first, then click “Forgot password?”.");
      return;
    }
    const { error } = await resetPassword(email);
    if (error) setError(error.message);
    else setInfo("If an account exists for this email, a reset link has been sent.");
  }

  async function handleOAuth(provider) {
    setError("");
    const { error } = await signInWithOAuth(provider);
    if (error) setError(error.message);
  }

  return (
    <div className="app-shell">
      <TopNav onNavigate={onNavigate} />
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to continue building your CV</p>

          {error && <div className="auth-alert error" role="alert">{error}</div>}
          {info && <div className="auth-alert success">{info}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="signin-email">Email Address</label>
              <input
                id="signin-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <div className="auth-forgot">
                <label htmlFor="signin-password">Password</label>
                <a href="#forgot-password" onClick={handleForgotPassword}>
                  Forgot password?
                </a>
              </div>
              <div className="password-input-wrap">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? "Signing in…" : "Sign in"}
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
            Don&rsquo;t have an account?{" "}
            <button className="auth-link" type="button" onClick={() => onNavigate("signup")}>
              Sign up
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
