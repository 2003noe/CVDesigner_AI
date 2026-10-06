import BrandMark from "./BrandMark";

const FEATURES = [
  {
    icon: "📄",
    title: "ATS-Friendly Optimization",
    body: "Engineered to pass employer tracking systems easily. Clean parses with machine-readable styles.",
  },
  {
    icon: "✦",
    title: "AI-Powered Suggestions",
    body: "Smarter write-ups on experience and objectives tailored to your career and target fields.",
  },
  {
    icon: "★",
    title: "Professional Templates",
    body: "Created under guidance of actual recruiters, with visual layouts that emphasize accomplishments.",
  },
  {
    icon: "⬇",
    title: "Instant PDF Export",
    body: "Ready to upload with pixel-perfect font alignments, spacing guidelines, and layout exports.",
  },
];

const STEPS = [
  {
    num: "01",
    title: "Guided Questionnaire",
    body: "Spend 10 minutes filling out structural info about yourself, target goals, and background details.",
  },
  {
    num: "02",
    title: "AI Generation & Fine-tuning",
    body: "Watch AI compose targeted bullet points, summaries, and skills suited to the roles you select.",
  },
  {
    num: "03",
    title: "Review & Export",
    body: "Select from elegant templates, review recruiter layout hints, and download a polished PDF file.",
  },
];

const TESTIMONIALS = [
  {
    quote:
      "The ATS check was a life saver. I had been sending resumes for months with zero replies. Built one with CVDesigner and got 3 interviews the next week.",
    name: "Sarah Jenkins",
    role: "Senior UX Designer",
  },
  {
    quote:
      "The AI summary was spot on. I explained my technical background loosely and it returned a highly professional, concise, recruiter-appealing profile.",
    name: "Marcus Vance",
    role: "Software Engineer",
  },
];

export default function LandingPage({ onNavigate }) {
  return (
    <div className="landing">
      <header className="landing-nav">
        <BrandMark onClick={() => onNavigate("landing")} variant="light" />
        <nav className="topnav-links">
          <button type="button" onClick={() => onNavigate("templates")}>Templates</button>
          <button type="button">AI Features</button>
          <button type="button">Pricing</button>
          <button type="button">Success Stories</button>
        </nav>
        <div className="topnav-actions">
          <button className="link-btn" type="button" onClick={() => onNavigate("signin")}>
            Sign In
          </button>
          <button className="btn btn-primary" type="button" onClick={() => onNavigate("wizard")}>
            Create my CV
          </button>
        </div>
      </header>

      <section className="landing-hero">
        <span className="eyebrow-pill">✦ Intelligent CV Builder Powered by GPT-4</span>
        <h1>Create your professional CV with AI</h1>
        <p>
          Skip the formatting headache. Answer a few guided questions, let our AI optimize your
          strengths, match job descriptions, and deliver an ATS-proof resume in minutes.
        </p>
        <div className="hero-actions">
          <button className="btn btn-primary" type="button" onClick={() => onNavigate("wizard")}>
            Create my CV with a questionnaire →
          </button>
          <button className="btn btn-secondary" type="button" onClick={() => onNavigate("import")}>
            Import an existing CV
          </button>
        </div>
      </section>

      <section className="landing-section">
        <div className="kicker">Core Features</div>
        <h2>Everything you need to land interviews</h2>
        <div className="feature-grid">
          {FEATURES.map((f) => (
            <div className="feature-card" key={f.title}>
              <div className="icon">{f.icon}</div>
              <h3>{f.title}</h3>
              <p>{f.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <div className="kicker">How It Works</div>
        <h2>Three steps to a stellar application</h2>
        <div className="steps-grid">
          {STEPS.map((s) => (
            <div key={s.num}>
              <div className="step-num">{s.num}</div>
              <h3>{s.title}</h3>
              <p>{s.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="landing-section">
        <h2>Over 50,000 professionals land job offers with CVDesigner AI</h2>
        <div className="testimonial-grid">
          {TESTIMONIALS.map((t) => (
            <div className="testimonial-card" key={t.name}>
              <p>&ldquo;{t.quote}&rdquo;</p>
              <div className="name">{t.name}</div>
              <div className="role">{t.role}</div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <span>© 2026 CVDesigner AI. All rights reserved.</span>
        <div className="footer-links">
          <span>Privacy Policy</span>
          <span>Terms of Service</span>
          <span>Contact Support</span>
        </div>
      </footer>
    </div>
  );
}
