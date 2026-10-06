import BrandMark from "./BrandMark";

export default function TopNav({ onNavigate, isAuthed }) {
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
        {!isAuthed && (
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
