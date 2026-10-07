import { createClient } from "@supabase/supabase-js";

const url = import.meta.env.VITE_SUPABASE_URL;
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY;

if (!url || !key) {
  throw new Error(
    "Variables manquantes : VITE_SUPABASE_URL et VITE_SUPABASE_PUBLISHABLE_KEY dans .env.local (puis relancer npm run dev)."
  );
}

export const supabase = createClient(url, key, {
  auth: {
    // PKCE : le retour OAuth / email arrive dans l'URL sous la forme ?code=...
    // (et non dans le #hash, qui est déjà utilisé par la navigation de l'app)
    flowType: "pkce",
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
  },
});
