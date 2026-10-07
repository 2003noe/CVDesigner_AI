import { useMemo, useState } from "react";

const FILTERS = ["All templates", "Professional", "Modern", "Creative", "ATS-friendly"];

const TEMPLATES = [
  { id: "modern-focus", name: "Mercury Flow", tag: "Clean", category: "Modern", accent: true },
  { id: "executive", name: "Executive", tag: "Professional", category: "Professional" },
  { id: "minimal-grid", name: "Minimal Grid", tag: "Minimal", category: "Modern" },
  { id: "creative-edge", name: "Creative Edge", tag: "Creative", category: "Creative" },
  { id: "classic-serif", name: "Classic Serif", tag: "Professional", category: "Professional" },
  { id: "compact-ats", name: "Compact ATS", tag: "ATS-friendly", category: "ATS-friendly" },
  { id: "bold-sidebar", name: "Bold Sidebar", tag: "Creative", category: "Creative" },
  { id: "graduate", name: "Graduate", tag: "Entry level", category: "Professional" },
];

function TemplateThumb({ accent }) {
  return (
    <div className={`template-thumb ${accent ? "accent" : ""}`}>
      <div className="thumb-header" />
      <div className="thumb-name">JOHN DOE</div>
      <div className="thumb-role">PRODUCT DESIGNER</div>
      {["PROFILE", "EXPERIENCE", "EDUCATION", "SKILLS"].map((label) => (
        <div key={label}>
          <div className="thumb-section-label">{label}</div>
          <div className="thumb-bar" style={{ width: "90%" }} />
        </div>
      ))}
    </div>
  );
}

export default function TemplateStep({ selectedId, onSelect, heading = "Choose your CV template" }) {
  const [filter, setFilter] = useState(FILTERS[0]);
  const [query, setQuery] = useState("");

  const visible = useMemo(() => {
    return TEMPLATES.filter((t) => {
      const matchesFilter = filter === "All templates" || t.category === filter;
      const matchesQuery = t.name.toLowerCase().includes(query.toLowerCase());
      return matchesFilter && matchesQuery;
    });
  }, [filter, query]);

  return (
    <div style={{ width: "100%" }}>
      <h2>{heading}</h2>
      <p className="subtitle">All templates are recruiter-tested, fully editable, and optimized for ATS parsing.</p>

      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
        <div className="filter-row" style={{ marginBottom: 20 }}>
          {FILTERS.map((f) => (
            <button
              key={f}
              type="button"
              className={`filter-pill ${filter === f ? "selected" : ""}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
        <input
          className="search-input"
          placeholder="🔍 Search templates"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
      </div>

      <div className="template-grid">
        {visible.map((t) => {
          const isSelected = t.id === selectedId;
          return (
            <div key={t.id} className={`template-card ${isSelected ? "selected" : ""}`} onClick={() => onSelect(t.id)}>
              <TemplateThumb accent={isSelected} />
              <div className="template-meta">
                <div>
                  <span className="template-name">{t.name}</span>
                  <span className="template-tag">{t.tag}</span>
                </div>
                {isSelected && <span className="selected-label">Selected</span>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export const DEFAULT_TEMPLATE_ID = "modern-focus";
