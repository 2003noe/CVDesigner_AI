import { useState } from "react";

const SEED_MESSAGES = [
  { from: "ai", text: "I can help you write a compelling professional summary. What role are you targeting?" },
  { from: "user", text: "I'm a UX designer with 5 years of experience" },
];

const SUGGESTION =
  '"Senior UX Designer with 5+ years of experience crafting user-centered SaaS workflows and mobile apps. Proven track record of reducing drop-offs by 24%."';

// canApply : vrai seulement quand un CV est ouvert (le texte peut alors être appliqué au résumé)
export default function AIPanel({ open, onToggle, onApplySuggestion, canApply = false }) {
  const [messages, setMessages] = useState(SEED_MESSAGES);
  const [draft, setDraft] = useState("");

  function sendMessage() {
    const text = draft.trim();
    if (!text) return;
    setMessages((m) => [...m, { from: "user", text }]);
    setDraft("");
  }

  if (!open) {
    return (
      <button className="ai-fab" type="button" onClick={onToggle} aria-label="Open AI assistant">
        <span className="ai-fab-star">✦</span>
        <span className="ai-fab-label">AI</span>
      </button>
    );
  }

  return (
    <div className="ai-panel">
      <div className="ai-panel-header">
        <span>✦ AI Assistant</span>
        <button type="button" onClick={onToggle} aria-label="Close AI assistant">
          ✕
        </button>
      </div>
      <div className="ai-panel-body">
        {messages.map((msg, i) => (
          <div className={`ai-msg ${msg.from === "user" ? "user" : ""}`} key={i}>
            {msg.text}
          </div>
        ))}
        <div className="ai-suggestion">
          <div className="label">✦ SUGGESTED REVISION</div>
          <p style={{ margin: "0 0 10px" }}>{SUGGESTION}</p>
          <div style={{ display: "flex", gap: 8 }}>
            {canApply && (
              <button className="btn btn-primary" type="button" onClick={() => onApplySuggestion?.(SUGGESTION)}>
                Apply to my CV
              </button>
            )}
            <button className="link-btn" type="button">
              Regenerate
            </button>
          </div>
        </div>
      </div>
      <div className="ai-panel-input">
        <input
          placeholder="Ask AI for help..."
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button type="button" onClick={sendMessage} aria-label="Send">
          →
        </button>
      </div>
    </div>
  );
}
