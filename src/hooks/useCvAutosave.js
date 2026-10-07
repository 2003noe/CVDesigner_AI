import { useCallback, useEffect, useRef, useState } from "react";
import { fetchLatestCv, createCv, updateCv } from "../lib/cvs";

const AUTOSAVE_DELAY_MS = 1500;

/**
 * Charge le CV le plus récent de l'utilisateur au montage, puis sauvegarde
 * automatiquement chaque modification (avec un délai anti-rafale).
 *
 * - snapshot : { templateId, status, content } — l'état complet à sauvegarder
 * - onLoaded(row) : appelée une fois quand un CV existant a été lu
 *
 * Renvoie { loading, loadError, retryLoad, saveStatus, saveNow }
 * saveStatus : "idle" | "dirty" | "saving" | "saved" | "error"
 */
export function useCvAutosave({ userId, snapshot, onLoaded }) {
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [reloadKey, setReloadKey] = useState(0);
  const [saveStatus, setSaveStatus] = useState("idle");

  const cvIdRef = useRef(null); // id du CV en base (null tant qu'il n'est pas créé)
  const lastSavedRef = useRef(null); // JSON de la dernière version sauvegardée (ou lue)
  const chainRef = useRef(Promise.resolve()); // file d'attente : une sauvegarde à la fois
  const snapshotRef = useRef(snapshot);
  const onLoadedRef = useRef(onLoaded);
  snapshotRef.current = snapshot;
  onLoadedRef.current = onLoaded;

  // 1) Chargement initial
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setLoadError("");
    lastSavedRef.current = null;

    fetchLatestCv().then(({ data, error }) => {
      if (cancelled) return;
      if (error) {
        setLoadError(error.message);
        return;
      }
      cvIdRef.current = data?.id ?? null;
      if (data) onLoadedRef.current(data);
      setLoading(false);
    });

    return () => {
      cancelled = true;
    };
  }, [userId, reloadKey]);

  // 2) Sauvegarde (les appels sont mis en file pour ne jamais créer deux lignes)
  const save = useCallback(() => {
    chainRef.current = chainRef.current.then(async () => {
      if (lastSavedRef.current === null) return { ok: true }; // chargement pas terminé
      const snap = snapshotRef.current;
      const json = JSON.stringify(snap);
      if (json === lastSavedRef.current) return { ok: true }; // rien de nouveau

      setSaveStatus("saving");
      try {
        const result = cvIdRef.current
          ? await updateCv(cvIdRef.current, snap)
          : await createCv(userId, snap);
        if (result.error) throw result.error;
        if (!cvIdRef.current && result.data) cvIdRef.current = result.data.id;
        lastSavedRef.current = json;
        setSaveStatus("saved");
        return { ok: true };
      } catch (error) {
        console.error("Sauvegarde du CV impossible :", error);
        setSaveStatus("error");
        return { ok: false, error };
      }
    });
    return chainRef.current;
  }, [userId]);

  // 3) Sauvegarde automatique après une courte pause dans la saisie
  const json = JSON.stringify(snapshot);
  useEffect(() => {
    if (loading) return;
    if (lastSavedRef.current === null) {
      lastSavedRef.current = json; // 1er rendu après le chargement : point de référence, rien à sauvegarder
      return;
    }
    if (json === lastSavedRef.current) return;
    setSaveStatus("dirty");
    const timer = setTimeout(() => save(), AUTOSAVE_DELAY_MS);
    return () => clearTimeout(timer);
  }, [json, loading, save]);

  // 4) Sauvegarde au mieux quand l'onglet est caché / fermé
  useEffect(() => {
    const onHide = () => {
      if (document.visibilityState === "hidden") save();
    };
    document.addEventListener("visibilitychange", onHide);
    return () => document.removeEventListener("visibilitychange", onHide);
  }, [save]);

  return {
    loading,
    loadError,
    retryLoad: () => setReloadKey((k) => k + 1),
    saveStatus,
    saveNow: save,
  };
}
