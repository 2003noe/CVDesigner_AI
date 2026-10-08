import { Component } from "react";

// Évite la « page blanche » : si un écran plante, on affiche un message avec un moyen de repartir.
export default class ErrorBoundary extends Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("Erreur d'affichage :", error, info?.componentStack);
  }

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;
    return (
      <div className="wizard-body" style={{ padding: 32 }}>
        <div className="wizard-card" style={{ textAlign: "center", maxWidth: 640, margin: "40px auto" }}>
          <h1>Something went wrong</h1>
          <p className="subtitle">This page couldn’t be displayed. Your CV is saved — nothing was lost.</p>
          <p className="hint" style={{ wordBreak: "break-word" }}>{String(error?.message ?? error)}</p>
          <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
            <button className="btn btn-secondary" type="button" onClick={() => this.setState({ error: null })}>
              Try again
            </button>
            <button className="btn btn-primary" type="button" onClick={() => window.location.reload()}>
              Reload the page
            </button>
          </div>
        </div>
      </div>
    );
  }
}
