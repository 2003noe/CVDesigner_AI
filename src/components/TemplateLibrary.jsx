import TopNav from "./TopNav";
import TemplatePicker from "./templates/TemplatePicker";
import { SAMPLE_CV } from "../lib/cvData";

/** Bibliothèque de modèles (page « Templates ») : 4 modèles, puis « More Templates » */
export default function TemplateLibrary({ onNavigate, isAuthed, onUseTemplate }) {
  return (
    <div className="app-shell tl">
      <TopNav onNavigate={onNavigate} isAuthed={isAuthed} />
      <main className="tl-main">
        <header>
          <h1>Templates</h1>
          <p>Every template presents the same content. Pick a design now, change it whenever you like.</p>
        </header>
        <TemplatePicker cv={SAMPLE_CV} onUse={onUseTemplate} />
      </main>
    </div>
  );
}
