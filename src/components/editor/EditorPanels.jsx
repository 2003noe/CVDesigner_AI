import { memo, useDeferredValue, useMemo } from "react";
import PersonalInfo from "../steps/PersonalInfo";
import Summary from "../steps/Summary";
import Education from "../steps/Education";
import Experience from "../steps/Experience";
import Skills from "../steps/Skills";
import Languages from "../steps/Languages";
import { ResumeDocument, TEMPLATES, ACCENTS, TYPOGRAPHIES } from "../templates/TemplatePage";
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
  layoutFilter,
  setSection,
  setDesign,
  onTemplate,
  onLayoutFilter,
  onPickPhoto,
}) {
  const deferredCv = useDeferredValue(thumbCv);
  const set = (section) => (value) => setSection(section, value);
  const visibleTemplates = TEMPLATES.filter((template) => layoutFilter === "all" || templateKind(template) === layoutFilter);
  const textPt = (10 * design.fontScale) / 100;

  return (
    <>
      {/* ----- CONTENT ----- */}
      <PanelCard id="personal" title="Personal details">
        <div className="field">
          <label htmlFor="ed-job-title">Job title</label>
          <input
            id="ed-job-title"
            type="text"
            placeholder="e.g. Agronomist"
            value={form.careerGoal.targetJobTitle ?? ""}
            onChange={(event) => setSection("careerGoal", (previous) => ({ ...previous, targetJobTitle: event.target.value }))}
          />
        </div>
        <PersonalInfo data={form.personalInfo} onChange={set("personalInfo")} compact />
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

      <PanelCard id="font" title="Font">
        <div className="field">
          <label htmlFor="ed-body-font">Body font</label>
          <select id="ed-body-font" value={design.typography} onChange={(event) => setDesign({ typography: event.target.value, typographyCustom: true })}>
            {TYPOGRAPHIES.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </div>
        <div className="field">
          <label htmlFor="ed-name-font">Name font</label>
          <select id="ed-name-font" value={design.nameFont} onChange={(event) => setDesign("nameFont", event.target.value)}>
            <option value="same">Same as body font</option>
            {TYPOGRAPHIES.map((font) => (
              <option key={font}>{font}</option>
            ))}
          </select>
        </div>
      </PanelCard>

      <PanelCard id="colors" title="Colors">
        <div className="ed-swatches">
          {ACCENTS.map((accent) => (
            <button
              key={accent.color}
              type="button"
              className={`ed-swatch ${design.accent === accent.color ? "is-on" : ""}`}
              style={{ background: accent.color }}
              aria-label={accent.name}
              aria-pressed={design.accent === accent.color}
              onClick={() => setDesign({ accent: accent.color, accentCustom: true })}
            />
          ))}
          <label className="ed-swatch ed-swatch-custom" title="Custom color">
            <input type="color" value={design.accent} onChange={(event) => setDesign({ accent: event.target.value, accentCustom: true })} aria-label="Custom color" />
          </label>
        </div>
      </PanelCard>

      <PanelCard id="header" title="Header" note="Choose which contact details appear on the CV.">
        {[
          ["email", "Email"],
          ["phone", "Phone"],
          ["location", "Location"],
          ["links", "Links (LinkedIn, portfolio)"],
        ].map(([key, label]) => (
          <Toggle key={key} label={label} checked={design.header[key] !== false} onChange={(checked) => setDesign("header", { ...design.header, [key]: checked })} />
        ))}
      </PanelCard>

      <PanelCard id="photo" title="Photo">
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
        <p className="ed-note">You can crop the photo after choosing it. It only changes this CV’s photo, not your profile photo.</p>
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
      </PanelCard>
    </>
  );
}
