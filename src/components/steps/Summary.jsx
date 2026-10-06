import { useState } from "react";
import TagInput from "../TagInput";

const AI_SUGGESTION =
  '"Product Designer with 4+ years of experience specializing in end-to-end SaaS interface architecture and user research. Proven record of translating complex workflows into intuitive, high-engagement web and mobile applications."';

export default function Summary({ data, onChange }) {
  const [suggestionDismissed, setSuggestionDismissed] = useState(false);

  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  return (
    <>
      <h1>Professional Summary</h1>
      <p className="subtitle">Write a hook that captivates recruiters. Use our AI actions below to easily refine your tone.</p>

      <div className="field">
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <label htmlFor="about">About Yourself</label>
          <span className="hint">{data.about.length} / 500 chars</span>
        </div>
        <textarea
          id="about"
          maxLength={500}
          value={data.about}
          onChange={(e) => set("about", e.target.value)}
        />
      </div>

      <div className="ai-suggest-row">
        <button className="ai-chip" type="button" onClick={() => set("about", data.about)}>
          ✦ Help me write
        </button>
        <button className="ai-chip" type="button">
          ✦ Improve tone
        </button>
        <button className="ai-chip" type="button">
          ✦ Make shorter
        </button>
      </div>

      <div className="field">
        <label>Your Key Strengths</label>
        <TagInput tags={data.strengths} onChange={(tags) => set("strengths", tags)} placeholder="Add strength" />
      </div>

      {!suggestionDismissed && (
        <div className="ai-suggestion" style={{ marginBottom: 24 }}>
          <div className="label">✦ AI Suggestion (Recommended tone upgrade)</div>
          <p style={{ margin: "0 0 12px" }}>{AI_SUGGESTION}</p>
          <div style={{ display: "flex", gap: 8 }}>
            <button
              className="btn btn-primary"
              type="button"
              onClick={() => {
                set("about", AI_SUGGESTION.replace(/(^"|"$)/g, ""));
                setSuggestionDismissed(true);
              }}
            >
              Apply Suggestion
            </button>
            <button className="btn btn-secondary" type="button" onClick={() => setSuggestionDismissed(true)}>
              Dismiss
            </button>
          </div>
        </div>
      )}

      <div className="field" style={{ marginBottom: 0 }}>
        <label htmlFor="objective">Career Objective</label>
        <textarea
          id="objective"
          placeholder="What are you hoping to achieve or specialize in next?"
          value={data.objective}
          onChange={(e) => set("objective", e.target.value)}
        />
      </div>
    </>
  );
}

export const emptySummary = {
  about: "",
  strengths: [],
  objective: "",
};
