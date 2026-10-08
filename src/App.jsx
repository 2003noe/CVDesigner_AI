import { useCallback, useEffect, useRef, useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ImportFlow from "./components/ImportFlow";
import CVWizard from "./components/CVWizard";
import TemplatePage from "./components/templates/TemplatePage";
import ResetPassword from "./components/ResetPassword";
import Dashboard from "./components/Dashboard";
import CvEditor from "./components/editor/CvEditor";
import AIPanel from "./components/AIPanel";
import ErrorBoundary from "./components/ErrorBoundary";
import { useAuth } from "./context/AuthContext";

const PAGES = ["landing", "templates", "signin", "signup", "reset-password", "import", "wizard", "dashboard", "editor"];

function pageFromLocation() {
  const requestedPage = window.location.hash.slice(1);
  return PAGES.includes(requestedPage) ? requestedPage : "landing";
}

export default function App() {
  const [page, setPage] = useState(pageFromLocation);
  const [visitedPages, setVisitedPages] = useState(() => new Set([pageFromLocation()]));
  const historyIndex = useRef(0);
  const { user, loading, passwordRecovery } = useAuth();
  // CV ouvert dans l'assistant : id = null pour un nouveau CV ; nonce force un écran neuf à chaque ouverture
  // mode : "editor" (éditeur, par défaut) ou "wizard" (questionnaire guidé). Mémorisé pour survivre à un rechargement.
  const [cvTarget, setCvTarget] = useState(() => {
    try {
      const saved = JSON.parse(window.sessionStorage.getItem("cvTarget") ?? "null");
      if (saved && (saved.mode === "editor" || saved.mode === "wizard")) return { id: saved.id ?? null, mode: saved.mode, nonce: 0 };
    } catch {
      /* stockage indisponible : on repart d'un CV vierge */
    }
    return { id: null, mode: "editor", nonce: 0 };
  });
  const rememberTarget = useCallback((target) => {
    try {
      window.sessionStorage.setItem("cvTarget", JSON.stringify({ id: target.id, mode: target.mode }));
    } catch {
      /* sans importance */
    }
  }, []);
  // Assistant IA global (visible sur toutes les pages)
  const [aiOpen, setAiOpen] = useState(false);
  const [applyHandler, setApplyHandler] = useState(null);
  const registerAiApply = useCallback((handler) => setApplyHandler(() => handler), []);

  useEffect(() => {
    window.history.replaceState({ appPage: page, appIndex: 0 }, "", `#${page}`);

    function handlePopState(event) {
      const destination = PAGES.includes(event.state?.appPage) ? event.state.appPage : "landing";
      historyIndex.current = Number.isInteger(event.state?.appIndex) ? event.state.appIndex : 0;
      setPage(destination);
      setVisitedPages((visited) => new Set(visited).add(destination));
      window.scrollTo(0, 0);
    }

    window.addEventListener("popstate", handlePopState);
    return () => window.removeEventListener("popstate", handlePopState);
  }, []);

  // replace = true : remplace la page courante dans l'historique (utile pour les redirections
  // automatiques, afin que le bouton "retour" ne boucle pas)
  function navigate(nextPage, { replace = false } = {}) {
    if (!PAGES.includes(nextPage) || nextPage === page) return;
    if (replace) {
      window.history.replaceState({ appPage: nextPage, appIndex: historyIndex.current }, "", `#${nextPage}`);
    } else {
      const nextIndex = historyIndex.current + 1;
      historyIndex.current = nextIndex;
      window.history.pushState({ appPage: nextPage, appIndex: nextIndex }, "", `#${nextPage}`);
    }
    setPage(nextPage);
    setVisitedPages((visited) => new Set(visited).add(nextPage));
    window.scrollTo(0, 0);
  }

  // Redirections automatiques selon l'état de connexion
  useEffect(() => {
    if (loading) return;
    if (passwordRecovery && page !== "reset-password") {
      navigate("reset-password", { replace: true }); // lien "mot de passe oublié" cliqué
    } else if (!user && (page === "wizard" || page === "dashboard" || page === "editor")) {
      navigate("signin", { replace: true });          // pages protégées
    } else if (user && (page === "signin" || page === "signup")) {
      navigate("dashboard", { replace: true });       // déjà connecté : on arrive sur « My CVs »
    }
  }, [loading, user, passwordRecovery, page]);

  // Navigation proposée aux écrans : connecté, « Create my CV » mène à « My CVs » (choisir ou créer)
  function go(nextPage, options) {
    navigate(user && nextPage === "wizard" ? "dashboard" : nextPage, options);
  }

  function openCv(id, mode = "editor") {
    const target = { id, mode };
    rememberTarget(target);
    setCvTarget((previous) => ({ ...target, nonce: previous.nonce + 1 }));
    navigate(mode);
  }

  // Un nouveau CV vient d'être créé en base : on retient son id (sans recharger l'écran)
  function handleCvCreated(id) {
    setCvTarget((previous) => {
      rememberTarget({ id, mode: previous.mode });
      return { ...previous, id };
    });
  }

  function navigateBack(fallbackPage = "landing") {
    if (historyIndex.current > 0) {
      window.history.back();
      return;
    }
    setPage(fallbackPage);
    setVisitedPages((visited) => new Set(visited).add(fallbackPage));
    window.history.replaceState({ appPage: fallbackPage, appIndex: 0 }, "", `#${fallbackPage}`);
    window.scrollTo(0, 0);
  }

  function renderPage(route) {
    switch (route) {
      case "signin":
        return <SignIn onNavigate={go} />;
      case "signup":
        return <SignUp onNavigate={go} />;
      case "reset-password":
        return <ResetPassword onNavigate={go} />;
      case "import":
        return <ImportFlow onNavigate={go} onBack={() => navigateBack()} />;
      case "templates":
        return (
          <TemplatePage
            onNavigate={go}
            onBack={() => navigateBack()}
            isAuthed={Boolean(user)}
          />
        );
      case "wizard":
        return user && cvTarget.mode === "wizard" ? (
          <CVWizard
            key={cvTarget.nonce}
            cvId={cvTarget.id}
            onNavigate={go}
            onOpenDashboard={() => navigate("dashboard")}
            registerAiApply={registerAiApply}
            isAuthed
          />
        ) : null;
      case "editor":
        return user && cvTarget.mode === "editor" ? (
          <CvEditor
            key={cvTarget.nonce}
            cvId={cvTarget.id}
            onOpenDashboard={() => navigate("dashboard")}
            onCvCreated={handleCvCreated}
            registerAiApply={registerAiApply}
          />
        ) : null;
      case "dashboard":
        return user ? (
          <Dashboard
            active={page === "dashboard"}
            onNavigate={go}
            onOpen={(id) => openCv(id, "editor")}
            onCreate={() => openCv(null, "editor")}
            onCreateGuided={() => openCv(null, "wizard")}
          />
        ) : null;
      case "landing":
      default:
        return <LandingPage onNavigate={go} />;
    }
  }

  return (
    <>
      {PAGES.map((route) => (
        <div className="app-route" hidden={page !== route} key={route}>
          {visitedPages.has(route) && <ErrorBoundary>{renderPage(route)}</ErrorBoundary>}
        </div>
      ))}
      <ErrorBoundary>
        <AIPanel
          open={aiOpen}
          onToggle={() => setAiOpen((open) => !open)}
          canApply={(page === "wizard" || page === "editor") && Boolean(applyHandler)}
          onApplySuggestion={(text) => applyHandler?.(text)}
        />
      </ErrorBoundary>
    </>
  );
}
