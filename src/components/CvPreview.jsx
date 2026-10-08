import { useEffect, useMemo, useRef, useState } from "react";
import { ResumeDocument, TEMPLATES } from "./templates/TemplatePage";
import { TemplateModal } from "./templates/TemplatePicker";
import { buildCvData } from "../lib/cvData";
import { downloadCvPdf } from "../lib/pdf";
import { deleteCv, duplicateCv, fetchCvById, updateCv } from "../lib/cvs";
import { designForTemplate, footerFor, normalizeDesign } from "../lib/editorDesign";
import { useAuth } from "../context/AuthContext";
import "../final-cv.css";
import "../preview.css";

/**
 * Aperçu d'un CV existant : la page en grand, avec « Edit CV » et « Download PDF »
 * (+ changer de modèle, dupliquer, supprimer).
 */
export default function CvPreview({ cvId, autoDownload = false, onBack, onEdit }) {
  const { user } = useAuth();
  const [row, setRow] = useState(null);
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(115);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [busy, setBusy] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const paperRef = useRef(null);
  const autoDone = useRef(false);
  const stageRef = useRef(null);

  useEffect(() => {
    let cancelled = false;
    setRow(null);
    setError("");
    if (!cvId) {
      setError("No CV selected.");
      return undefined;
    }
    fetchCvById(cvId).then(({ data, error: failure }) => {
      if (cancelled) return;
      if (failure) setError(failure.message);
      else if (!data) setError("This CV no longer exists.");
      else setRow(data);
    });
    return () => {
      cancelled = true;
    };
  }, [cvId]);

  const content = row?.content ?? {};
  const template = TEMPLATES.find((item) => item.id === row?.template_id) ?? TEMPLATES[0];
  const design = useMemo(() => normalizeDesign(content.design ?? content.templateDesigns?.[template.id], template.id), [content.design, content.templateDesigns, template.id]);
  const cv = useMemo(
    () => buildCvData(content.form, { language: design.language, sections: design.sections, header: design.header, allowSample: false }),
    [content.form, design.language, design.sections, design.header]
  );
  const title = row?.title || "CV";

  async function download() {
    const element = paperRef.current?.querySelector(".resume-document");
    if (!element || busy) return;
    setBusy("pdf");
    try {
      await downloadCvPdf(element, `CV - ${cv.name || "CV"}`, { footer: footerFor(design, cv) });
    } catch (failure) {
      console.error("Création du PDF impossible :", failure);
      setError("Couldn’t create the PDF. Please try again.");
    } finally {
      setBusy("");
    }
  }

  // « Download » depuis la liste : le PDF se lance dès que la page est affichée
  useEffect(() => {
    if (autoDownload && row && !autoDone.current) {
      autoDone.current = true;
      window.setTimeout(download, 400);
    }
  }); // eslint-disable-line react-hooks/exhaustive-deps

  // Petit écran : la page s'ajuste à la largeur disponible
  useEffect(() => {
    const fit = () => {
      const width = stageRef.current?.clientWidth;
      if (width && width < 640) setZoom(Math.max(40, Math.floor(((width - 16) / 559) * 100)));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [row]);

  async function chooseTemplate(id) {
    const next = designForTemplate(design, id);
    const nextRow = {
      ...row,
      template_id: id,
      content: { ...content, design: next, templateDesigns: { ...(content.templateDesigns ?? {}), [id]: next }, templateName: TEMPLATES.find((item) => item.id === id)?.name },
    };
    setRow(nextRow); // l'aperçu change tout de suite
    const { error: failure } = await updateCv(row.id, { templateId: id, status: row.status, content: nextRow.content, title: row.title });
    if (failure) setError(failure.message);
  }

  async function duplicate() {
    setBusy("copy");
    const { error: failure } = await duplicateCv(user.id, row);
    setBusy("");
    if (failure) setError(failure.message);
    else onBack();
  }

  async function remove() {
    setBusy("delete");
    const { data, error: failure } = await deleteCv(row.id);
    setBusy("");
    if (failure || !data?.length) setError(failure?.message ?? "Deletion was refused by the database (check the delete policy on the cvs table).");
    else onBack();
  }

  if (error && !row) {
    return (
      <div className="cp-state">
        <h1>We couldn’t open this CV</h1>
        <p>{error}</p>
        <button className="btn btn-primary" type="button" onClick={onBack}>Back to My CVs</button>
      </div>
    );
  }
  if (!row) return <div className="cp-state">Loading your CV…</div>;

  return (
    <div className="cp-shell">
      <header className="cp-bar">
        <button className="cp-back" type="button" onClick={onBack}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true"><path d="M19 12H5M11 6l-6 6 6 6" /></svg>
          My CVs
        </button>
        <div className="cp-title">
          <h1 title={title}>{title}</h1>
          <p>{template.name} · {template.style} · {template.photo === false ? "No photo" : "Photo"}</p>
        </div>
        <div className="cp-actions">
          <button className="cp-btn primary" type="button" onClick={() => onEdit(row.id)}>Edit CV</button>
          <button className="cp-btn" type="button" onClick={download} disabled={busy === "pdf"}>{busy === "pdf" ? "Creating PDF…" : "Download PDF"}</button>
          <button className="cp-btn ghost" type="button" onClick={() => setPickerOpen(true)}>Change Template</button>
          <button className="cp-btn ghost" type="button" onClick={duplicate} disabled={busy === "copy"}>Duplicate</button>
          {confirmDelete ? (
            <span className="cp-confirm">
              Delete for good?
              <button className="cp-btn danger" type="button" onClick={remove} disabled={busy === "delete"}>Yes, delete</button>
              <button className="cp-btn ghost" type="button" onClick={() => setConfirmDelete(false)}>No</button>
            </span>
          ) : (
            <button className="cp-btn ghost danger-text" type="button" onClick={() => setConfirmDelete(true)}>Delete</button>
          )}
        </div>
      </header>
      {error && <div className="cp-alert">{error}</div>}

      <main className="cp-stage" ref={stageRef}>
        <div className="cp-zoom">
          <button type="button" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(60, z - 10))}>−</button>
          <span>{zoom}%</span>
          <button type="button" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(170, z + 10))}>+</button>
        </div>
        <div className="final-cv-paper cp-paper" ref={paperRef} style={{ "--final-zoom": zoom / 100 }}>
          <ResumeDocument template={template} design={design} cv={cv} />
        </div>
      </main>

      <TemplateModal open={pickerOpen} onClose={() => setPickerOpen(false)} design={design} cv={cv} selectedId={template.id} onUse={chooseTemplate} />
    </div>
  );
}
