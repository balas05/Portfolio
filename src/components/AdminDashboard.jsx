import { useEffect, useMemo, useState } from "react";
import {
  ArrowLeft,
  Download,
  Eye,
  Lock,
  LogOut,
  Moon,
  Plus,
  RefreshCcw,
  Save,
  Sun,
  Trash2,
  Upload,
} from "lucide-react";

const makeId = (prefix) => `${prefix}-${crypto.randomUUID ? crypto.randomUUID() : Date.now()}`;

const getPath = (source, path) => path.reduce((value, key) => value?.[key], source);

const setPath = (source, path, value) => {
  const [key, ...rest] = path;
  const next = Array.isArray(source) ? [...source] : { ...source };
  next[key] = rest.length ? setPath(next[key], rest, value) : value;
  return next;
};

const splitComma = (value) =>
  value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

const splitLines = (value) =>
  value
    .split("\n")
    .map((item) => item.trim())
    .filter(Boolean);

function TextInput({ label, value, onChange, type = "text" }) {
  return (
    <label className="field">
      <span>{label}</span>
      <input type={type} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function TextArea({ label, value, onChange, rows = 4 }) {
  return (
    <label className="field wide">
      <span>{label}</span>
      <textarea rows={rows} value={value || ""} onChange={(event) => onChange(event.target.value)} />
    </label>
  );
}

function Toggle({ label, checked, onChange }) {
  return (
    <label className="toggle-field">
      <input type="checkbox" checked={Boolean(checked)} onChange={(event) => onChange(event.target.checked)} />
      <span>{label}</span>
    </label>
  );
}

function CardShell({ title, subtitle, onDelete, children }) {
  return (
    <article className="editor-card">
      <div className="editor-card-header">
        <div>
          <h3>{title}</h3>
          {subtitle ? <p>{subtitle}</p> : null}
        </div>
        {onDelete ? (
          <button className="icon-button danger" type="button" onClick={onDelete} aria-label="Delete">
            <Trash2 size={18} />
          </button>
        ) : null}
      </div>
      <div className="editor-grid">{children}</div>
    </article>
  );
}

function LoginScreen({ portfolio, onLogin }) {
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const submit = (event) => {
    event.preventDefault();
    if (password === portfolio.admin.password) {
      sessionStorage.setItem("portfolio-cms-authenticated", "true");
      onLogin();
      return;
    }
    setError("Password did not match.");
  };

  return (
    <main className="admin-login">
      <form onSubmit={submit} className="login-card">
        <div className="login-icon">
          <Lock size={24} />
        </div>
        <h1>{portfolio.admin.title}</h1>
        <p>{portfolio.admin.subtitle}</p>
        <TextInput label="Password" type="password" value={password} onChange={setPassword} />
        {error ? <span className="form-error">{error}</span> : <span className="form-hint">{portfolio.admin.hint}</span>}
        <button className="button primary full" type="submit">
          <Eye size={18} />
          Open Dashboard
        </button>
        <a className="text-link" href="/">
          <ArrowLeft size={16} />
          Back to portfolio
        </a>
      </form>
    </main>
  );
}

export default function AdminDashboard({ portfolio, savePortfolio, resetPortfolio, seedData, storageKey, theme, onToggleTheme }) {
  const [authenticated, setAuthenticated] = useState(
    () => sessionStorage.getItem("portfolio-cms-authenticated") === "true",
  );
  const [draft, setDraft] = useState(portfolio);
  const [activeTab, setActiveTab] = useState("profile");
  const [status, setStatus] = useState("");
  const [importText, setImportText] = useState("");

  useEffect(() => {
    setDraft(portfolio);
  }, [portfolio]);

  const tabs = useMemo(
    () => [
      { id: "profile", label: "Profile" },
      { id: "projects", label: "Projects" },
      { id: "skills", label: "Skills" },
      { id: "experience", label: "Experience" },
      { id: "education", label: "Education" },
      { id: "contact", label: "Contact" },
      { id: "settings", label: "Settings" },
    ],
    [],
  );

  const updateField = (path, value) => setDraft((current) => setPath(current, path, value));
  const addItem = (path, item) => updateField(path, [...getPath(draft, path), item]);
  const deleteItem = (path, index) => updateField(path, getPath(draft, path).filter((_, itemIndex) => itemIndex !== index));

  const save = () => {
    savePortfolio(draft);
    setStatus("Changes saved to local storage.");
  };

  const reset = () => {
    resetPortfolio();
    setStatus("Local edits cleared. The JSON seed data is active again.");
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify(draft, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "portfolio-export.json";
    link.click();
    URL.revokeObjectURL(url);
  };

  const importData = () => {
    try {
      const parsed = JSON.parse(importText);
      setDraft(parsed);
      savePortfolio(parsed);
      setStatus("Imported JSON saved to local storage.");
      setImportText("");
    } catch {
      setStatus("Import failed. Check that the pasted content is valid JSON.");
    }
  };

  if (!authenticated) {
    return <LoginScreen portfolio={portfolio} onLogin={() => setAuthenticated(true)} />;
  }

  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <main className="admin-shell">
      <aside className="admin-sidebar">
        <div>
          <p className="eyebrow">{draft.personal.name}</p>
          <h1>{draft.admin.title}</h1>
          <span>{draft.admin.subtitle}</span>
        </div>
        <nav aria-label="Admin sections">
          {tabs.map((tab) => (
            <button
              className={activeTab === tab.id ? "active" : ""}
              key={tab.id}
              type="button"
              onClick={() => setActiveTab(tab.id)}
            >
              {tab.label}
            </button>
          ))}
        </nav>
        <div className="admin-sidebar-actions">
          <button className="button secondary full" type="button" onClick={onToggleTheme}>
            <ThemeIcon size={18} />
            Theme
          </button>
          <a className="button secondary full" href="/">
            <ArrowLeft size={18} />
            Portfolio
          </a>
          <button
            className="button ghost full"
            type="button"
            onClick={() => {
              sessionStorage.removeItem("portfolio-cms-authenticated");
              setAuthenticated(false);
            }}
          >
            <LogOut size={18} />
            Sign out
          </button>
        </div>
      </aside>

      <section className="admin-content">
        <div className="admin-toolbar">
          <div>
            <p>Storage key</p>
            <strong>{storageKey}</strong>
          </div>
          {status ? <span className="save-status">{status}</span> : null}
          <button className="button primary" type="button" onClick={save}>
            <Save size={18} />
            Save
          </button>
        </div>

        {activeTab === "profile" ? (
          <div className="editor-stack">
            <CardShell title="Site and profile" subtitle="Public identity, intro copy, and resume link">
              <TextInput label="Site title" value={draft.site.title} onChange={(value) => updateField(["site", "title"], value)} />
              <TextInput label="Admin path" value={draft.site.adminPath} onChange={(value) => updateField(["site", "adminPath"], value)} />
              <TextInput label="Name" value={draft.personal.name} onChange={(value) => updateField(["personal", "name"], value)} />
              <TextInput label="Role" value={draft.personal.role} onChange={(value) => updateField(["personal", "role"], value)} />
              <TextInput label="Location" value={draft.personal.location} onChange={(value) => updateField(["personal", "location"], value)} />
              <TextInput label="Availability" value={draft.personal.availability} onChange={(value) => updateField(["personal", "availability"], value)} />
              <TextInput label="Avatar URL" value={draft.personal.avatarUrl} onChange={(value) => updateField(["personal", "avatarUrl"], value)} />
              <TextInput label="Resume URL" value={draft.personal.resumeUrl} onChange={(value) => updateField(["personal", "resumeUrl"], value)} />
              <TextArea label="Tagline" value={draft.personal.tagline} onChange={(value) => updateField(["personal", "tagline"], value)} />
              <TextArea label="About Me" rows={6} value={draft.personal.about} onChange={(value) => updateField(["personal", "about"], value)} />
            </CardShell>
            <CardShell title="Stats" subtitle="Small proof points shown near the profile copy">
              {draft.stats.map((stat, index) => (
                <div className="inline-fields" key={`${stat.label}-${index}`}>
                  <TextInput label="Value" value={stat.value} onChange={(value) => updateField(["stats", index, "value"], value)} />
                  <TextInput label="Label" value={stat.label} onChange={(value) => updateField(["stats", index, "label"], value)} />
                  <button className="icon-button danger" type="button" onClick={() => deleteItem(["stats"], index)} aria-label="Delete stat">
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
              <button className="button secondary" type="button" onClick={() => addItem(["stats"], { value: "1+", label: "New stat" })}>
                <Plus size={18} />
                Add stat
              </button>
            </CardShell>
          </div>
        ) : null}

        {activeTab === "projects" ? (
          <div className="editor-stack">
            <button
              className="button secondary"
              type="button"
              onClick={() =>
                addItem(["projects"], {
                  id: makeId("project"),
                  title: "New Project",
                  subtitle: "Short project subtitle",
                  description: "Describe the problem, your approach, and the outcome.",
                  imageUrl: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&w=1200&q=80",
                  tags: ["React"],
                  liveUrl: "https://example.com",
                  repoUrl: "https://github.com/example",
                  featured: false,
                })
              }
            >
              <Plus size={18} />
              Add project
            </button>
            {draft.projects.map((project, index) => (
              <CardShell
                key={project.id}
                title={project.title}
                subtitle={project.subtitle}
                onDelete={() => deleteItem(["projects"], index)}
              >
                <TextInput label="Title" value={project.title} onChange={(value) => updateField(["projects", index, "title"], value)} />
                <TextInput label="Subtitle" value={project.subtitle} onChange={(value) => updateField(["projects", index, "subtitle"], value)} />
                <TextInput label="Image URL" value={project.imageUrl} onChange={(value) => updateField(["projects", index, "imageUrl"], value)} />
                <TextInput label="Live URL" value={project.liveUrl} onChange={(value) => updateField(["projects", index, "liveUrl"], value)} />
                <TextInput label="Repo URL" value={project.repoUrl} onChange={(value) => updateField(["projects", index, "repoUrl"], value)} />
                <TextInput label="Tags" value={project.tags.join(", ")} onChange={(value) => updateField(["projects", index, "tags"], splitComma(value))} />
                <TextArea label="Description" value={project.description} onChange={(value) => updateField(["projects", index, "description"], value)} />
                <Toggle label="Featured" checked={project.featured} onChange={(value) => updateField(["projects", index, "featured"], value)} />
              </CardShell>
            ))}
          </div>
        ) : null}

        {activeTab === "skills" ? (
          <div className="editor-stack">
            <button
              className="button secondary"
              type="button"
              onClick={() => addItem(["skills"], { category: "New Category", items: ["New skill"] })}
            >
              <Plus size={18} />
              Add skill group
            </button>
            {draft.skills.map((group, index) => (
              <CardShell key={`${group.category}-${index}`} title={group.category} onDelete={() => deleteItem(["skills"], index)}>
                <TextInput label="Category" value={group.category} onChange={(value) => updateField(["skills", index, "category"], value)} />
                <TextArea label="Skills" value={group.items.join(", ")} onChange={(value) => updateField(["skills", index, "items"], splitComma(value))} />
              </CardShell>
            ))}
          </div>
        ) : null}

        {activeTab === "experience" ? (
          <div className="editor-stack">
            <button
              className="button secondary"
              type="button"
              onClick={() =>
                addItem(["experience"], {
                  id: makeId("experience"),
                  company: "Company",
                  role: "Role",
                  location: "Location",
                  startDate: "2026",
                  endDate: "Present",
                  summary: "Summarize responsibilities and impact.",
                  highlights: ["Add a measurable highlight."],
                })
              }
            >
              <Plus size={18} />
              Add experience
            </button>
            {draft.experience.map((item, index) => (
              <CardShell key={item.id} title={item.role} subtitle={item.company} onDelete={() => deleteItem(["experience"], index)}>
                <TextInput label="Company" value={item.company} onChange={(value) => updateField(["experience", index, "company"], value)} />
                <TextInput label="Role" value={item.role} onChange={(value) => updateField(["experience", index, "role"], value)} />
                <TextInput label="Location" value={item.location} onChange={(value) => updateField(["experience", index, "location"], value)} />
                <TextInput label="Start date" value={item.startDate} onChange={(value) => updateField(["experience", index, "startDate"], value)} />
                <TextInput label="End date" value={item.endDate} onChange={(value) => updateField(["experience", index, "endDate"], value)} />
                <TextArea label="Summary" value={item.summary} onChange={(value) => updateField(["experience", index, "summary"], value)} />
                <TextArea label="Highlights" rows={5} value={item.highlights.join("\n")} onChange={(value) => updateField(["experience", index, "highlights"], splitLines(value))} />
              </CardShell>
            ))}
          </div>
        ) : null}

        {activeTab === "education" ? (
          <div className="editor-stack">
            <button
              className="button secondary"
              type="button"
              onClick={() => addItem(["education"], { id: makeId("education"), institution: "Institution", degree: "Degree", period: "Year", details: "Details" })}
            >
              <Plus size={18} />
              Add education
            </button>
            {draft.education.map((item, index) => (
              <CardShell key={item.id} title={item.degree} subtitle={item.institution} onDelete={() => deleteItem(["education"], index)}>
                <TextInput label="Institution" value={item.institution} onChange={(value) => updateField(["education", index, "institution"], value)} />
                <TextInput label="Degree" value={item.degree} onChange={(value) => updateField(["education", index, "degree"], value)} />
                <TextInput label="Period" value={item.period} onChange={(value) => updateField(["education", index, "period"], value)} />
                <TextArea label="Details" value={item.details} onChange={(value) => updateField(["education", index, "details"], value)} />
              </CardShell>
            ))}
            <button
              className="button secondary"
              type="button"
              onClick={() => addItem(["certifications"], { id: makeId("certification"), name: "Certification", issuer: "Issuer", year: "2026", url: "https://example.com" })}
            >
              <Plus size={18} />
              Add certification
            </button>
            {draft.certifications.map((item, index) => (
              <CardShell key={item.id} title={item.name} subtitle={item.issuer} onDelete={() => deleteItem(["certifications"], index)}>
                <TextInput label="Name" value={item.name} onChange={(value) => updateField(["certifications", index, "name"], value)} />
                <TextInput label="Issuer" value={item.issuer} onChange={(value) => updateField(["certifications", index, "issuer"], value)} />
                <TextInput label="Year" value={item.year} onChange={(value) => updateField(["certifications", index, "year"], value)} />
                <TextInput label="URL" value={item.url} onChange={(value) => updateField(["certifications", index, "url"], value)} />
              </CardShell>
            ))}
          </div>
        ) : null}

        {activeTab === "contact" ? (
          <div className="editor-stack">
            <CardShell title="Contact details" subtitle="Shown in the contact section">
              <TextInput label="Email" value={draft.contact.email} onChange={(value) => updateField(["contact", "email"], value)} />
              <TextInput label="Phone" value={draft.contact.phone} onChange={(value) => updateField(["contact", "phone"], value)} />
              <TextInput label="Location" value={draft.contact.location} onChange={(value) => updateField(["contact", "location"], value)} />
              <TextInput label="Preferred channel" value={draft.contact.preferred} onChange={(value) => updateField(["contact", "preferred"], value)} />
              <TextArea label="Contact message" value={draft.contact.message} onChange={(value) => updateField(["contact", "message"], value)} />
              <TextInput label="Web3Forms Access Key" type="password" value={draft.contact.form.web3FormsKey} onChange={(value) => updateField(["contact", "form", "web3FormsKey"], value)} />
              <TextInput label="Form title" value={draft.contact.form.title} onChange={(value) => updateField(["contact", "form", "title"], value)} />
              <TextInput label="Form recipient email" value={draft.contact.form.recipientEmail} onChange={(value) => updateField(["contact", "form", "recipientEmail"], value)} />
              <TextInput label="Name label" value={draft.contact.form.nameLabel} onChange={(value) => updateField(["contact", "form", "nameLabel"], value)} />
              <TextInput label="Visitor email label" value={draft.contact.form.emailLabel} onChange={(value) => updateField(["contact", "form", "emailLabel"], value)} />
              <TextInput label="Contact number label" value={draft.contact.form.phoneLabel} onChange={(value) => updateField(["contact", "form", "phoneLabel"], value)} />
              <TextInput label="Need label" value={draft.contact.form.needLabel} onChange={(value) => updateField(["contact", "form", "needLabel"], value)} />
              <TextInput label="Goals label" value={draft.contact.form.goalsLabel} onChange={(value) => updateField(["contact", "form", "goalsLabel"], value)} />
              <TextInput label="Submit label" value={draft.contact.form.submitLabel} onChange={(value) => updateField(["contact", "form", "submitLabel"], value)} />
              <TextInput label="Email subject prefix" value={draft.contact.form.subjectPrefix} onChange={(value) => updateField(["contact", "form", "subjectPrefix"], value)} />
              <TextInput label="Success message" value={draft.contact.form.successMessage} onChange={(value) => updateField(["contact", "form", "successMessage"], value)} />
            </CardShell>
            <button
              className="button secondary"
              type="button"
              onClick={() => addItem(["socialLinks"], { label: "New Link", url: "https://example.com", type: "link" })}
            >
              <Plus size={18} />
              Add social link
            </button>
            {draft.socialLinks.map((link, index) => (
              <CardShell key={`${link.url}-${index}`} title={link.label} subtitle={link.url} onDelete={() => deleteItem(["socialLinks"], index)}>
                <TextInput label="Label" value={link.label} onChange={(value) => updateField(["socialLinks", index, "label"], value)} />
                <TextInput label="URL" value={link.url} onChange={(value) => updateField(["socialLinks", index, "url"], value)} />
                <TextInput label="Icon type" value={link.type} onChange={(value) => updateField(["socialLinks", index, "type"], value)} />
              </CardShell>
            ))}
          </div>
        ) : null}

        {activeTab === "settings" ? (
          <div className="editor-stack">
            <CardShell title="Admin settings" subtitle="Simple client-side protection for the dashboard">
              <TextInput label="Admin password" value={draft.admin.password} onChange={(value) => updateField(["admin", "password"], value)} />
              <TextInput label="Admin title" value={draft.admin.title} onChange={(value) => updateField(["admin", "title"], value)} />
              <TextArea label="Admin subtitle" value={draft.admin.subtitle} onChange={(value) => updateField(["admin", "subtitle"], value)} />
              <TextInput label="Password hint" value={draft.admin.hint} onChange={(value) => updateField(["admin", "hint"], value)} />
            </CardShell>
            <CardShell title="Import and export" subtitle="Move edited content between browsers or promote it back into portfolio.json">
              <div className="settings-actions">
                <button className="button secondary" type="button" onClick={exportData}>
                  <Download size={18} />
                  Export JSON
                </button>
                <button className="button ghost" type="button" onClick={reset}>
                  <RefreshCcw size={18} />
                  Reset local edits
                </button>
              </div>
              <TextArea label="Paste portfolio JSON" rows={8} value={importText} onChange={setImportText} />
              <button className="button secondary" type="button" onClick={importData}>
                <Upload size={18} />
                Import JSON
              </button>
              <details className="json-preview">
                <summary>View original seed JSON</summary>
                <pre>{JSON.stringify(seedData, null, 2)}</pre>
              </details>
            </CardShell>
          </div>
        ) : null}
      </section>
    </main>
  );
}
