import { createContext, useLayoutEffect, useRef, useContext } from "react";

// Fourni par l'éditeur : quand il existe, les textes du CV deviennent modifiables sur place.
// Valeur : { onEdit(field, text, id), focusRequest, clearFocusRequest }
export const EditContext = createContext(null);

function placeCaretAtEnd(element) {
  const range = document.createRange();
  range.selectNodeContents(element);
  range.collapse(false);
  const selection = window.getSelection();
  selection.removeAllRanges();
  selection.addRange(range);
}

/**
 * Texte du CV modifiable sur place.
 * f : champ (name, role, summary, job.role, job.company) · v : valeur affichée · ph : texte d'invite
 * Hors éditeur (miniatures, galerie, PDF) il rend simplement le texte, sans balise ajoutée.
 */
export function E({ f, v = "", ph = "", id = null, readOnly = false }) {
  const ctx = useContext(EditContext);
  const ref = useRef(null);
  const value = v ?? "";

  // Le texte est écrit à la main dans le DOM (et seulement s'il diffère) : ainsi le curseur
  // ne saute pas pendant la frappe, ce qui arriverait si React réécrivait le contenu.
  useLayoutEffect(() => {
    const element = ref.current;
    if (element && element.textContent !== value) element.textContent = value;
  }, [value]);

  // Demande de focus (ex. après la première lettre tapée sur la page vierge)
  useLayoutEffect(() => {
    const element = ref.current;
    const request = ctx?.focusRequest;
    if (element && request && request.f === f && (request.id ?? null) === (id ?? null)) {
      element.focus();
      placeCaretAtEnd(element);
      ctx.clearFocusRequest();
    }
  });

  if (!ctx || readOnly) return value;

  return (
    <span
      ref={ref}
      className="cv-e"
      contentEditable
      suppressContentEditableWarning
      spellCheck={false}
      role="textbox"
      aria-label={ph || f}
      data-ph={ph}
      data-field={f}
      onInput={(event) => ctx.onEdit(f, event.currentTarget.textContent, id)}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          event.preventDefault();
          event.currentTarget.blur();
        }
      }}
      onPaste={(event) => {
        event.preventDefault();
        const text = event.clipboardData.getData("text/plain").replace(/\s+/g, " ");
        document.execCommand("insertText", false, text);
      }}
    />
  );
}
