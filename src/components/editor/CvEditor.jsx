import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import PhotoCropper from "../PhotoCropper";
import EditorPanels, { NAV_ITEMS } from "./EditorPanels";
import EmptySheet from "./EmptySheet";
import { TemplateModal } from "../templates/TemplatePicker";
import { EditContext } from "./Editable";
import { ResumeDocument, TEMPLATES, resolvePhoto } from "../templates/TemplatePage";
import { buildCvData, isCvEmpty } from "../../lib/cvData";
import { downloadCvPdf } from "../../lib/pdf";
import { initialFormData, mergeForm } from "../../lib/formDefaults";
import { designForTemplate, footerFor, normalizeDesign, templateKind } from "../../lib/editorDesign";
import { useAuth } from "../../context/AuthContext";
import { useCvAutosave } from "../../hooks/useCvAutosave";
import "../../final-cv.css";
import "../../editor.css";

const DEFAULT_TEMPLATE = "modern-focus";
const HISTORY_LIMIT = 100;
const HISTORY_MERGE_MS = 700; // les frappes rapprochées forment un seul pas d'annulation

const SAVE_LABELS = {
  idle: "Draft saved",
  dirty: "Unsaved changes…",
  saving: "Saving…",
  saved: "All changes saved",
  error: "Couldn’t save — check your connection",
};

// Texte cliqué sur la page → panneau à ouvrir
function sectionForClick(target, cv) {
  if (target.closest('img, [class*="avatar"], [class*="photo"]')) return "photo";
  const holder = target.closest("li, p, span, strong, b, small, time, h2, h3, h4, div") ?? target;
  const raw = (holder.textContent ?? "").trim().toLowerCase();
  if (raw.length < 2) return null;
  const hit = (value) => {
    const v = String(value ?? "").trim().toLowerCase();
    return v.length >= 2 && (raw === v || (v.length >= 4 && raw.includes(v)) || (raw.length >= 6 && v.includes(raw)));
  };
  if ([cv.email, cv.phone, cv.location, cv.website, ...(cv.extraLinks ?? [])].some(hit)) return "personal";
  if (cv.experience.some((job) => [job.company, job.role, job.dates, ...job.bullets].some(hit))) return "experience";
  if (cv.education.some((entry) => [entry.degree, entry.school, entry.dates, entry.details].some(hit))) return "education";
  if (cv.skills.some(hit)) return "skills";
  if (cv.languages.some((language) => hit(language.name) || hit(`${language.name} (${language.level})`))) return "languages";
  if ([...cv.certifications, ...cv.interests, cv.awards].some(hit)) return "languages";
  if (hit(cv.summary)) return "summary";
  if (raw.length <= 32) {
    if (/experience|expérience/.test(raw)) return "experience";
    if (/education|formation|scolaire/.test(raw)) return "education";
    if (/skill|compétence|expertise/.test(raw)) return "skills";
    if (/language|langue|certificat|certification|interest|intérêt|award|distinction/.test(raw)) return "languages";
    if (/summary|résumé|profile|profil|about|propos/.test(raw)) return "summary";
    if (/contact|phone|téléphone|mail|address|adresse|website|site/.test(raw)) return "personal";
  }
  return null;
}

export default function CvEditor({ cvId = null, initialTemplateId = null, onOpenDashboard, onPreview, onCvCreated, registerAiApply }) {
  const { user } = useAuth();
  const [initialCvId] = useState(cvId);
  const [createdId, setCreatedId] = useState(null); // id du CV une fois créé en base // figé : l'id affiché ensuite par l'application ne doit pas recharger le CV

  // ---- Document + historique (annuler / rétablir) ----
  const [doc, setDocState] = useState(() => {
    const templateId = TEMPLATES.some((item) => item.id === initialTemplateId) ? initialTemplateId : DEFAULT_TEMPLATE;
    return { form: initialFormData(), templateId, design: normalizeDesign(null, templateId), customTitle: "" };
  });
  const docRef = useRef(doc);
  const past = useRef([]);
  const future = useRef([]);
  const lastPush = useRef(0);
  const [, bump] = useState(0);
  const extraRef = useRef({}); // autres clés du contenu sauvegardé (ex. étape du questionnaire), conservées telles quelles
  const [loadedStatus, setLoadedStatus] = useState("draft");
  const [downloaded, setDownloaded] = useState(false);

  const commit = useCallback((next, record = true) => {
    const previous = docRef.current;
    if (next === previous) return;
    if (record) {
      const now = Date.now();
      if (now - lastPush.current > HISTORY_MERGE_MS) {
        past.current.push(previous);
        if (past.current.length > HISTORY_LIMIT) past.current.shift();
      }
      lastPush.current = now;
      future.current = [];
    }
    docRef.current = next;
    setDocState(next);
    bump((n) => n + 1);
  }, []);

  const update = useCallback((change) => commit(change(docRef.current)), [commit]);

  function undo() {
    if (!past.current.length) return;
    future.current.push(docRef.current);
    docRef.current = past.current.pop();
    lastPush.current = 0;
    setDocState(docRef.current);
    bump((n) => n + 1);
  }

  function redo() {
    if (!future.current.length) return;
    past.current.push(docRef.current);
    docRef.current = future.current.pop();
    lastPush.current = 0;
    setDocState(docRef.current);
    bump((n) => n + 1);
  }

  // ---- Sauvegarde ----
  const template = TEMPLATES.find((item) => item.id === doc.templateId) ?? TEMPLATES[0];
  const snapshot = {
    templateId: doc.templateId,
    status: downloaded || loadedStatus === "complete" ? "complete" : "draft",
    content: {
      ...extraRef.current,
      form: doc.form,
      design: doc.design,
      templateDesigns: { ...(extraRef.current.templateDesigns ?? {}), [doc.templateId]: doc.design },
      templateName: template.name,
      customTitle: doc.customTitle,
    },
  };

  function handleLoaded(row) {
    const content = row.content ?? {};
    const templateId = TEMPLATES.some((item) => item.id === row.template_id) ? row.template_id : DEFAULT_TEMPLATE;
    extraRef.current = content;
    const next = {
      form: mergeForm(content.form),
      templateId,
      design: normalizeDesign(content.design ?? content.templateDesigns?.[templateId], templateId),
      customTitle: content.customTitle ?? "",
    };
    past.current = [];
    future.current = [];
    docRef.current = next;
    setDocState(next);
    setLoadedStatus(row.status ?? "draft");
  }

  const { loading, loadError, retryLoad, saveStatus, saveNow } = useCvAutosave({
    userId: user.id,
    cvId: initialCvId,
    snapshot,
    onLoaded: handleLoaded,
    onCreated: (id) => {
      setCreatedId(id);
      onCvCreated?.(id);
    },
  });
  const currentId = createdId ?? initialCvId;

  // ---- Données dérivées ----
  const { form, design } = doc;
  const cvOptions = { language: design.language, sections: design.sections, header: design.header };
  const cv = useMemo(
    () => buildCvData(form, { ...cvOptions, allowSample: false }),
    [form, design.language, design.sections, design.header] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const thumbCv = useMemo(
    () => buildCvData(form, { ...cvOptions, allowSample: true }),
    [form, design.language, design.sections, design.header] // eslint-disable-line react-hooks/exhaustive-deps
  );
  const empty = isCvEmpty(form);
  const photoShown = resolvePhoto(design, cv);

  // ---- Modifications ----
  const setSection = useCallback(
    (section, value) =>
      update((d) => ({ ...d, form: { ...d.form, [section]: typeof value === "function" ? value(d.form[section]) : value } })),
    [update]
  );

  const setDesign = useCallback(
    (keyOrPatch, value) =>
      update((d) => ({ ...d, design: { ...d.design, ...(typeof keyOrPatch === "string" ? { [keyOrPatch]: value } : keyOrPatch) } })),
    [update]
  );

  const [layoutFilter, setLayoutFilter] = useState("all");

  function chooseTemplate(id) {
    update((d) => ({ ...d, templateId: id, design: designForTemplate(d.design, id) }));
  }

  function chooseLayout(kind) {
    setLayoutFilter(kind);
    if (kind !== "all" && templateKind(template) !== kind) {
      const first = TEMPLATES.find((item) => templateKind(item) === kind);
      if (first) chooseTemplate(first.id);
    }
  }

  // ---- Modification directe sur la page ----
  const [focusRequest, setFocusRequest] = useState(null);
  const clearFocusRequest = useCallback(() => setFocusRequest(null), []);

  const onEdit = useCallback(
    (field, text, id) => {
      const wasEmpty = isCvEmpty(docRef.current.form);
      update((d) => {
        const f = d.form;
        switch (field) {
          case "name": {
            const [first = "", ...rest] = text.trim().split(/\s+/).filter(Boolean);
            return { ...d, form: { ...f, personalInfo: { ...f.personalInfo, fullName: text, firstName: first, lastName: rest.join(" ") } } };
          }
          case "role":
            return { ...d, form: { ...f, careerGoal: { ...f.careerGoal, targetJobTitle: text } } };
          case "summary":
            return { ...d, form: { ...f, summary: { ...f.summary, about: text.slice(0, 500), objective: "" } } };
          case "job.role":
          case "job.company": {
            const key = field === "job.role" ? "jobTitle" : "company";
            return { ...d, form: { ...f, experience: f.experience.map((entry) => (entry.id === id ? { ...entry, [key]: text } : entry)) } };
          }
          default:
            return d;
        }
      });
      // première lettre tapée sur la page vierge : le vrai modèle apparaît, on garde le curseur dans le champ
      if (wasEmpty && text) setFocusRequest({ f: field, id: null });
    },
    [update]
  );

  const editContext = useMemo(() => ({ onEdit, focusRequest, clearFocusRequest }), [onEdit, focusRequest, clearFocusRequest]);

  // ---- Navigation verticale + panneau ----
  const [active, setActive] = useState("personal");
  const panelRef = useRef(null);
  const navRef = useRef(null);
  const lockSpy = useRef(0);

  function goTo(key) {
    const panel = panelRef.current;
    const card = panel?.querySelector(`#panel-${key}`);
    if (!panel || !card) return;
    lockSpy.current = Date.now() + 700;
    setActive(key);
    panel.scrollTo({ top: card.offsetTop - 8, behavior: "smooth" });
    card.classList.add("is-flash");
    window.setTimeout(() => card.classList.remove("is-flash"), 1300);
  }

  function onPanelScroll() {
    if (Date.now() < lockSpy.current) return;
    const panel = panelRef.current;
    if (!panel) return;
    let current = NAV_ITEMS.find((item) => item.key)?.key;
    panel.querySelectorAll("[data-card]").forEach((card) => {
      if (card.offsetTop - 70 <= panel.scrollTop) current = card.dataset.card;
    });
    setActive((previous) => (previous === current ? previous : current));
  }

  // garde l'entrée active visible dans la barre verticale
  useEffect(() => {
    navRef.current?.querySelector(".is-active")?.scrollIntoView({ block: "nearest" });
  }, [active]);

  function onSheetClick(event) {
    if (event.target.closest(".cv-e")) return;
    const key = sectionForClick(event.target, cv);
    if (key) goTo(key);
  }

  // ---- Photo, titre, PDF, IA ----
  const [pendingPhoto, setPendingPhoto] = useState(null);
  const [templatesOpen, setTemplatesOpen] = useState(false);
  const [mobileView, setMobileView] = useState("edit"); // petit écran : « edit » (réglages) ou « preview » (page)
  const [zoom, setZoom] = useState(100);
  const paperRef = useRef(null);
  const previewRef = useRef(null);
  const [downloading, setDownloading] = useState(false);
  const [downloadError, setDownloadError] = useState("");
  const [renaming, setRenaming] = useState(false);
  const [titleDraft, setTitleDraft] = useState("");
  const title = doc.customTitle.trim() || (form.personalInfo.fullName.trim() ? `CV - ${form.personalInfo.fullName.trim()}` : "Untitled CV");

  function commitTitle() {
    setRenaming(false);
    const value = titleDraft.trim();
    if (value !== doc.customTitle) update((d) => ({ ...d, customTitle: value }));
  }

  async function handleDownload() {
    const element = paperRef.current?.querySelector(".resume-document");
    if (!element || downloading || empty) return;
    setDownloading(true);
    setDownloadError("");
    try {
      await downloadCvPdf(element, `CV - ${cv.name || "CV"}`, { footer: footerFor(design, cv) });
      setDownloaded(true);
    } catch (error) {
      console.error("Création du PDF impossible :", error);
      setDownloadError("Couldn’t create the PDF. Please try again.");
    } finally {
      setDownloading(false);
    }
  }

  async function handleSave() {
    await saveNow();
  }

  async function handlePreview() {
    const { ok } = await saveNow();
    if (ok && currentId) onPreview?.(currentId);
  }

  async function handleBack() {
    await saveNow(); // ne rien perdre de la dernière saisie
    onOpenDashboard?.();
  }

  // L'assistant IA global peut écrire dans le résumé de ce CV
  useEffect(() => {
    if (!registerAiApply) return undefined;
    registerAiApply((text) =>
      update((d) => ({ ...d, form: { ...d.form, summary: { ...d.form.summary, about: text.replace(/(^"|"$)/g, "").slice(0, 500) } } }))
    );
    return () => registerAiApply(null);
  }, [registerAiApply, update]);

  // Petit écran : la page A4 s'ajuste à la largeur disponible (pas de défilement latéral)
  useEffect(() => {
    const fit = () => {
      const element = previewRef.current;
      if (!element || window.innerWidth > 1100 || element.clientWidth === 0) return;
      setZoom(Math.max(40, Math.min(100, Math.floor(((element.clientWidth - 20) / 559) * 100))));
    };
    fit();
    window.addEventListener("resize", fit);
    return () => window.removeEventListener("resize", fit);
  }, [mobileView, loading]);

  // ---- Écrans d'attente ----
  if (loadError) {
    return (
      <div className="ed-state">
        <h1>We couldn’t open this CV</h1>
        <p>{loadError}</p>
        <div className="ed-state-actions">
          <button className="btn btn-secondary" type="button" onClick={retryLoad}>
            Try again
          </button>
          <button className="btn btn-primary" type="button" onClick={onOpenDashboard}>
            Back to My CVs
          </button>
        </div>
      </div>
    );
  }
  if (loading) return <div className="ed-state">Loading your CV…</div>;

  return (
    <div className="ed-shell">
      {pendingPhoto && (
        <PhotoCropper
          file={pendingPhoto}
          onCancel={() => setPendingPhoto(null)}
          onDone={(dataUrl) => {
            setDesign("photo", dataUrl);
            setPendingPhoto(null);
          }}
        />
      )}

      <TemplateModal
        open={templatesOpen}
        onClose={() => setTemplatesOpen(false)}
        design={design}
        cv={thumbCv}
        selectedId={doc.templateId}
        onUse={(id) => {
          chooseTemplate(id);
          setLayoutFilter("all");
        }}
      />

      {/* Barre du haut */}
      <header className="ed-topbar">
        <button className="ed-back" type="button" onClick={handleBack} aria-label="Back to My CVs">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M19 12H5M11 6l-6 6 6 6" />
          </svg>
          My CVs
        </button>
        <span className="ed-sep" />
        {renaming ? (
          <input
            className="ed-title-input"
            autoFocus
            value={titleDraft}
            maxLength={80}
            aria-label="CV name"
            onChange={(event) => setTitleDraft(event.target.value)}
            onBlur={commitTitle}
            onKeyDown={(event) => {
              if (event.key === "Enter") commitTitle();
              if (event.key === "Escape") setRenaming(false);
            }}
          />
        ) : (
          <button
            className="ed-title"
            type="button"
            aria-label="Rename CV"
            onClick={() => {
              setTitleDraft(doc.customTitle || title);
              setRenaming(true);
            }}
          >
            {title}
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M4 20h4L19 9l-4-4L4 16z" />
            </svg>
          </button>
        )}
        <span className={`ed-save ${saveStatus}`}>
          {saveStatus === "saved" || saveStatus === "idle" ? (
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
              <path d="M5 12l5 5 9-10" />
            </svg>
          ) : null}
          {SAVE_LABELS[saveStatus] ?? SAVE_LABELS.idle}
        </span>
        {downloadError && <span className="ed-save error">{downloadError}</span>}
        <span className="ed-grow" />
        <button className="ed-icon" type="button" aria-label="Undo" disabled={!past.current.length} onClick={undo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M9 14L4 9l5-5M4 9h10a6 6 0 0 1 0 12h-3" />
          </svg>
        </button>
        <button className="ed-icon" type="button" aria-label="Redo" disabled={!future.current.length} onClick={redo}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M15 14l5-5-5-5M20 9H10a6 6 0 0 0 0 12h3" />
          </svg>
        </button>
        <button className="ed-btn-ghost" type="button" onClick={handleSave} disabled={saveStatus === "saving"}>
          Save
        </button>
        <button className="ed-btn-ghost" type="button" onClick={handlePreview} disabled={empty || (!currentId && saveStatus !== "saved")}>
          Preview
        </button>
        <button className="ed-download" type="button" onClick={handleDownload} disabled={empty || downloading} title={empty ? "Add some content first" : undefined}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
            <path d="M12 4v11M7 11l5 5 5-5M5 20h14" />
          </svg>
          {downloading ? "Creating PDF…" : "Download PDF"}
        </button>
      </header>

      <div className="ed-mobile-tabs" role="tablist" aria-label="Editor view">
        <button type="button" role="tab" aria-selected={mobileView === "edit"} className={mobileView === "edit" ? "is-on" : ""} onClick={() => setMobileView("edit")}>Customize</button>
        <button type="button" role="tab" aria-selected={mobileView === "preview"} className={mobileView === "preview" ? "is-on" : ""} onClick={() => setMobileView("preview")}>Preview</button>
      </div>

      <div className={`ed-body view-${mobileView}`}>
        {/* Barre verticale : on la fait défiler ou on clique une entrée */}
        <nav className="ed-nav" aria-label="Editor sections">
          <div className="ed-nav-scroll" ref={navRef}>
            {NAV_ITEMS.map((item) =>
              item.group ? (
                <div className="ed-nav-group" key={item.group}>
                  {item.group}
                </div>
              ) : (
                <button
                  key={item.key}
                  type="button"
                  className={`ed-nav-item ${active === item.key ? "is-active" : ""}`}
                  aria-current={active === item.key ? "true" : undefined}
                  onClick={() => goTo(item.key)}
                >
                  {item.label}
                </button>
              )
            )}
          </div>
          <div className="ed-nav-fade" aria-hidden="true">
            <span>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </span>
          </div>
        </nav>

        {/* Panneaux de réglages */}
        <section className="ed-panel" ref={panelRef} onScroll={onPanelScroll} aria-label="Settings">
          <EditorPanels
            form={form}
            design={design}
            templateId={doc.templateId}
            thumbCv={thumbCv}
            photoShown={photoShown}
            template={template}
            layoutFilter={layoutFilter}
            setSection={setSection}
            setDesign={setDesign}
            onTemplate={chooseTemplate}
            onLayoutFilter={chooseLayout}
            onPickPhoto={setPendingPhoto}
            onBrowseTemplates={() => setTemplatesOpen(true)}
          />
        </section>

        {/* Page en direct */}
        <section className="ed-preview" aria-label="CV preview" ref={previewRef}>
          <div className="ed-preview-bar">
            <button type="button" className="ed-chip ed-chip-btn" onClick={() => setTemplatesOpen(true)} aria-label="Change template">
              Change template · {template.name}
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M6 9l6 6 6-6" />
              </svg>
            </button>
            <span className="ed-chip">A4</span>
            <span>Live preview</span>
            <span className="ed-sep" />
            <button type="button" className="ed-zoom" aria-label="Zoom out" onClick={() => setZoom((z) => Math.max(50, z - 10))}>
              −
            </button>
            <span className="ed-zoom-value">{zoom}%</span>
            <button type="button" className="ed-zoom" aria-label="Zoom in" onClick={() => setZoom((z) => Math.min(150, z + 10))}>
              +
            </button>
          </div>

          <EditContext.Provider value={editContext}>
            <div className="final-cv-paper ed-sheet" ref={paperRef} style={{ "--final-zoom": zoom / 100 }} onClick={onSheetClick}>
              {empty ? <EmptySheet form={form} onJump={goTo} /> : <ResumeDocument template={template} design={design} cv={cv} />}
            </div>
          </EditContext.Provider>
        </section>
      </div>
    </div>
  );
}
