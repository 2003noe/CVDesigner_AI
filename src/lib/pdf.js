// Génère le PDF du CV directement (sans passer par la fenêtre d'impression du navigateur) :
//  - le CV remplit toute la page A4, sans marge ni en-tête/pied de page ;
//  - un CV plus long qu'une page est découpé sur plusieurs pages A4 ;
//  - une couche de texte invisible est ajoutée par-dessus l'image, pour que le texte reste
//    sélectionnable / lisible par les logiciels de recrutement (ATS).
//
// Les bibliothèques sont chargées à la demande pour ne pas alourdir le chargement de l'application.

const A4_MM = { width: 210, height: 297 };
const CAPTURE_SCALE = 3; // netteté de l'image (≈ 290 dpi sur A4)

function addTextLayer(pdf, root, pageIndex, pageHeightPx, mmPerPx) {
  const rootBox = root.getBoundingClientRect();
  const pageTop = pageIndex * pageHeightPx;
  const walker = document.createTreeWalker(root, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, " ").trim();
    if (!text) continue;
    range.selectNodeContents(node);
    const rects = Array.from(range.getClientRects()).filter((r) => r.width > 0 && r.height > 0);
    if (!rects.length) continue;

    // Un bloc de texte par ligne visuelle : on répartit les mots selon les lignes
    const words = text.split(" ");
    const perLine = Math.ceil(words.length / rects.length);
    rects.forEach((rect, lineIndex) => {
      const lineText = words.slice(lineIndex * perLine, (lineIndex + 1) * perLine).join(" ");
      if (!lineText) return;
      const top = rect.top - rootBox.top;
      if (top < pageTop || top >= pageTop + pageHeightPx) return; // appartient à une autre page
      try {
        pdf.setFontSize(Math.max(4, rect.height * mmPerPx * 2.83)); // mm → pt
        pdf.text(lineText, (rect.left - rootBox.left) * mmPerPx, (top - pageTop + rect.height * 0.8) * mmPerPx, {
          renderingMode: "invisible",
        });
      } catch {
        /* un caractère non supporté ne doit jamais bloquer le téléchargement */
      }
    });
  }
}

/**
 * @param {HTMLElement} source  l'élément .resume-document affiché à l'écran
 * @param {string} filename     nom du fichier (sans .pdf)
 * @param {{ footer?: (page: number, total: number) => string | null }} [options]
 *        footer : si fourni, le pied de page du modèle est retiré et dessiné sur chaque page du PDF
 */
export async function downloadCvPdf(source, filename, options = {}) {
  const [{ default: html2canvas }, { jsPDF }] = await Promise.all([import("html2canvas-pro"), import("jspdf")]);

  // On travaille sur une copie hors écran, à l'échelle réelle (indépendante du zoom de l'aperçu)
  const host = document.createElement("div");
  host.className = "final-cv-paper final-cv-capture";
  host.style.cssText = "position:fixed;left:-10000px;top:0;zoom:1;padding:0;overflow:visible;background:#fff;";
  host.style.setProperty("--final-zoom", "1");
  const clone = source.cloneNode(true);
  // Le PDF ne garde rien de l'édition sur place (zones modifiables, invites, contours)
  clone.classList.remove("cv-edit-mode");
  clone.querySelectorAll("[contenteditable]").forEach((element) => element.removeAttribute("contenteditable"));
  clone.querySelectorAll(".cv-e").forEach((element) => element.removeAttribute("data-ph"));
  if (options.footer) clone.querySelectorAll(".resume-page-number").forEach((element) => element.remove());
  host.appendChild(clone);
  document.body.appendChild(host);

  try {
    if (document.fonts?.ready) await document.fonts.ready;

    const width = clone.offsetWidth;
    const pageHeightPx = parseFloat(getComputedStyle(clone).getPropertyValue("--resume-page-height")) || (width * A4_MM.height) / A4_MM.width;
    const pages = Math.max(1, Math.ceil((clone.scrollHeight - 4) / pageHeightPx));
    // La hauteur est portée à un nombre entier de pages : les barres latérales colorées vont jusqu'en bas
    clone.style.minHeight = `${pages * pageHeightPx}px`;
    clone.style.height = `${pages * pageHeightPx}px`;

    const canvas = await html2canvas(clone, {
      scale: CAPTURE_SCALE,
      backgroundColor: "#ffffff",
      useCORS: true,
      logging: false,
    });

    const pdf = new jsPDF({ unit: "mm", format: "a4", orientation: "portrait", compress: true });
    const mmPerPx = A4_MM.width / width;
    const slicePx = pageHeightPx * CAPTURE_SCALE;

    for (let page = 0; page < pages; page += 1) {
      if (page > 0) pdf.addPage();
      const slice = document.createElement("canvas");
      slice.width = canvas.width;
      slice.height = Math.round(slicePx);
      const context = slice.getContext("2d");
      context.fillStyle = "#fff";
      context.fillRect(0, 0, slice.width, slice.height);
      context.drawImage(canvas, 0, Math.round(page * slicePx), canvas.width, Math.round(slicePx), 0, 0, slice.width, slice.height);
      pdf.addImage(slice.toDataURL("image/jpeg", 0.92), "JPEG", 0, 0, A4_MM.width, A4_MM.height, undefined, "FAST");
      addTextLayer(pdf, clone, page, pageHeightPx, mmPerPx);
      const footerText = options.footer?.(page + 1, pages);
      if (footerText) {
        pdf.setFontSize(7.5);
        pdf.setTextColor(120, 126, 138);
        pdf.text(footerText, A4_MM.width / 2, A4_MM.height - 7, { align: "center" });
      }
    }

    pdf.save(`${filename}.pdf`);
    return { pages };
  } finally {
    document.body.removeChild(host);
  }
}
