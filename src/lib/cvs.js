import { supabase } from "./supabase";

// "snapshot" = { templateId, status, content }
// content = { form, templateName, templateDesigns, lastStep }

function titleFrom(snapshot) {
  const name = snapshot.content?.form?.personalInfo?.fullName?.trim();
  return name ? `CV - ${name}` : "Untitled CV";
}

// Le CV modifié le plus récemment (RLS garantit qu'il s'agit d'un CV de l'utilisateur connecté)
export function fetchLatestCv() {
  return supabase
    .from("cvs")
    .select("id, title, template_id, status, content, updated_at")
    .order("updated_at", { ascending: false })
    .limit(1)
    .maybeSingle();
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

// Le titre n'est pas modifié ici (il sera renommable depuis le futur dashboard "Mes CV")
export function updateCv(id, snapshot) {
  return supabase
    .from("cvs")
    .update({
      template_id: snapshot.templateId,
      status: snapshot.status,
      content: snapshot.content,
    })
    .eq("id", id);
}
