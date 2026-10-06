export default function BrandMark({ onClick, variant = "default" }) {
  return (
    <button
      className={`topnav-brand ${variant === "light" ? "topnav-brand-light" : ""}`}
      onClick={onClick}
      type="button"
    >
      <span className="brand-mark">✦</span>
      CVDesigner <span className="brand-ai">AI</span>
    </button>
  );
}
