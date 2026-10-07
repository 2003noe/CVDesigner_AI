// Lit une photo choisie par l'utilisateur et la réduit (max 600 px, JPEG) :
// la photo du CV est stockée dans le JSON du CV (Supabase), il faut qu'elle reste légère.
const MAX_BYTES = 5 * 1024 * 1024;
const MAX_SIDE = 600;

export function readPhotoFile(file) {
  return new Promise((resolve) => {
    if (!file.type.startsWith("image/")) {
      resolve({ error: "Please choose a JPG, PNG or WebP image." });
      return;
    }
    if (file.size > MAX_BYTES) {
      resolve({ error: "The photo must be 5 MB or smaller." });
      return;
    }
    const url = URL.createObjectURL(file);
    const image = new Image();
    image.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(image.width, image.height));
      const canvas = document.createElement("canvas");
      canvas.width = Math.round(image.width * scale);
      canvas.height = Math.round(image.height * scale);
      const context = canvas.getContext("2d");
      context.fillStyle = "#fff"; // fond blanc pour les PNG transparents
      context.fillRect(0, 0, canvas.width, canvas.height);
      context.drawImage(image, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve({ dataUrl: canvas.toDataURL("image/jpeg", 0.88) });
    };
    image.onerror = () => {
      URL.revokeObjectURL(url);
      resolve({ error: "Could not read this image." });
    };
    image.src = url;
  });
}
