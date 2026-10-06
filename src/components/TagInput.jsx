import { useState } from "react";

export default function TagInput({ tags, onChange, placeholder = "Add tag" }) {
  const [draft, setDraft] = useState("");
  const [adding, setAdding] = useState(false);

  function commit() {
    const value = draft.trim();
    if (value) onChange([...tags, value]);
    setDraft("");
    setAdding(false);
  }

  function removeAt(index) {
    onChange(tags.filter((_, i) => i !== index));
  }

  return (
    <div className="tag-list">
      {tags.map((tag, i) => (
        <span className="tag" key={`${tag}-${i}`}>
          {tag}
          <button type="button" onClick={() => removeAt(i)} aria-label={`Remove ${tag}`}>
            ✕
          </button>
        </span>
      ))}
      {adding ? (
        <input
          className="tag-add-input"
          autoFocus
          value={draft}
          placeholder={placeholder}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              commit();
            }
            if (e.key === "Escape") {
              setDraft("");
              setAdding(false);
            }
          }}
          onBlur={commit}
        />
      ) : (
        <button className="add-tag-btn" type="button" onClick={() => setAdding(true)}>
          + {placeholder}
        </button>
      )}
    </div>
  );
}
