import { useEffect, useRef, useState } from "react";
import "./App.css";
import LandingPage from "./components/LandingPage";
import SignIn from "./components/SignIn";
import SignUp from "./components/SignUp";
import ImportFlow from "./components/ImportFlow";
import CVWizard from "./components/CVWizard";
import TemplatePage from "./components/templates/TemplatePage";
import ResetPassword from "./components/ResetPassword";
import { useAuth } from "./context/AuthContext";

const PAGES = ["landing", "templates", "signin", "signup", "reset-password", "import", "wizard"];

function pageFromLocation() {
  const requestedPage = window.location.hash.slice(1);
  return PAGES.includes(requestedPage) ? requestedPage : "landing";
}

export default function App() {
  const [page, setPage] = useState(pageFromLocation);
  const [visitedPages, setVisitedPages] = useState(() => new Set([pageFromLocation()]));
  const historyIndex = useRef(0);
  const { user, loading, passwordRecovery } = useAuth();

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
    } else if (!user && page === "wizard") {
      navigate("signin", { replace: true });          // page protégée
    } else if (user && (page === "signin" || page === "signup")) {
      navigate("wizard", { replace: true });          // déjà connecté
    }
  }, [loading, user, passwordRecovery, page]);

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
        return <SignIn onNavigate={navigate} />;
      case "signup":
        return <SignUp onNavigate={navigate} />;
      case "reset-password":
        return <ResetPassword onNavigate={navigate} />;
      case "import":
        return <ImportFlow onNavigate={navigate} onBack={() => navigateBack()} />;
      case "templates":
        return (
          <TemplatePage
            onNavigate={navigate}
            onBack={() => navigateBack()}
            isAuthed={Boolean(user)}
          />
        );
      case "wizard":
        return user ? <CVWizard onNavigate={navigate} isAuthed /> : null;
      case "landing":
      default:
        return <LandingPage onNavigate={navigate} />;
    }
  }

  return (
    <>
      {PAGES.map((route) => (
        <div className="app-route" hidden={page !== route} key={route}>
          {visitedPages.has(route) && renderPage(route)}
        </div>
      ))}
    </>
  );
}
