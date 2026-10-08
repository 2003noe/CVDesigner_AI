import { useState } from "react";
import PhotoCropper from "../PhotoCropper";

// hidePhoto : masque l'envoi de photo (page finale : la photo du CV se gère avec le modèle)
// compact : mise en page de l'éditeur (photo en rangée au-dessus des champs, champs pleine largeur)
export default function PersonalInfo({ data, onChange, hidePhoto = false, compact = false }) {
  const [showOptional, setShowOptional] = useState(false);
  const [pendingPhoto, setPendingPhoto] = useState(null); // fichier en cours de cadrage
  const photoUrl = data.photo || null;

  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  // La photo cadrée est enregistrée avec le CV (colonne JSON de la table cvs), sans stockage séparé
  function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de re-sélectionner le même fichier ensuite
    if (file) setPendingPhoto(file);
  }

  function handleRemovePhoto() {
    onChange((previous) => ({ ...previous, photo: "" }));
  }

  return (
    <>
      {pendingPhoto && (
        <PhotoCropper
          file={pendingPhoto}
          onCancel={() => setPendingPhoto(null)}
          onDone={(dataUrl) => {
            onChange((previous) => ({ ...previous, photo: dataUrl }));
            setPendingPhoto(null);
          }}
        />
      )}
      <h1>Personal Information</h1>
      <p className="subtitle">Enter your basic contact details so recruiters know how to reach you.</p>

      <div style={{ display: "grid", gridTemplateColumns: hidePhoto || compact ? "1fr" : "1fr 200px", gap: compact ? 20 : 32 }}>
        {compact && !hidePhoto && (
          <div className="pi-photo-row">
            <label className="pi-photo-circle" aria-label="Upload photo">
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" />
              ) : (
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <path d="M4 8h3l2-3h6l2 3h3v11H4z" />
                  <circle cx="12" cy="13" r="3.5" />
                </svg>
              )}
              <input type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handlePhotoChange} />
            </label>
            <div className="pi-photo-text">
              <label className="ed-btn">
                {photoUrl ? "Change photo" : "Add photo"}
                <input type="file" accept="image/jpeg,image/png" style={{ display: "none" }} onChange={handlePhotoChange} />
              </label>
              <span>JPG or PNG, up to 5 MB. You can crop it right after.</span>
              {photoUrl && (
                <button className="link-btn" type="button" onClick={handleRemovePhoto}>
                  Remove photo
                </button>
              )}
            </div>
          </div>
        )}
        <div>
          <div className="field">
            <label htmlFor="fullName">Full Name</label>
            <input id="fullName" value={data.fullName} onChange={(e) => set("fullName", e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="email">Email Address</label>
            <input id="email" type="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
          </div>

          <div className="field-row">
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="city">City</label>
              <input id="city" value={data.city} onChange={(e) => set("city", e.target.value)} />
            </div>
            <div className="field" style={{ marginBottom: 0 }}>
              <label htmlFor="country">Country</label>
              <select id="country" value={data.country} onChange={(e) => set("country", e.target.value)}>
                <option>United States</option>
                <option>Cameroon</option>
                <option>France</option>
                <option>Canada</option>
                <option>United Kingdom</option>
              </select>
            </div>
          </div>

          <div className="field">
            <label htmlFor="phone">Phone Number</label>
            <input id="phone" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="linkedin">
              LinkedIn Profile URL <span className="optional">Optional</span>
            </label>
            <input id="linkedin" value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
          </div>

          <div className="field">
            <label htmlFor="portfolio">
              Portfolio or Website URL <span className="optional">Optional</span>
            </label>
            <input
              id="portfolio"
              placeholder="e.g. github.com/username"
              value={data.portfolio}
              onChange={(e) => set("portfolio", e.target.value)}
            />
          </div>
        </div>

        {!hidePhoto && !compact && (
          <div>
            <label>Profile Photo</label>
            <label
              style={{
                display: "grid",
                placeItems: "center",
                gap: 8,
                width: "100%",
                aspectRatio: "1",
                border: photoUrl ? "1px solid var(--color-border)" : "1px dashed var(--color-border)",
                borderRadius: 12,
                overflow: "hidden",
                cursor: "pointer",
                color: "var(--color-primary)",
                fontSize: 13,
                fontWeight: 600,
              }}
            >
              {photoUrl ? (
                <img src={photoUrl} alt="Profile" style={{ width: "100%", height: "100%", objectFit: "cover" }} />
              ) : (
                <>
                  <span style={{ fontSize: 22 }}>👤</span>
                  Upload photo
                </>
              )}
              <input
                type="file"
                accept="image/jpeg,image/png"
                style={{ display: "none" }}
                onChange={handlePhotoChange}
              />
            </label>
            {data.photo && (
              <button className="link-btn" type="button" onClick={handleRemovePhoto} style={{ marginTop: 8 }}>
                Remove photo
              </button>
            )}
            <p className="hint">Optional. Max size 5MB. JPG or PNG. You can crop it, and change it later in “Customize template”.</p>
          </div>
        )}
      </div>

      <div className="collapsible" style={{ borderTop: "none", paddingTop: 8 }}>
        <button className="collapsible-header" type="button" onClick={() => setShowOptional((s) => !s)}>
          <span className="title-group">+ Show Optional Fields (Age, Full Address)</span>
        </button>
        <label style={{ display: "flex", alignItems: "center", gap: 8, marginTop: 8 }}>
          <input type="checkbox" checked={showOptional} onChange={(e) => setShowOptional(e.target.checked)} />
        </label>
        {showOptional && (
          <div className="collapsible-body">
            <div className="field-row">
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="age">Age</label>
                <input id="age" type="number" value={data.age || ""} onChange={(e) => set("age", e.target.value)} />
              </div>
              <div className="field" style={{ marginBottom: 0 }}>
                <label htmlFor="address">Full Address</label>
                <input id="address" value={data.address || ""} onChange={(e) => set("address", e.target.value)} />
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}

export const emptyPersonalInfo = {
  fullName: "",
  email: "",
  city: "",
  country: "United States",
  phone: "",
  linkedin: "",
  portfolio: "",
  age: "",
  address: "",
  photo: "", // photo cadrée (data URL), enregistrée avec le CV
};
