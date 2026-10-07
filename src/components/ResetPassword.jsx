import { useState } from "react";
import TopNav from "./TopNav";
import { useAuth } from "../context/AuthContext";

export default function ResetPassword({ onNavigate }) {
  const { updatePassword, finishRecovery } = useAuth();
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e) {
    e.preventDefault();
    if (password.length < 8) return setError("Password must be at least 8 characters.");
    if (password !== confirm) return setError("Passwords don’t match.");
    setError("");
    setLoading(true);
    const { error } = await updatePassword(password);
    setLoading(false);
    if (error) return setError(error.message);
    finishRecovery();
    onNavigate("wizard");
  }

  return (
    <div className="app-shell">
      <TopNav onNavigate={onNavigate} />
      <div className="auth-wrap">
        <div className="auth-card">
          <h1>Choose a new password</h1>
          <p className="subtitle">Enter a new password for your account</p>

          {error && <div className="auth-alert error" role="alert">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="field">
              <label htmlFor="reset-password">New password</label>
              <input id="reset-password" type="password" autoComplete="new-password"
                value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            <div className="field">
              <label htmlFor="reset-confirm">Confirm new password</label>
              <input id="reset-confirm" type="password" autoComplete="new-password"
                value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
            </div>
            <button className="btn btn-primary btn-full" type="submit" disabled={loading}>
              {loading ? "Saving…" : "Save new password"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
