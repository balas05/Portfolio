import { useState } from "react";
import {
  ArrowUpRight,
  Award,
  BriefcaseBusiness,
  Download,
  Github,
  GraduationCap,
  Linkedin,
  Mail,
  MapPin,
  Moon,
  Phone,
  Send,
  Sparkles,
  Sun,
  Twitter,
  Terminal,
  BrainCircuit,
  Database,
  Box,
} from "lucide-react";

const getSkillIcon = (skillName) => {
  const key = skillName.toLowerCase();
  const map = {
    "c++": "cplusplus",
    "html": "html5",
    "css": "css3",
    "vscode": "visualstudiocode",
    "googlecolab": "googlecolab",
    "machinelearning": "brain",
    "nlp": "message",
    "genai": "sparkles",
    "codex": "code",
    "sql": "sqlite",
  };
  
  if (map[key] === "brain" || key.includes("machine") || key.includes("ai") || key.includes("nlp")) return <BrainCircuit size={24} className="skill-icon-fallback" />;
  if (map[key] === "sparkles") return <Sparkles size={24} className="skill-icon-fallback" />;
  if (map[key] === "code" || key.includes("code")) return <Terminal size={24} className="skill-icon-fallback" />;
  if (map[key] === "message") return <Send size={24} className="skill-icon-fallback" />;
  
  const iconId = map[key] || key;
  return <img src={`https://cdn.simpleicons.org/${iconId}`} alt={skillName} className="skill-logo" loading="lazy" onError={(e) => e.target.style.display = 'none'} />;
};

const socialIcons = {
  github: Github,
  linkedin: Linkedin,
  twitter: Twitter,
  x: Twitter,
};

function SectionHeader({ section }) {
  return (
    <div className="section-header">
      <p>{section.eyebrow}</p>
      <h2>{section.title}</h2>
      <span>{section.description}</span>
    </div>
  );
}

function Header({ data, theme, onToggleTheme }) {
  const ThemeIcon = theme === "dark" ? Sun : Moon;

  return (
    <header className="site-header">
      <a className="brand" href="#top" aria-label={data.personal.name}>
        <span>{data.personal.name.slice(0, 1)}</span>
        {data.personal.name}
      </a>
      <nav aria-label="Primary navigation">
        {data.navigation.map((item) => (
          <a key={item.href} href={item.href}>
            {item.label}
            
          </a>
        ))}
      </nav>
      <div className="header-actions">
        <button className="theme-toggle" type="button" onClick={onToggleTheme} aria-label="Toggle theme">
          <ThemeIcon size={18} />
        </button>
        <a className="admin-entry" href={data.site.adminPath}>
          CMS
        </a>
      </div>
    </header>
  );
}

function MosaicName({ name }) {
  return (
    <h1 className="mosaic-name" aria-label={name}>
      {name.split("").map((char, index) =>
        char === " " ? (
          <span className="mosaic-space" aria-hidden="true" key={`${char}-${index}`} />
        ) : (
          <span aria-hidden="true" key={`${char}-${index}`} style={{ "--tile-index": index }}>
            {char}
          </span>
        ),
      )}
    </h1>
  );
}

function MosaicPortrait({ data }) {
  const imageTiles = [
    { src: data.personal.avatarUrl, alt: data.personal.name, className: "primary" },
    ...data.projects.slice(0, 4).map((project, index) => ({
      src: project.imageUrl,
      alt: project.title,
      className: `project-${index + 1}`,
    })),
  ].filter((tile) => tile.src);

  return (
    <div className="mosaic-portrait" aria-label={`${data.personal.name} visual portfolio mosaic`}>
      {imageTiles.map((tile, index) => (
        <div className={`mosaic-tile ${tile.className}`} key={`${tile.src}-${index}`}>
          <img src={tile.src} alt={tile.alt} />
        </div>
      ))}
      <div className="mosaic-info availability-chip">
        <Sparkles size={16} />
        <span>{data.personal.availability}</span>
      </div>
      <div className="mosaic-info location-chip">
        <MapPin size={16} />
        <span>{data.personal.location}</span>
      </div>
    </div>
  );
}

function Hero({ data }) {
  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <p className="eyebrow">{data.personal.role}</p>
        <MosaicName name={data.personal.name} />
        <p className="tagline">{data.personal.tagline}</p>
        <div className="hero-actions">
          <a className="button primary" href="#projects">
            <Sparkles size={18} />
            {data.sections.projects.title}
          </a>
          <a className="button secondary" href={data.personal.resumeUrl}>
            <Download size={18} />
            Resume
          </a>
        </div>
      </div>
      <MosaicPortrait data={data} />
    </section>
  );
}

function About({ data }) {
  return (
    <section id="about" className="section">
      <SectionHeader section={data.sections.about} />
      <div className="about-grid">
        <p className="about-copy">{data.personal.about}</p>
        <div className="stats-grid">
          {data.stats.map((stat) => (
            <div className="stat" key={stat.label}>
              <strong>{stat.value}</strong>
              <span>{stat.label}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

function Skills({ data }) {
  return (
    <section id="skills" className="section tinted">
      <SectionHeader section={data.sections.skills} />
      <div className="bento-skill-grid">
        {data.skills.map((group) => (
          <article className="bento-skill-card" key={group.category}>
            <div className="bento-card-header">
              <h3>{group.category}</h3>
            </div>
            <div className="bento-skill-items">
              {group.items.map((skill) => (
                <div className="iconic-skill-pill" key={skill}>
                  {getSkillIcon(skill)}
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Projects({ data }) {
  return (
    <section id="projects" className="section">
      <SectionHeader section={data.sections.projects} />
      <div className="project-grid">
        {data.projects.map((project) => (
          <article className="project-card" key={project.id}>
            <img src={project.imageUrl} alt={project.title} />
            <div className="project-body">
              <div>
                <p>{project.subtitle}</p>
                <h3>{project.title}</h3>
                <span>{project.description}</span>
              </div>
              <div className="tags">
                {project.tags.map((tag) => (
                  <span key={tag}>{tag}</span>
                ))}
              </div>
              <div className="project-links">
                <a href={project.liveUrl}>
                  Live
                  <ArrowUpRight size={16} />
                </a>
                <a href={project.repoUrl}>
                  Code
                  <ArrowUpRight size={16} />
                </a>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function Experience({ data }) {
  return (
    <section id="experience" className="section tinted">
      <SectionHeader section={data.sections.experience} />
      <div className="timeline">
        {data.experience.map((item) => (
          <article className="timeline-item" key={item.id}>
            <div className="timeline-icon">
              <BriefcaseBusiness size={20} />
            </div>
            <div>
              <p>{item.startDate} - {item.endDate}</p>
              <h3>{item.role}</h3>
              <span>{item.company} · {item.location}</span>
              <p>{item.summary}</p>
              <ul>
                {item.highlights.map((highlight) => (
                  <li key={highlight}>{highlight}</li>
                ))}
              </ul>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

function EducationAndCertifications({ data }) {
  return (
    <section className="section split-section">
      <div>
        <SectionHeader section={data.sections.education} />
        <div className="compact-list">
          {data.education.map((item) => (
            <article key={item.id}>
              <GraduationCap size={20} />
              <div>
                <h3>{item.degree}</h3>
                <p>{item.institution} · {item.period}</p>
                <span>{item.details}</span>
              </div>
            </article>
          ))}
        </div>
      </div>
      <div>
        <SectionHeader section={data.sections.certifications} />
        <div className="compact-list">
          {data.certifications.map((item) => (
            <article key={item.id}>
              <Award size={20} />
              <div>
                <h3>{item.name}</h3>
                <p>{item.issuer} · {item.year}</p>
                <a href={item.url}>Credential</a>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function Contact({ data }) {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", need: "", goals: "" });
  const [formStatus, setFormStatus] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const form = data.contact.form;

  const updateForm = (field, value) => {
    setFormData((current) => ({ ...current, [field]: value }));
    setFormStatus("");
  };

  const submitForm = async (event) => {
    event.preventDefault();
    setIsSubmitting(true);
    setFormStatus("Sending...");

    const accessKey = form.web3FormsKey;

    if (!accessKey) {
        setFormStatus("Configuration Error: Web3Forms Access Key is missing.");
        setIsSubmitting(false);
        return;
    }

    const payload = {
        access_key: accessKey,
        subject: `${form.subjectPrefix} ${formData.name}`,
        from_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        need: formData.need,
        message: formData.goals,
    };

    try {
        const response = await fetch("https://api.web3forms.com/submit", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
            body: JSON.stringify(payload),
        });
        const result = await response.json();
        
        if (result.success) {
            setFormStatus(form.successMessage || "Message sent successfully!");
            setFormData({ name: "", email: "", phone: "", need: "", goals: "" });
        } else {
            setFormStatus(result.message || "Something went wrong.");
        }
    } catch (error) {
        setFormStatus("Failed to send message. Please try again later.");
    }
    
    setIsSubmitting(false);
  };

  return (
    <section id="contact" className="section contact-section">
      <SectionHeader section={data.sections.contact} />
      <div className="contact-grid">
        <div className="contact-card">
          <p>{data.contact.message}</p>
          <a href={`mailto:${data.contact.email}`}>
            <Mail size={18} />
            {data.contact.email}
          </a>
          <a href={`tel:${data.contact.phone}`}>
            <Phone size={18} />
            {data.contact.phone}
          </a>
          <span>
            <MapPin size={18} />
            {data.contact.location}
          </span>
        </div>
        <form className="contact-form-card" onSubmit={submitForm}>
          <h3>{form.title}</h3>
          <label>
            <span>{form.nameLabel}</span>
            <input
              required
              type="text"
              value={formData.name}
              onChange={(event) => updateForm("name", event.target.value)}
            />
          </label>
          <label>
            <span>{form.emailLabel}</span>
            <input
              required
              type="email"
              value={formData.email}
              onChange={(event) => updateForm("email", event.target.value)}
            />
          </label>
          <label>
            <span>{form.phoneLabel}</span>
            <input
              required
              type="tel"
              value={formData.phone}
              onChange={(event) => updateForm("phone", event.target.value)}
            />
          </label>
          <label>
            <span>{form.needLabel}</span>
            <input
              required
              type="text"
              value={formData.need}
              onChange={(event) => updateForm("need", event.target.value)}
            />
          </label>
          <label>
            <span>{form.goalsLabel}</span>
            <textarea
              required
              rows={5}
              value={formData.goals}
              onChange={(event) => updateForm("goals", event.target.value)}
            />
          </label>
          <button className="button primary" type="submit" disabled={isSubmitting}>
            <Mail size={18} />
            {isSubmitting ? "Sending..." : form.submitLabel}
          </button>
          {formStatus ? <p className="contact-form-status">{formStatus}</p> : null}
        </form>
        <div className="social-grid">
          {data.socialLinks.map((link) => {
            const Icon = socialIcons[link.type] || Send;
            return (
              <a key={link.url} href={link.url}>
                <Icon size={20} />
                <span>{link.label}</span>
                <ArrowUpRight size={16} />
              </a>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export default function PublicPortfolio({ data, theme, onToggleTheme }) {
  return (
    <div className="portfolio-shell">
      <Header data={data} theme={theme} onToggleTheme={onToggleTheme} />
      <main>
        <Hero data={data} />
        <About data={data} />
        <Skills data={data} />
        <Projects data={data} />
        <Experience data={data} />
        <EducationAndCertifications data={data} />
        <Contact data={data} />
      </main>
    </div>
  );
}
