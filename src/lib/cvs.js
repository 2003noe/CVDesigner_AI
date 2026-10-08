import { supabase } from "./supabase";

// "snapshot" = { templateId, status, content }
// content = { form, templateName, templateDesigns, lastStep, finished, customTitle }

// Titre affiché dans « My CVs » : le nom choisi par l'utilisateur, sinon « CV - <nom complet> »
export function titleFrom(snapshot) {
  const custom = snapshot.content?.customTitle?.trim();
  if (custom) return custom;
  const name = snapshot.content?.form?.personalInfo?.fullName?.trim();
  return name ? `CV - ${name}` : "Untitled CV";
}

const COLUMNS = "id, title, template_id, status, content, updated_at";

// Tous les CV de l'utilisateur connecté, le plus récent d'abord (RLS filtre par utilisateur)
export function listCvs() {
  return supabase.from("cvs").select(COLUMNS).order("updated_at", { ascending: false });
}

export function fetchCvById(id) {
  return supabase.from("cvs").select(COLUMNS).eq("id", id).maybeSingle();
}

export function createCv(userId, snapshot) {
  return supabase
    .from("cvs")
    .insert({
      user_id: userId,
      title: titleFrom(snapshot),
      template_id: snapshot.templateId,
      status: snapshot.status,
      content: snapshot.content,
    })
    .select("id")
    .single();
}

export function updateCv(id, snapshot) {
  return supabase
    .from("cvs")
    .update({
      title: titleFrom(snapshot),
      template_id: snapshot.templateId,
      status: snapshot.status,
      content: snapshot.content,
    })
    .eq("id", id);
}

export async function renameCv(id, title) {
  const { data, error } = await supabase.from("cvs").select("content").eq("id", id).single();
  if (error) return { error };
  return supabase
    .from("cvs")
    .update({ title, content: { ...(data.content ?? {}), customTitle: title } })
    .eq("id", id);
}

export function duplicateCv(userId, row) {
  const title = `${row.title || "Untitled CV"} (copy)`;
  return supabase
    .from("cvs")
    .insert({
      user_id: userId,
      title,
      template_id: row.template_id,
      status: row.status,
      content: { ...(row.content ?? {}), customTitle: title },
    })
    .select("id")
    .single();
}

export function deleteCv(id) {
  return supabase.from("cvs").delete().eq("id", id).select("id");
}
