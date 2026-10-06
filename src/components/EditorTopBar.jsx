import BrandMark from "./BrandMark";

export default function EditorTopBar({ onNavigate, userName = "John Doe", onSave }) {
  return (
    <header className="editor-topbar">
      <BrandMark onClick={() => onNavigate("landing")} />
      <nav className="topnav-links">
        <button type="button" onClick={() => onNavigate("templates")}>Templates</button>
        <button type="button">AI Features</button>
        <button type="button">Pricing</button>
        <button type="button">Success Stories</button>
      </nav>
      <div className="editor-user">
        <span>{userName}</span>
        <button className="btn btn-primary" type="button" onClick={onSave}>
          Save
        </button>
      </div>
    </header>
  );
}
