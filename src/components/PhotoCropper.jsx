import { useEffect, useRef, useState } from "react";
import "../photo-cropper.css";

const FRAME = 300; // taille de la zone de cadrage affichée (px)
const OUTPUT = 600; // taille de la photo enregistrée (px)
const MAX_BYTES = 5 * 1024 * 1024;

function clamp(value, min, max) {
  return Math.min(max, Math.max(min, value));
}

/**
 * Fenêtre de cadrage de la photo : on déplace l'image (souris ou doigt) et on zoome,
 * puis « Use photo » renvoie un carré JPEG de 600 px via onDone(dataUrl).
 */
export default function PhotoCropper({ file, onCancel, onDone }) {
  const [image, setImage] = useState(null); // { element, src }
  const [error, setError] = useState("");
  const [zoom, setZoom] = useState(1);
  const [offset, setOffset] = useState({ x: 0, y: 0 });
  const drag = useRef(null);

  useEffect(() => {
    // En développement, React monte puis démonte puis remonte le composant (StrictMode) :
    // sans ce drapeau, le premier chargement (annulé) affichait à tort « Could not read this image ».
    let cancelled = false;
    setError("");
    setImage(null);
    if (!file.type.startsWith("image/")) {
      setError("Please choose a JPG, PNG or WebP image.");
      return undefined;
    }
    if (file.size > MAX_BYTES) {
      setError("The photo must be 5 MB or smaller.");
      return undefined;
    }
    const src = URL.createObjectURL(file);
    const element = new Image();
    element.onload = () => {
      if (cancelled) return;
      const base = Math.max(FRAME / element.width, FRAME / element.height);
      setImage({ element, src, base });
      setOffset({ x: (FRAME - element.width * base) / 2, y: (FRAME - element.height * base) / 2 });
    };
    element.onerror = () => {
      if (!cancelled) setError("Could not read this image. Try a JPG or PNG file.");
    };
    element.src = src;
    return () => {
      cancelled = true;
      URL.revokeObjectURL(src);
    };
  }, [file]);

  const scale = image ? image.base * zoom : 1;
  const width = image ? image.element.width * scale : 0;
  const height = image ? image.element.height * scale : 0;

  // L'image doit toujours couvrir entièrement le cadre
  const keepInside = (x, y, w, h) => ({ x: clamp(x, FRAME - w, 0), y: clamp(y, FRAME - h, 0) });

  function changeZoom(nextZoom) {
    if (!image) return;
    const next = clamp(nextZoom, 1, 4);
    const nextScale = image.base * next;
    // on garde le centre du cadre au même endroit de l'image
    const centerX = (FRAME / 2 - offset.x) / scale;
    const centerY = (FRAME / 2 - offset.y) / scale;
    const w = image.element.width * nextScale;
    const h = image.element.height * nextScale;
    setZoom(next);
    setOffset(keepInside(FRAME / 2 - centerX * nextScale, FRAME / 2 - centerY * nextScale, w, h));
  }

  function onPointerDown(event) {
    event.currentTarget.setPointerCapture(event.pointerId);
    drag.current = { x: event.clientX, y: event.clientY, start: offset };
  }

  function onPointerMove(event) {
    if (!drag.current) return;
    const { x, y, start } = drag.current;
    setOffset(keepInside(start.x + event.clientX - x, start.y + event.clientY - y, width, height));
  }

  function onPointerUp() {
    drag.current = null;
  }

  function onWheel(event) {
    changeZoom(zoom - event.deltaY * 0.002);
  }

  function confirm() {
    const canvas = document.createElement("canvas");
    canvas.width = OUTPUT;
    canvas.height = OUTPUT;
    const context = canvas.getContext("2d");
    context.fillStyle = "#fff";
    context.fillRect(0, 0, OUTPUT, OUTPUT);
    const sourceSize = FRAME / scale;
    context.drawImage(image.element, -offset.x / scale, -offset.y / scale, sourceSize, sourceSize, 0, 0, OUTPUT, OUTPUT);
    onDone(canvas.toDataURL("image/jpeg", 0.9));
  }

  return (
    <div className="cropper-backdrop" role="dialog" aria-modal="true" aria-label="Crop your photo">
      <div className="cropper-dialog">
        <h2>Crop your photo</h2>
        <p>Drag the photo to position it, and zoom so your face fits inside the circle.</p>

        {error ? (
          <p className="photo-error">{error}</p>
        ) : (
          <div
            className="cropper-frame"
            style={{ width: FRAME, height: FRAME }}
            onPointerDown={onPointerDown}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
            onPointerCancel={onPointerUp}
            onWheel={onWheel}
          >
            {image && (
              <img
                src={image.src}
                alt=""
                draggable={false}
                style={{ left: offset.x, top: offset.y, width, height }}
              />
            )}
            <div className="cropper-guide" />
          </div>
        )}

        {!error && (
          <label className="cropper-zoom">
            <span>−</span>
            <input
              type="range"
              min="1"
              max="4"
              step="0.01"
              value={zoom}
              onChange={(e) => changeZoom(Number(e.target.value))}
              aria-label="Zoom"
            />
            <span>+</span>
          </label>
        )}

        <div className="cropper-actions">
          <button className="btn btn-secondary" type="button" onClick={onCancel}>
            Cancel
          </button>
          <button className="btn btn-primary" type="button" onClick={confirm} disabled={!image || Boolean(error)}>
            Use photo
          </button>
        </div>
      </div>
    </div>
  );
}
