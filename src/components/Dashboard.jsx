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
 * « My CVs » : le CV vierge (« + ») en premier, puis tous les CV de l'utilisateur.
 * active : vrai quand la page est affichée — la liste est relue à chaque affichage.
 */
export default function Dashboard({ onNavigate, onOpen, onCreate, onCreateGuided, active }) {
  const { user } = useAuth();
  const [rows, setRows] = useState(null); // null = chargement
  const [error, setError] = useState("");
  const [actionError, setActionError] = useState("");
  const [renamingId, setRenamingId] = useState(null);
  const [renameValue, setRenameValue] = useState("");
  const [deletingId, setDeletingId] = useState(null);
  const [busyId, setBusyId] = useState(null);
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
                ? `${count} CV${count === 1 ? "" : "s"} saved. Keep editing one, or start a new one from a blank page.`
                : "Loading your CVs…"}
            </p>
          </div>
          <div className="dash2-filters" role="group" aria-label="Filter CVs">
            {FILTERS.map(([value, label]) => (
              <button key={value} type="button" className={filter === value ? "is-on" : ""} aria-pressed={filter === value} onClick={() => setFilter(value)}>
                {label}
              </button>
            ))}
          </div>
        </header>

        {error && (
          <div className="dash2-alert">
            Couldn’t load your CVs: {error}{" "}
            <button className="link-btn" type="button" onClick={load}>Try again</button>
          </div>
        )}
        {actionError && <div className="dash2-alert">{actionError}</div>}

        <section className="dash2-grid">
          {/* 1 · CV vierge */}
          <article className="dash2-card dash2-new">
            <button type="button" className="dash2-new-main" onClick={onCreate} aria-label="Create a new blank CV">
              <span className="dash2-new-stage">
                <span className="dash2-new-paper">
                  <span className="dash2-plus">
                    <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" aria-hidden="true">
                      <path d="M12 5v14M5 12h14" />
                    </svg>
                  </span>
                  <span className="dash2-new-label">Blank CV</span>
                </span>
              </span>
              <span className="dash2-card-body">
                <strong>Create a new CV</strong>
                <span>Start from an empty page and write straight onto it. Pick the template later.</span>
              </span>
            </button>
            {onCreateGuided && (
              <button type="button" className="dash2-guided" onClick={onCreateGuided}>
                Prefer questions? Fill it step by step
              </button>
            )}
          </article>

          {/* 2 · CV existants */}
          {shown.map((row) => {
            const template = TEMPLATES.find((item) => item.id === row.template_id);
            const isBusy = busyId === row.id;
            const complete = row.status === "complete";
            return (
              <article className="dash2-card" key={row.id}>
                <button className="dash2-preview" type="button" onClick={() => onOpen(row.id)} aria-label={`Open ${row.title}`}>
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
                      <button className="dash2-btn" type="button" onClick={() => onOpen(row.id)}>Open</button>
                      <span className="dash2-grow" />
                      <button
                        className="dash2-icon"
                        type="button"
                        aria-label="Rename"
                        onClick={() => {
                          setRenamingId(row.id);
                          setRenameValue(row.title ?? "");
                        }}
                      >
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 20h4L19 9l-4-4L4 16z" /></svg>
                      </button>
                      <button className="dash2-icon" type="button" aria-label="Duplicate" disabled={isBusy} onClick={() => runAction(row.id, () => duplicateCv(user.id, row))}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><rect x="9" y="9" width="11" height="11" rx="2" /><path d="M5 15V6a2 2 0 0 1 2-2h8" /></svg>
                      </button>
                      <button className="dash2-icon danger" type="button" aria-label="Delete" onClick={() => setDeletingId(row.id)}>
                        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" /></svg>
                      </button>
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
