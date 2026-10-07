import BrandMark from "./BrandMark";
import { useAuth } from "../context/AuthContext";

export default function TopNav({ onNavigate, isAuthed }) {
  const { user, signOut } = useAuth();
  const authed = isAuthed ?? Boolean(user);

  async function handleSignOut() {
    onNavigate("landing"); // d'abord quitter la page protégée...
    await signOut();       // ...puis se déconnecter
  }

  return (
    <header className="topnav">
      <BrandMark onClick={() => onNavigate("landing")} />
      <nav className="topnav-links">
        <button type="button" onClick={() => onNavigate("templates")}>Templates</button>
        <button type="button">AI Features</button>
        <button type="button">Pricing</button>
        <button type="button">Success Stories</button>
      </nav>
      <div className="topnav-actions">
        {authed ? (
          <button className="link-btn" type="button" onClick={handleSignOut}>
            Sign out
          </button>
        ) : (
          <button className="link-btn" type="button" onClick={() => onNavigate("signin")}>
            Sign In
          </button>
        )}
        <button className="btn btn-primary" type="button" onClick={() => onNavigate("wizard")}>
          Create my CV
        </button>
      </div>
    </header>
  );
}
