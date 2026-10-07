import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "../lib/supabase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [passwordRecovery, setPasswordRecovery] = useState(false);

  useEffect(() => {
    // 1) Récupère la session existante (session persistante après rechargement)
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setLoading(false);
    });

    // 2) Écoute les changements : connexion, déconnexion, lien "mot de passe oublié"...
    // Important : pas de "await supabase..." dans ce callback (risque de blocage).
    const { data: sub } = supabase.auth.onAuthStateChange((event, newSession) => {
      setSession(newSession);
      if (event === "PASSWORD_RECOVERY") setPasswordRecovery(true);
      if (event === "SIGNED_OUT") setPasswordRecovery(false);
    });

    return () => sub.subscription.unsubscribe();
  }, []);

  const value = {
    session,
    user: session?.user ?? null,
    loading,
    passwordRecovery,

    // Chaque fonction renvoie { data, error } : à toi d'afficher error.message.
    signUp: ({ fullName, email, password }) =>
      supabase.auth.signUp({
        email,
        password,
        options: {
          data: { full_name: fullName }, // lu par le trigger SQL pour remplir "profiles"
          emailRedirectTo: window.location.origin,
        },
      }),

    signIn: ({ email, password }) =>
      supabase.auth.signInWithPassword({ email, password }),

    // provider : "google" ou "linkedin_oidc"
    signInWithOAuth: (provider) =>
      supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo: window.location.origin },
      }),

    resetPassword: (email) =>
      supabase.auth.resetPasswordForEmail(email, {
        redirectTo: window.location.origin,
      }),

    updatePassword: (newPassword) =>
      supabase.auth.updateUser({ password: newPassword }),

    finishRecovery: () => setPasswordRecovery(false),

    signOut: () => supabase.auth.signOut(),
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth doit être utilisé à l'intérieur de <AuthProvider>.");
  return ctx;
}
