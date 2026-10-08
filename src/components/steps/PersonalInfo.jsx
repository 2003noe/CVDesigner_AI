import { useState } from "react";
import PhotoCropper from "../PhotoCropper";

const COUNTRIES = ["Cameroon", "Côte d'Ivoire", "Congo", "Gabon", "Senegal", "France", "Belgium", "Canada", "United Kingdom", "United States", "Other"];

const splitName = (fullName = "") => {
  const [first = "", ...rest] = fullName.trim().split(/\s+/).filter(Boolean);
  return { first, last: rest.join(" ") };
};

/**
 * Étape « Personal Information » : identité (prénom, nom, titre, âge, photo) puis coordonnées.
 * - title / onTitleChange : titre professionnel (stocké dans careerGoal.targetJobTitle)
 * - hidePhoto : masque l'envoi de photo
 * - compact : mise en page de l'éditeur (une seule colonne)
 */
export default function PersonalInfo({ data, onChange, title = "", onTitleChange, hidePhoto = false, compact = false }) {
  const [pendingPhoto, setPendingPhoto] = useState(null); // fichier en cours de cadrage
  const photoUrl = data.photo || null;

  // Anciens CV : seul fullName existe, on en tire prénom et nom
  const guess = splitName(data.fullName);
  const firstName = data.firstName || (data.lastName ? "" : guess.first);
  const lastName = data.lastName || (data.firstName ? "" : guess.last);

  function set(field, value) {
    onChange((previous) => ({ ...previous, [field]: value }));
  }

  function setName(field, value) {
    onChange((previous) => {
      const base = splitName(previous.fullName);
      const first = field === "firstName" ? value : previous.firstName || (previous.lastName ? "" : base.first);
      const last = field === "lastName" ? value : previous.lastName || (previous.firstName ? "" : base.last);
      return { ...previous, firstName: first, lastName: last, fullName: [first.trim(), last.trim()].filter(Boolean).join(" ") };
    });
  }

  // La photo cadrée est enregistrée avec le CV (colonne JSON de la table cvs), sans stockage séparé
  function handlePhotoChange(event) {
    const file = event.target.files?.[0];
    event.target.value = ""; // permet de re-sélectionner le même fichier ensuite
    if (file) setPendingPhoto(file);
  }

  const photoBlock = !hidePhoto && (
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
        <span>Optional · JPG or PNG, up to 5 MB. You can crop it right after. Templates without a photo simply don’t show it.</span>
        {photoUrl && (
          <button className="link-btn" type="button" onClick={() => set("photo", "")}>
            Remove photo
          </button>
        )}
      </div>
    </div>
  );

  return (
    <>
      {pendingPhoto && (
        <PhotoCropper
          file={pendingPhoto}
          onCancel={() => setPendingPhoto(null)}
          onDone={(dataUrl) => {
            set("photo", dataUrl);
            setPendingPhoto(null);
          }}
        />
      )}
      <h1>Personal Information</h1>
      <p className="subtitle">Who you are, and how recruiters can reach you.</p>

      <section className={`pi-group ${compact ? "is-compact" : ""}`} aria-labelledby="pi-identity">
        <h2 className="pi-group-title" id="pi-identity">Identity</h2>
        {photoBlock}
        <div className="field-row">
          <div className="field">
            <label htmlFor="firstName">First name</label>
            <input id="firstName" autoComplete="given-name" value={firstName} onChange={(e) => setName("firstName", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="lastName">Last name</label>
            <input id="lastName" autoComplete="family-name" value={lastName} onChange={(e) => setName("lastName", e.target.value)} />
          </div>
        </div>
        {onTitleChange && (
          <div className="field">
            <label htmlFor="jobTitle">Professional title</label>
            <input id="jobTitle" placeholder="e.g. Agronomist" value={title} onChange={(e) => onTitleChange(e.target.value)} />
          </div>
        )}
        <div className="field" style={{ maxWidth: 200 }}>
          <label htmlFor="age">
            Age <span className="optional">Optional</span>
          </label>
          <input id="age" type="number" min="14" max="99" inputMode="numeric" value={data.age || ""} onChange={(e) => set("age", e.target.value)} />
        </div>
      </section>

      <section className={`pi-group ${compact ? "is-compact" : ""}`} aria-labelledby="pi-contact">
        <h2 className="pi-group-title" id="pi-contact">Contact</h2>
        <div className="field-row">
          <div className="field">
            <label htmlFor="email">Email address</label>
            <input id="email" type="email" autoComplete="email" value={data.email} onChange={(e) => set("email", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="phone">Phone number</label>
            <input id="phone" type="tel" autoComplete="tel" value={data.phone} onChange={(e) => set("phone", e.target.value)} />
          </div>
        </div>
        <div className="field">
          <label htmlFor="address">
            Address <span className="optional">Optional</span>
          </label>
          <input id="address" autoComplete="street-address" placeholder="e.g. 12 Rue des Palmiers, Bastos" value={data.address || ""} onChange={(e) => set("address", e.target.value)} />
        </div>
        <div className="field-row">
          <div className="field">
            <label htmlFor="city">City</label>
            <input id="city" autoComplete="address-level2" value={data.city} onChange={(e) => set("city", e.target.value)} />
          </div>
          <div className="field">
            <label htmlFor="country">Country</label>
            <select id="country" value={data.country} onChange={(e) => set("country", e.target.value)}>
              <option value="">Select…</option>
              {COUNTRIES.map((country) => (
                <option key={country}>{country}</option>
              ))}
              {data.country && !COUNTRIES.includes(data.country) && <option>{data.country}</option>}
            </select>
          </div>
        </div>
        <div className="field">
          <label htmlFor="linkedin">
            LinkedIn <span className="optional">Optional</span>
          </label>
          <input id="linkedin" placeholder="linkedin.com/in/…" value={data.linkedin} onChange={(e) => set("linkedin", e.target.value)} />
        </div>
        <div className="field">
          <label htmlFor="portfolio">
            Portfolio or website <span className="optional">Optional</span>
          </label>
          <input id="portfolio" placeholder="e.g. github.com/username" value={data.portfolio} onChange={(e) => set("portfolio", e.target.value)} />
        </div>
      </section>
    </>
  );
}

export const emptyPersonalInfo = {
  firstName: "",
  lastName: "",
  fullName: "",
  email: "",
  city: "",
  country: "",
  phone: "",
  linkedin: "",
  portfolio: "",
  age: "",
  address: "",
  photo: "", // photo cadrée (data URL), enregistrée avec le CV
};
