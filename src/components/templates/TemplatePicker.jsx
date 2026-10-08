import { memo, useEffect, useMemo, useRef, useState } from "react";
import { ResumeDocument, TEMPLATES } from "./TemplatePage";
import { FEATURED_IDS, TEMPLATE_STYLES } from "../../lib/templateMeta";
import { designForTemplate, normalizeDesign } from "../../lib/editorDesign";
import { withSampleFill } from "../../lib/cvData";
import "../../picker.css";

// Aperçu réaliste d'un modèle : la vraie page, réduite
const Thumb = memo(function Thumb({ template, design, cv, width }) {
  const scale = width / 559;
  const thumbDesign = useMemo(() => ({ ...designForTemplate(design, template.id), zoom: 100 }), [design, template.id]);
  return (
    <span className="tp-thumb" style={{ width, height: Math.round(794 * scale) }} aria-hidden="true">
      <span className="tp-thumb-inner" style={{ transform: `scale(${scale})` }}>
        <ResumeDocument template={template} design={thumbDesign} cv={cv} />
      </span>
    </span>
  );
});

function PhotoBadge({ template }) {
  return <span className={`tp-badge ${template.photo === false ? "no-photo" : "photo"}`}>{template.photo === false ? "No photo" : "Photo"}</span>;
}

function TemplateCard({ template, design, cv, selected, onUse, width, compact = false }) {
  return (
    <article className={`tp-card ${selected ? "is-selected" : ""} ${compact ? "is-compact" : ""}`}>
      <button type="button" className="tp-card-preview" onClick={() => onUse(template.id)} aria-label={`Use ${template.name}`}>
        <Thumb template={template} design={design} cv={cv} width={width} />
      </button>
      <div className="tp-card-body">
        <div className="tp-card-title">
          <h3>{template.name}</h3>
          <PhotoBadge template={template} />
        </div>
        <p className="tp-style">{template.style}</p>
        {!compact && <p className="tp-pitch">{template.pitch}</p>}
        <button type="button" className="tp-use" onClick={() => onUse(template.id)}>
          {selected ? "Selected · Use again" : "Use Template"}
        </button>
      </div>
    </article>
  );
}

/** Fenêtre « More templates » : filtres, recherche et défilement interne */
export function TemplateModal({ open, onClose, design, cv: cvProp, selectedId, onUse }) {
  const cv = useMemo(() => withSampleFill(cvProp), [cvProp]);
  const [style, setStyle] = useState("All");
  const [photo, setPhoto] = useState("all");
  const [query, setQuery] = useState("");
  const closeRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    closeRef.current?.focus();
    const onKey = (event) => event.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    const previous = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = previous;
    };
  }, [open, onClose]);

  const shown = TEMPLATES.filter((template) => {
    if (style !== "All" && template.style !== style) return false;
    if (photo === "photo" && template.photo === false) return false;
    if (photo === "none" && template.photo !== false) return false;
    const q = query.trim().toLowerCase();
    return !q || `${template.name} ${template.style} ${template.pitch}`.toLowerCase().includes(q);
  });

  if (!open) return null;
  return (
    <div className="tp-backdrop" onMouseDown={(event) => event.target === event.currentTarget && onClose()}>
      <div className="tp-modal" role="dialog" aria-modal="true" aria-label="All templates">
        <header className="tp-modal-head">
          <div>
            <h2>All templates</h2>
            <p>{shown.length} template{shown.length === 1 ? "" : "s"} · your content stays the same, only the design changes.</p>
          </div>
          <button ref={closeRef} type="button" className="tp-close" onClick={onClose} aria-label="Close">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18" /></svg>
          </button>
        </header>
        <div className="tp-tools">
          <input type="search" placeholder="Search a template…" value={query} onChange={(event) => setQuery(event.target.value)} aria-label="Search templates" />
          <div className="tp-chips" role="group" aria-label="Style">
            {["All", ...TEMPLATE_STYLES].map((item) => (
              <button key={item} type="button" className={style === item ? "is-on" : ""} aria-pressed={style === item} onClick={() => setStyle(item)}>{item}</button>
            ))}
          </div>
          <div className="tp-chips" role="group" aria-label="Photo">
            {[["all", "Any"], ["photo", "With photo"], ["none", "No photo"]].map(([value, label]) => (
              <button key={value} type="button" className={photo === value ? "is-on" : ""} aria-pressed={photo === value} onClick={() => setPhoto(value)}>{label}</button>
            ))}
          </div>
        </div>
        <div className="tp-modal-scroll">
          {shown.length === 0 ? (
            <div className="tp-none">
              <p>No template matches these filters.</p>
              <button type="button" onClick={() => { setStyle("All"); setPhoto("all"); setQuery(""); }}>Reset filters</button>
            </div>
          ) : (
            <div className="tp-grid">
              {shown.map((template) => (
                <TemplateCard key={template.id} template={template} design={design} cv={cv} selected={template.id === selectedId} width={150} compact onUse={(id) => { onUse(id); onClose(); }} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/**
 * Sélection de modèle : 4 modèles d'abord, puis « More templates ».
 * cv : données affichées sur les aperçus · design : réglages de l'utilisateur (ou null)
 */
export default function TemplatePicker({ cv: cvProp, design = null, selectedId = null, onUse, intro }) {
  const cv = useMemo(() => withSampleFill(cvProp), [cvProp]);
  const [open, setOpen] = useState(false);
  const base = useMemo(() => normalizeDesign(design, selectedId ?? FEATURED_IDS[0]), [design, selectedId]);
  const featured = FEATURED_IDS.map((id) => TEMPLATES.find((template) => template.id === id)).filter(Boolean);
  return (
    <div className="tp">
      {intro}
      <div className="tp-featured">
        {featured.map((template) => (
          <TemplateCard key={template.id} template={template} design={base} cv={cv} selected={template.id === selectedId} width={248} onUse={onUse} />
        ))}
      </div>
      <div className="tp-more">
        <button type="button" onClick={() => setOpen(true)}>
          More Templates
          <span>{TEMPLATES.length - featured.length} more</span>
        </button>
      </div>
      <TemplateModal open={open} onClose={() => setOpen(false)} design={base} cv={cvProp} selectedId={selectedId} onUse={onUse} />
    </div>
  );
}
