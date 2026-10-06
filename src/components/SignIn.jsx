import { useState } from "react";
import TopNav from "./TopNav";

export default function SignIn({ onNavigate, onSignedIn }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  function handleSubmit(e) {
    e.preventDefault();
    onSignedIn({ email });
  }

  return (
    <div className="app-shell">
      <TopNav onNavigate={onNavigate} />
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Welcome back</h1>
          <p className="subtitle">Sign in to continue building your CV</p>

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="signin-email">Email Address</label>
              <input
                id="signin-email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="field">
              <div className="auth-forgot">
                <label htmlFor="signin-password">Password</label>
                <a href="#forgot-password" onClick={(e) => e.preventDefault()}>
                  Forgot password?
                </a>
              </div>
              <div className="password-input-wrap">
                <input
                  id="signin-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <button type="button" onClick={() => setShowPassword((s) => !s)} aria-label="Toggle password visibility">
                  {showPassword ? "🙈" : "👁"}
                </button>
              </div>
            </div>

            <button className="btn btn-primary btn-full" type="submit">
              Sign in
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
