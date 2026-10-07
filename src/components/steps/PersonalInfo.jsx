import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { removeAvatar, uploadAvatar, useAvatarUrl, validateAvatar } from "../../lib/avatars";

export default function PersonalInfo({ data, onChange }) {
  const [showOptional, setShowOptional] = useState(false);
  const { user } = useAuth();
  const photoUrl = useAvatarUrl(data.photoPath);
  const [uploading, setUploading] = useState(false);
  const [photoError, setPhotoError] = useState("");

  function set(field, value) {
    onChange({ ...data, [field]: value });
  }

  async function handlePhotoChange(e) {
    const file = e.target.files?.[0];
    e.target.value = ""; // permet de re-sélectionner le même fichier ensuite
    if (!file) return;

    setPhotoError("");
    const problem = validateAvatar(file);
    if (problem) {
      setPhotoError(problem);
      return;
    }

    setUploading(true);
    const { path, error } = await uploadAvatar(user.id, file);
    setUploading(false);
    if (error) {
      setPhotoError(`Upload failed: ${error.message}`);
      return;
    }

    const oldPath = data.photoPath;
    // Forme "fonction" : on part de l'état le plus récent (l'utilisateur a pu taper pendant l'envoi)
    onChange((previous) => ({ ...previous, photoPath: path }));
    if (oldPath) removeAvatar(oldPath); // supprime l'ancienne photo du stockage
  }

  function handleRemovePhoto() {
    const oldPath = data.photoPath;
    setPhotoError("");
    onChange((previous) => ({ ...previous, photoPath: "" }));
    if (oldPath) removeAvatar(oldPath);
  }

  return (
    <>
      <h1>Personal Information</h1>
      <p className="subtitle">Enter your basic contact details so recruiters know how to reach you.</p>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: 32 }}>
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
              cursor: uploading ? "wait" : "pointer",
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
                {uploading ? "Uploading…" : "Upload photo"}
              </>
            )}
            <input
              type="file"
              accept="image/jpeg,image/png"
              style={{ display: "none" }}
              onChange={handlePhotoChange}
              disabled={uploading}
            />
          </label>
          {data.photoPath && (
            <button className="link-btn" type="button" onClick={handleRemovePhoto} style={{ marginTop: 8 }}>
              Remove photo
            </button>
          )}
          {photoError ? (
            <p className="hint" style={{ color: "var(--color-danger)" }}>{photoError}</p>
          ) : (
            <p className="hint">Optional. Max size 5MB. JPG or PNG.</p>
          )}
        </div>
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
  photoPath: "", // chemin du fichier dans le bucket "avatars"
};
