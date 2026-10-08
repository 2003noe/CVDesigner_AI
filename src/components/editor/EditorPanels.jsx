import { memo, useDeferredValue, useMemo } from "react";
import PersonalInfo from "../steps/PersonalInfo";
import Summary from "../steps/Summary";
import Education from "../steps/Education";
import Experience from "../steps/Experience";
import Skills from "../steps/Skills";
import Languages from "../steps/Languages";
import { ResumeDocument, TEMPLATES, TYPOGRAPHIES, DEFAULT_SECTION_ORDER } from "../templates/TemplatePage";
import { CV_LANGUAGES } from "../../lib/cvLabels";
import { designForTemplate, templateKind } from "../../lib/editorDesign";
import { Choice, PanelCard, RangeRow, Toggle } from "./controls";

// Entrées de la barre verticale, dans l'ordre : { group } = titre de groupe, sinon { key, label }
export const NAV_ITEMS = [
  { group: "CONTENT" },
  { key: "personal", label: "Personal details" },
  { key: "summary", label: "Summary" },
  { key: "experience", label: "Experience" },
  { key: "education", label: "Education" },
  { key: "skills", label: "Skills" },
  { key: "languages", label: "Languages & more" },
  { group: "DESIGN" },
  { key: "document", label: "Document" },
  { key: "templates", label: "Templates" },
  { key: "layout", label: "Layout" },
  { key: "fontsize", label: "Font size" },
  { key: "spacing", label: "Spacing" },
  { key: "entries", label: "Entries" },
  { key: "headings", label: "Headings" },
  { key: "font", label: "Font" },
  { key: "colors", label: "Colors" },
  { key: "header", label: "Header" },
  { key: "photo", label: "Photo" },
  { key: "footer", label: "Footer" },
  { key: "sections", label: "Sections" },
];

const PALETTES = [
  { name: "Classic Blue", primary: "#2563eb", secondary: "#64748b" },
  { name: "Navy", primary: "#1e3a5f", secondary: "#5b7a99" },
  { name: "Emerald", primary: "#047857", secondary: "#6b8f81" },
  { name: "Burgundy", primary: "#7f1d2d", secondary: "#9a6b73" },
  { name: "Charcoal", primary: "#374151", secondary: "#6b7280" },
  { name: "Purple", primary: "#6d28d9", secondary: "#8b7fb0" },
  { name: "Teal", primary: "#0f766e", secondary: "#5f9a94" },
  { name: "Black & White", primary: "#111111", secondary: "#555555" },
];

// Associations de polices cohérentes : titres + corps
const FONT_PAIRS = [
  { id: "clean", label: "Clean · Inter", heading: "Inter", body: "Inter" },
  { id: "modern", label: "Modern · Montserrat + Open Sans", heading: "Montserrat", body: "Open Sans" },
  { id: "classic", label: "Classic · Playfair + Lato", heading: "Playfair Display", body: "Lato" },
  { id: "editorial", label: "Editorial · Merriweather + Roboto", heading: "Merriweather", body: "Roboto" },
  { id: "friendly", label: "Friendly · Poppins + Open Sans", heading: "Poppins", body: "Open Sans" },
];

const ORDER_LABELS = { summary: "Summary", experience: "Experience", education: "Education", skills: "Skills", languages: "Languages", certifications: "Certificates" };

const SECTION_TOGGLES = [
  ["summary", "Summary"],
  ["experience", "Work experience"],
  ["education", "Education"],
  ["skills", "Skills"],
  ["languages", "Languages"],
  ["certifications", "Certificates"],
  ["interests", "Interests"],
  ["awards", "Awards"],
];

// Miniature d'un modèle : la page réelle (559 × 794 px) réduite
const TemplateThumb = memo(function TemplateThumb({ template, design, cv, selected, onSelect }) {
  // chaque miniature montre le modèle avec ses couleurs, sauf si l'utilisateur a choisi les siennes
  const thumbDesign = useMemo(() => ({ ...designForTemplate(design, template.id), zoom: 100 }), [design, template.id]);
  return (
    <button type="button" className={`ed-template ${selected ? "is-on" : ""}`} aria-pressed={selected} onClick={() => onSelect(template.id)}>
      <span className="ed-template-page" aria-hidden="true">
        <span className="ed-template-inner">
          <ResumeDocument template={template} design={thumbDesign} cv={cv} />
        </span>
      </span>
      <span className="ed-template-name">{template.name}</span>
    </button>
  );
});

export default function EditorPanels({
  form,
  design,
  templateId,
  thumbCv,
  photoShown,
  template,
  layoutFilter,
  setSection,
  setDesign,
  onTemplate,
  onLayoutFilter,
  onPickPhoto,
  onBrowseTemplates,
}) {
  const deferredCv = useDeferredValue(thumbCv);
  const set = (section) => (value) => setSection(section, value);
  const visibleTemplates = TEMPLATES.filter((template) => layoutFilter === "all" || templateKind(template) === layoutFilter);
  const textPt = (6.9 * design.fontScale) / 100; // taille réelle imprimée (pt) du texte courant
  const order = (design.sectionOrder ?? DEFAULT_SECTION_ORDER).filter((key) => ORDER_LABELS[key]);
  function moveSection(index, delta) {
    const next = [...order];
    [next[index], next[index + delta]] = [next[index + delta], next[index]];
    setDesign("sectionOrder", next);
  }

  return (
    <>
      {/* ----- CONTENT ----- */}
      <PanelCard id="personal" title="Personal details">
        <PersonalInfo
          data={form.personalInfo}
          onChange={set("personalInfo")}
          title={form.careerGoal.targetJobTitle ?? ""}
          onTitleChange={(value) => setSection("careerGoal", (previous) => ({ ...previous, targetJobTitle: value }))}
          compact
        />
      </PanelCard>

      <PanelCard id="summary" title="Summary">
        <Summary data={form.summary} onChange={set("summary")} />
      </PanelCard>

      <PanelCard id="experience" title="Experience">
        <Experience
          experienceType={form.experienceType}
          onExperienceTypeChange={set("experienceType")}
          entries={form.experience}
          onChange={set("experience")}
        />
      </PanelCard>

      <PanelCard id="education" title="Education">
        <Education entries={form.education} onChange={set("education")} />
      </PanelCard>

      <PanelCard id="skills" title="Skills">
        <Skills data={form.skills} onChange={set("skills")} />
      </PanelCard>

      <PanelCard id="languages" title="Languages & more">
        <Languages data={form.languages} onChange={set("languages")} />
      </PanelCard>

      {/* ----- DESIGN ----- */}
      <PanelCard id="document" title="Document">
        <Choice
          label="Language of the CV"
          options={CV_LANGUAGES.map((language) => ({ value: language.id, label: language.label }))}
          value={design.language}
          onChange={(value) => setDesign("language", value)}
        />
        <p className="ed-note">Section titles (Education, Skills…) and “Present” follow this language. Your own text is never translated.</p>
        <div className="ed-label">Page format</div>
        <div className="ed-static">A4 · 210 × 297 mm</div>
      </PanelCard>

      <PanelCard id="templates" title="Templates" note="Change the whole design with one click. Your content stays.">
        <div className="ed-template-grid">
          {visibleTemplates.map((template) => (
            <TemplateThumb
              key={template.id}
              template={template}
              design={design}
              cv={deferredCv}
              selected={template.id === templateId}
              onSelect={onTemplate}
            />
          ))}
        </div>
        <button className="ed-link" type="button" onClick={onBrowseTemplates}>Browse all templates…</button>
      </PanelCard>

      <PanelCard id="layout" title="Layout">
        <Choice
          label="Columns"
          options={[
            { value: "all", label: "All" },
            { value: "one", label: "One" },
            { value: "two", label: "Two" },
          ]}
          value={layoutFilter}
          onChange={onLayoutFilter}
        />
        <p className="ed-note">“One” keeps a single column. “Two” uses a sidebar. Pick a layout, then choose a template above.</p>
      </PanelCard>

      <PanelCard id="fontsize" title="Font size">
        <RangeRow
          label="Text size"
          display={`${Number(textPt.toFixed(1))} pt`}
          value={design.fontScale}
          min={70}
          max={140}
          step={5}
          onChange={(value) => setDesign("fontScale", value)}
        />
        <RangeRow
          label="Full name"
          display={`${design.nameScale}%`}
          value={design.nameScale}
          min={70}
          max={160}
          step={5}
          onChange={(value) => setDesign("nameScale", value)}
        />
        <RangeRow
          label="Section headings"
          display={`${design.headingScale}%`}
          value={design.headingScale}
          min={70}
          max={160}
          step={5}
          onChange={(value) => setDesign("headingScale", value)}
        />
        <p className="ed-note">Only the text changes. The page stays A4, and a longer CV flows onto a second page.</p>
      </PanelCard>

      <PanelCard id="spacing" title="Spacing">
        <RangeRow
          label="Line height"
          display={design.lineHeight ? design.lineHeight.toFixed(1) : "Template"}
          value={design.lineHeight ?? 1.4}
          min={1}
          max={2}
          step={0.1}
          onChange={(value) => setDesign("lineHeight", value)}
        />
        <RangeRow
          label="Space between sections"
          display={design.sectionGap != null ? `${design.sectionGap} px` : "Template"}
          value={design.sectionGap ?? 12}
          min={4}
          max={32}
          step={2}
          onChange={(value) => setDesign("sectionGap", value)}
        />
        <RangeRow
          label="Space between entries"
          display={design.entryGap != null ? `${design.entryGap} px` : "Template"}
          value={design.entryGap ?? 11}
          min={0}
          max={28}
          step={1}
          onChange={(value) => setDesign("entryGap", value)}
        />
        <button className="ed-link" type="button" onClick={() => setDesign({ lineHeight: null, sectionGap: null, entryGap: null })}>
          Reset to the template’s spacing
        </button>
      </PanelCard>

      <PanelCard id="entries" title="Entries">
        <Choice
          label="Date position"
          options={[
            { value: "right", label: "Right" },
            { value: "left", label: "Left" },
            { value: "below", label: "Below title" },
          ]}
          value={design.datePos}
          onChange={(value) => setDesign("datePos", value)}
        />
        <Choice
          label="Bullet style"
          options={[
            { value: "disc", label: "Dots" },
            { value: "dash", label: "Dashes" },
            { value: "none", label: "None" },
          ]}
          value={design.bullets}
          onChange={(value) => setDesign("bullets", value)}
        />
      </PanelCard>

      <PanelCard id="headings" title="Section headings">
        <Choice
          label="Capitalization"
          options={[
            { value: "default", label: "Template" },
            { value: "upper", label: "Uppercase" },
            { value: "capitalize", label: "Capitalize" },
          ]}
          value={design.headingCase}
          onChange={(value) => setDesign("headingCase", value)}
        />
      </PanelCard>

      <PanelCard id="font" title="Font" note="Pick a ready-made pairing, or choose each font yourself.">
        <Choice
          label="Font pairs"
          columns={2}
          options={FONT_PAIRS.map((pair) => ({ value: pair.id, label: pair.label }))}
          value={FONT_PAIRS.find((pair) => pair.heading === design.headingFont && pair.body === design.typography)?.id ?? ""}
          onChange={(id) => {
            const pair = FONT_PAIRS.find((item) => item.id === id);
            setDesign({ typography: pair.body, headingFont: pair.heading, typographyCustom: true });
          }}
        />
        <div className="field">
          <label htmlFor="ed-body-font">Body font</label>
          <select id="ed-body-font" value={design.typography} onChange={(event) => setDesign({ typography: event.target.value, typographyCustom: true })}>
            {TYPOGRAPHIES.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ed-heading-font">Heading font</label>
          <select id="ed-heading-font" value={design.headingFont ?? "same"} onChange={(event) => setDesign("headingFont", event.target.value)}>
            <option value="same">Same as body font</option>
            {TYPOGRAPHIES.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </div>
      </PanelCard>

      <PanelCard id="colors" title="Colors" note="Primary colors titles, lines and accents. The other colors are optional.">
        <div className="ed-label">Palettes</div>
        <div className="ed-palettes">
          {PALETTES.map((palette) => (
            <button
              key={palette.name}
              type="button"
              className={`ed-palette ${design.accent === palette.primary ? "is-on" : ""}`}
              aria-pressed={design.accent === palette.primary}
              onClick={() => setDesign({ accent: palette.primary, secondary: palette.secondary, accentCustom: true })}
            >
              <span className="ed-palette-dots"><i style={{ background: palette.primary }} /><i style={{ background: palette.secondary }} /></span>
              {palette.name}
            </button>
          ))}
        </div>
        <div className="ed-colors">
          {[
            ["Primary", "accent", design.accent, "#2563eb"],
            ["Secondary", "secondary", design.secondary, "#64748b"],
            ["Text", "textColor", design.textColor, "#1f2937"],
            ["Background", "background", design.background, "#ffffff"],
          ].map(([label, key, value, fallback]) => (
            <div className="ed-color" key={key}>
              <label className="ed-color-pick">
                <input type="color" value={value || fallback} aria-label={`${label} color`} onChange={(event) => setDesign(key === "accent" ? { accent: event.target.value, accentCustom: true } : { [key]: event.target.value })} />
                <span style={{ background: value || fallback }} />
              </label>
              <span className="ed-color-text">
                <strong>{label}</strong>
                <small>{value ? value.toUpperCase() : "Template"}</small>
              </span>
              {key !== "accent" && value && (
                <button className="ed-link" type="button" onClick={() => setDesign(key, null)}>Reset</button>
              )}
            </div>
          ))}
        </div>
      </PanelCard>

      <PanelCard id="header" title="Header" note="Choose which details appear on the CV. They are all kept, whatever you hide.">
        {[
          ["email", "Email"],
          ["phone", "Phone"],
          ["address", "Address"],
          ["location", "City & country"],
          ["age", "Age", "Only templates designed for it show the age."],
          ["links", "Links (LinkedIn, website)"],
        ].map(([key, label, hint]) => (
          <Toggle key={key} label={label} hint={hint} checked={design.header[key] !== false} onChange={(checked) => setDesign("header", { ...design.header, [key]: checked })} />
        ))}
      </PanelCard>

      <PanelCard id="photo" title="Photo" note={template.photo === false ? `${template.name} is a no-photo template: it never shows a photo. Switch template to use one.` : undefined}>
        <div className="ed-photo">
          <span className="ed-photo-frame">{photoShown ? <img src={photoShown} alt="Your photo" /> : <span aria-hidden="true">+</span>}</span>
          <div className="ed-photo-actions">
            <label className="ed-btn">
              {photoShown ? "Change photo" : "Add photo"}
              <input
                type="file"
                accept="image/png,image/jpeg,image/webp"
                onChange={(event) => {
                  const file = event.target.files?.[0];
                  event.target.value = "";
                  if (file) onPickPhoto(file);
                }}
              />
            </label>
            {photoShown && (
              <button className="ed-link" type="button" onClick={() => setDesign("photo", false)}>
                Remove from this CV
              </button>
            )}
          </div>
        </div>
        <Toggle label="Show the photo" checked={design.showPhoto !== false} onChange={(checked) => setDesign("showPhoto", checked)} />
        <RangeRow label="Photo size" display={`${design.photoScale ?? 100}%`} value={design.photoScale ?? 100} min={70} max={140} step={5} onChange={(value) => setDesign("photoScale", value)} />
        <Choice
          label="Shape"
          options={[
            { value: "default", label: "Template" },
            { value: "rounded", label: "Rounded" },
            { value: "square", label: "Square" },
          ]}
          value={design.photoShape}
          onChange={(value) => setDesign("photoShape", value)}
        />
      </PanelCard>

      <PanelCard id="footer" title="Footer" note="Printed at the bottom of every page of the PDF.">
        <Toggle label="Page numbers" checked={design.footer.pageNumber !== false} onChange={(checked) => setDesign("footer", { ...design.footer, pageNumber: checked })} />
        <Toggle label="Name" checked={design.footer.name !== false} onChange={(checked) => setDesign("footer", { ...design.footer, name: checked })} />
        <Toggle label="Email" checked={Boolean(design.footer.email)} onChange={(checked) => setDesign("footer", { ...design.footer, email: checked })} />
      </PanelCard>

      <PanelCard id="sections" title="Sections" note="Hide a section without deleting what you wrote.">
        {SECTION_TOGGLES.map(([key, label]) => (
          <Toggle key={key} label={label} checked={design.sections[key] !== false} onChange={(checked) => setDesign("sections", { ...design.sections, [key]: checked })} />
        ))}
        <div className="ed-label">Order</div>
        <ol className="ed-order">
          {order.map((key, index) => (
            <li key={key}>
              <span>{ORDER_LABELS[key]}</span>
              <button type="button" aria-label={`Move ${ORDER_LABELS[key]} up`} disabled={index === 0} onClick={() => moveSection(index, -1)}>↑</button>
              <button type="button" aria-label={`Move ${ORDER_LABELS[key]} down`} disabled={index === order.length - 1} onClick={() => moveSection(index, 1)}>↓</button>
            </li>
          ))}
        </ol>
        <p className="ed-note">The order applies to single-column templates. Sidebar templates keep their own structure.</p>
      </PanelCard>
    </>
  );
}
