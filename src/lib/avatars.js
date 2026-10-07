import { useEffect, useState } from "react";
import { supabase } from "./supabase";

const BUCKET = "avatars";
const MAX_SIZE = 5 * 1024 * 1024; // 5 Mo
const EXTENSIONS = { "image/jpeg": "jpg", "image/png": "png" };

// Renvoie un message d'erreur, ou null si le fichier est valide
export function validateAvatar(file) {
  if (!EXTENSIONS[file.type]) return "Please choose a JPG or PNG image.";
  if (file.size > MAX_SIZE) return "This image is larger than 5 MB.";
  return null;
}

// Envoie la photo dans <user_id>/<uuid>.<ext> et renvoie { path } ou { error }
export async function uploadAvatar(userId, file) {
  const path = `${userId}/${crypto.randomUUID()}.${EXTENSIONS[file.type]}`;
  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, file, { contentType: file.type, upsert: false });
  return error ? { error } : { path };
}

export function removeAvatar(path) {
  return supabase.storage.from(BUCKET).remove([path]);
}

// Le bucket est privé : on affiche la photo avec une URL signée temporaire (1 h)
export function useAvatarUrl(path) {
  const [url, setUrl] = useState(null);

  useEffect(() => {
    if (!path) {
      setUrl(null);
      return;
    }
    let cancelled = false;
    supabase.storage
      .from(BUCKET)
      .createSignedUrl(path, 60 * 60)
      .then(({ data }) => {
        if (!cancelled) setUrl(data?.signedUrl ?? null);
      });
    return () => {
      cancelled = true;
    };
  }, [path]);

  return url;
}
