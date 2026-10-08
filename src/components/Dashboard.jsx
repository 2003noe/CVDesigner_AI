import { useCallback, useEffect, useMemo, useState } from "react";
import TopNav from "./TopNav";
import { ResumeDocument, TEMPLATES } from "./templates/TemplatePage";
import { buildCvData, isCvEmpty } from "../lib/cvData";
import { normalizeDesign } from "../lib/editorDesign";
import { deleteCv, duplicateCv, listCvs, renameCv } from "../lib/cvs";
import { useAuth } from "../context/AuthContext";
import "../dashboard.css";
import "../editor.css";

function CvThumbnail({ row }) {
  const content = row.content ?? {};
  const template = TEMPLATES.find((item) => item.id === row.template_id) ?? TEMPLATES[0];
  const design = normalizeDesign(content.design ?? content.templateDesigns?.[template.id], template.id);
  const empty = isCvEmpty(content.form);
  const cv = useMemo(
    () => buildCvData(content.form, { language: design.language, sections: design.sections, header: design.header, allowSample: false }),
    [content.form, design.language, design.sections, design.header]
  );
  return (
    <div className="cv-thumb" aria-hidden="true">
      <div className="cv-thumb-inner">
        {empty ? <div className="cv-thumb-blank" /> : <ResumeDocument template={template} design={{ ...design, zoom: 100 }} cv={cv} />}
      </div>
    </div>
  );
}

function timeAgo(value) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  const minutes = Math.round((Date.now() - date.getTime()) / 60000);
  if (minutes < 1) return "just now";
  if (minutes < 60) return `${minutes} min ago`;
  const hours = Math.round(minutes / 60);
  if (hours < 24) return `${hours} hour${hours === 1 ? "" : "s"} ago`;
  const days = Math.round(hours / 24);
  if (days < 8) return `${days} day${days === 1 ? "" : "s"} ago`;
  return date.toLocaleDateString(undefined, { day: "numeric", month: "short", year: "numeric" });
}

const FILTERS = [
  ["all", "All"],
  ["draft", "Drafts"],
  ["complete", "Complete"],
];

/**
 * « My CVs » : tous les CV de l'utilisateur, « Create a CV » (questionnaire) et « Use a template ».
 * active : vrai quand la page est affichée — la liste est relue à chaque affichage.
 */
export default function Dashboard({ onNavigate, onPreview, onEdit, onDownload, onCreate, onUseTemplate, active }) {
  const { user } = useAuth();
  const [rows, setRows] = useState(null); // null = chargement
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
  const [menuId, setMenuId] = useState(null); // menu « ⋯ » ouvert
  const [filter, setFilter] = useState("all");

  const load = useCallback(async () => {
    setError("");
    const { data, error: loadError } = await listCvs();
    if (loadError) {
      setError(loadError.message);
      setRows([]);
      return;
    }
    setRows(data ?? []);
  }, []);

  useEffect(() => {
    if (active && user) load();
  }, [active, user, load]);

  async function runAction(id, action) {
    setBusyId(id);
    setActionError("");
    const { error: failure } = await action();
    setBusyId(null);
    if (failure) {
      setActionError(failure.message);
      return false;
    }
    await load();
    return true;
  }

  async function handleRename(id) {
    const title = renameValue.trim();
    if (!title) return;
    if (await runAction(id, () => renameCv(id, title))) setRenamingId(null);
  }

  async function handleDelete(id) {
    // .select() renvoie les lignes réellement supprimées : vide = refusé par la base (droits)
    const ok = await runAction(id, async () => {
      const { data, error: failure } = await deleteCv(id);
      if (failure) return { error: failure };
      if (!data?.length) return { error: { message: "Deletion was refused by the database (check the delete policy on the cvs table)." } };
      return {};
    });
    if (ok) setDeletingId(null);
  }

  const shown = (rows ?? []).filter((row) => filter === "all" || (filter === "complete" ? row.status === "complete" : row.status !== "complete"));
  const count = rows?.length ?? 0;

  return (
    <div className="app-shell dash2">
      <TopNav onNavigate={onNavigate} isAuthed />
      <main className="dash2-main">
        <header className="dash2-header">
          <div>
            <h1>My CVs</h1>
            <p>
              {rows
                ? count === 0
                  ? "Your CVs will appear here."
                  : `${count} CV${count === 1 ? "" : "s"} saved. Open one to preview it, edit it or download it.`
                : "Loading your CVs…"}
            </p>
          </div>
          <div className="dash2-head-actions">
            <button className="dash2-cta" type="button" onClick={onCreate}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true"><path d="M12 5v14M5 12h14" /></svg>
              Create a CV
            </button>
            <button className="dash2-cta ghost" type="button" onClick={onUseTemplate}>Use a template</button>
          </div>
        </header>

        {error && (
          <div className="dash2-alert">
            Couldn’t load your CVs: {error}{" "}
            <button className="link-btn" type="button" onClick={load}>Try again</button>
          </div>
        )}
        {actionError && <div className="dash2-alert">{actionError}</div>}

        {rows && rows.length > 0 && (
          <div className="dash2-filters" role="group" aria-label="Filter CVs">
            {FILTERS.map(([value, label]) => (
              <button key={value} type="button" className={filter === value ? "is-on" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
        )}

        {rows && rows.length === 0 && !error && (
          <div className="dash2-empty">
            <div className="dash2-empty-art" aria-hidden="true">
              <svg width="54" height="54" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"><path d="M14 3H7a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8z" /><path d="M14 3v5h5M9 13h6M9 17h4" /></svg>
            </div>
            <h2>You don’t have a CV yet</h2>
            <p>Answer a few questions, pick a template and download a polished PDF in minutes.</p>
            <button className="dash2-cta" type="button" onClick={onCreate}>Create your first CV</button>
          </div>
        )}

        <section className="dash2-grid">
          {/* 2 · CV existants */}
          {shown.map((row) => {
            const template = TEMPLATES.find((item) => item.id === row.template_id);
            const isBusy = busyId === row.id;
            const complete = row.status === "complete";
            return (
              <article className="dash2-card" key={row.id}>
                <button className="dash2-preview" type="button" onClick={() => onPreview(row.id)} aria-label={`Preview ${row.title}`}>
                  <CvThumbnail row={row} />
                </button>

                <div className="dash2-card-body">
                  {renamingId === row.id ? (
                    <div className="dash2-rename">
                      <input
                        autoFocus
                        value={renameValue}
                        maxLength={80}
                        aria-label="CV name"
                        onChange={(event) => setRenameValue(event.target.value)}
                        onKeyDown={(event) => {
                          if (event.key === "Enter") handleRename(row.id);
                          if (event.key === "Escape") setRenamingId(null);
                        }}
                      />
                      <button className="dash2-btn" type="button" disabled={isBusy} onClick={() => handleRename(row.id)}>Save</button>
                      <button className="dash2-btn ghost" type="button" onClick={() => setRenamingId(null)}>Cancel</button>
                    </div>
                  ) : (
                    <div className="dash2-title-row">
                      <h3 title={row.title}>{row.title || "Untitled CV"}</h3>
                      <span className={`dash2-status ${complete ? "complete" : "draft"}`}>{complete ? "Complete" : "Draft"}</span>
                    </div>
                  )}
                  <p className="dash2-meta">
                    {template?.name ?? "Template"} · Edited {timeAgo(row.updated_at)}
                  </p>

                  {deletingId === row.id ? (
                    <div className="dash2-confirm">
                      <span>Delete this CV for good?</span>
                      <button className="dash2-btn danger" type="button" disabled={isBusy} onClick={() => handleDelete(row.id)}>
                        {isBusy ? "Deleting…" : "Yes, delete"}
                      </button>
                      <button className="dash2-btn ghost" type="button" onClick={() => setDeletingId(null)}>No</button>
                    </div>
                  ) : (
                    <div className="dash2-actions">
                      <button className="dash2-btn" type="button" onClick={() => onPreview(row.id)}>Preview</button>
                      <button className="dash2-btn soft" type="button" onClick={() => onEdit(row.id)}>Edit</button>
                      <button className="dash2-icon" type="button" aria-label="Download PDF" title="Download PDF" onClick={() => onDownload(row.id)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M12 4v11M7 11l5 5 5-5M5 20h14" /></svg>
                      </button>
                      <span className="dash2-grow" />
                      <div className="dash2-more">
                        <button className="dash2-icon" type="button" aria-label="More actions" aria-expanded={menuId === row.id} onClick={() => setMenuId(menuId === row.id ? null : row.id)}>
                          <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><circle cx="5" cy="12" r="1.8" /><circle cx="12" cy="12" r="1.8" /><circle cx="19" cy="12" r="1.8" /></svg>
                        </button>
                        {menuId === row.id && (
                          <div className="dash2-menu" role="menu" onMouseLeave={() => setMenuId(null)}>
                            <button type="button" role="menuitem" onClick={() => { setMenuId(null); setRenamingId(row.id); setRenameValue(row.title ?? ""); }}>Rename</button>
                            <button type="button" role="menuitem" disabled={isBusy} onClick={() => { setMenuId(null); runAction(row.id, () => duplicateCv(user.id, row)); }}>Duplicate</button>
                            <button type="button" role="menuitem" className="danger" onClick={() => { setMenuId(null); setDeletingId(row.id); }}>Delete</button>
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              </article>
            );
          })}
        </section>

        {rows && rows.length > 0 && shown.length === 0 && <p className="dash2-none">No {filter === "draft" ? "draft" : "complete"} CV yet.</p>}
      </main>
    </div>
  );
}
