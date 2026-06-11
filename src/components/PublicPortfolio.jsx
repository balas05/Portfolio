import { useState, useEffect } from "react";
import { Radar, RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, ResponsiveContainer } from "recharts";
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

function useTypewriter(words, typingSpeed = 70, deletingSpeed = 40, pauseTime = 2000) {
  const [text, setText] = useState("");
  const [wordIndex, setWordIndex] = useState(0);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[wordIndex];
    let timer;

    if (isDeleting) {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length - 1));
        if (text.length === 0) {
          setIsDeleting(false);
          setWordIndex((prev) => (prev + 1) % words.length);
        }
      }, deletingSpeed);
    } else {
      timer = setTimeout(() => {
        setText(currentWord.substring(0, text.length + 1));
        if (text.length === currentWord.length) {
          timer = setTimeout(() => setIsDeleting(true), pauseTime);
        }
      }, typingSpeed);
    }

    return () => clearTimeout(timer);
  }, [text, isDeleting, wordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return text;
}

function Hero({ data }) {
  const roles = [data.personal.role, "AI & Machine Learning Enthusiast", "Problem Solver"];
  const currentRole = useTypewriter(roles);

  return (
    <section className="hero" id="top">
      <div className="hero-copy">
        <div className="status-badge">
          <span className="status-dot"></span>
          Available for new roles
        </div>
        <p className="eyebrow typewriter-text">
          {currentRole}<span className="typewriter-cursor">|</span>
        </p>
        <MosaicName name={data.personal.name} />
        <p className="tagline">{data.personal.tagline}</p>
        
        <div className="quick-stats-row">
          <div className="quick-stat"><GraduationCap size={16} /> B.Tech AI</div>
          <div className="quick-stat"><Terminal size={16} /> Full Stack Dev</div>
          <div className="quick-stat"><Github size={16} /> Open Source</div>
        </div>

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

function LeetCodeStats({ socialLinks }) {
  const leetcodeLink = socialLinks.find(link => link.type.toLowerCase() === 'leetcode');
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!leetcodeLink) {
      setLoading(false);
      return;
    }
    
    // Extract username from URL (e.g. https://leetcode.com/u/username/)
    const match = leetcodeLink.url.match(/leetcode\.com\/(?:u\/)?([^\/]+)/);
    const username = match ? match[1] : null;

    if (!username) {
      setError(true);
      setLoading(false);
      return;
    }

    fetch(`https://leetcode-stats-api.herokuapp.com/${username}`)
      .then(res => res.json())
      .then(data => {
        if (data.status === "success") {
          setStats(data);
        } else {
          setError(true);
        }
        setLoading(false);
      })
      .catch(() => {
        setError(true);
        setLoading(false);
      });
  }, [leetcodeLink]);

  if (!leetcodeLink) return null;
  if (loading) return <div className="leetcode-widget skeleton">Loading LeetCode stats...</div>;
  if (error || !stats) return null;

  return (
    <div className="leetcode-widget">
      <div className="lc-header">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="lc-logo">
          <path d="M13.483 0a1.374 1.374 0 0 0-.961.438L7.116 6.226l-3.854 4.126a5.266 5.266 0 0 0-1.209 2.104 5.35 5.35 0 0 0-.125.513 5.527 5.527 0 0 0 .062 2.362 5.83 5.83 0 0 0 .349 1.017 5.938 5.938 0 0 0 1.271 1.818l4.277 4.193.039.038c2.248 2.165 5.852 2.133 8.063-.074l2.396-2.392c.54-.54.54-1.414.003-1.955a1.378 1.378 0 0 0-1.951-.003l-2.396 2.392a3.021 3.021 0 0 1-4.205.038l-.02-.019-4.276-4.193c-.652-.64-.972-1.469-.948-2.263a2.68 2.68 0 0 1 .066-.523 2.545 2.545 0 0 1 .619-1.164L9.13 8.114c1.058-1.134 3.204-1.27 4.43-.278l3.501 2.831c.593.48 1.461.387 1.956-.207a1.384 1.384 0 0 0-.207-1.953l-3.5-2.831c-.861-.695-1.906-1.005-2.867-.866L14.277 1.233A1.374 1.374 0 0 0 13.483 0zm-2.866 12.815a1.38 1.38 0 0 0-1.38 1.382 1.38 1.38 0 0 0 1.38 1.382H20.79a1.38 1.38 0 0 0 1.38-1.382 1.38 1.38 0 0 0-1.38-1.382z"/>
        </svg>
        <h4>LeetCode Stats</h4>
        <span className="lc-rank">Rank: {stats.ranking.toLocaleString()}</span>
      </div>
      <div className="lc-stats-grid">
        <div className="lc-stat lc-easy">
          <span>Easy</span>
          <strong>{stats.easySolved} <span>/ {stats.totalEasy}</span></strong>
        </div>
        <div className="lc-stat lc-medium">
          <span>Medium</span>
          <strong>{stats.mediumSolved} <span>/ {stats.totalMedium}</span></strong>
        </div>
        <div className="lc-stat lc-hard">
          <span>Hard</span>
          <strong>{stats.hardSolved} <span>/ {stats.totalHard}</span></strong>
        </div>
      </div>
      <div className="lc-progress-bar">
        <div className="lc-progress easy" style={{ width: `${(stats.easySolved / stats.totalQuestions) * 100}%` }}></div>
        <div className="lc-progress medium" style={{ width: `${(stats.mediumSolved / stats.totalQuestions) * 100}%` }}></div>
        <div className="lc-progress hard" style={{ width: `${(stats.hardSolved / stats.totalQuestions) * 100}%` }}></div>
      </div>
      <p className="lc-total">Total Solved: <strong>{stats.totalSolved}</strong> ({stats.acceptanceRate}% Acceptance)</p>
    </div>
  );
}

function About({ data }) {
  return (
    <section id="about" className="section">
      <SectionHeader section={data.sections.about} />
      <div className="about-grid">
        <div className="about-terminal">
          <div className="terminal-header">
            <div className="terminal-dots">
              <span className="dot red"></span>
              <span className="dot yellow"></span>
              <span className="dot green"></span>
            </div>
            <span className="terminal-title">guest@bala-portfolio: ~</span>
          </div>
          <div className="terminal-body">
            <p className="command"><span className="prompt">$</span> cat about_bala.txt</p>
            <p className="output">{data.personal.about}</p>
            <p className="command"><span className="prompt">$</span> <span className="typewriter-cursor">|</span></p>
          </div>
        </div>
        <div className="about-sidebar">
          <div className="stats-grid">
            {data.stats.map((stat) => (
              <div className="stat" key={stat.label}>
                <strong>{stat.value}</strong>
                <span>{stat.label}</span>
              </div>
            ))}
          </div>
          <LeetCodeStats socialLinks={data.socialLinks} />
        </div>
      </div>
    </section>
  );
}

function Skills({ data }) {
  const radarData = [
    { subject: 'AI / ML', A: 95, fullMark: 100 },
    { subject: 'Frontend', A: 85, fullMark: 100 },
    { subject: 'Backend', A: 80, fullMark: 100 },
    { subject: 'DSA', A: 90, fullMark: 100 },
    { subject: 'Databases', A: 85, fullMark: 100 },
    { subject: 'Cloud', A: 75, fullMark: 100 },
  ];

  return (
    <section id="skills" className="section tinted">
      <SectionHeader section={data.sections.skills} />
      <div className="bento-skill-grid">
        <article className="bento-skill-card radar-card">
          <div className="bento-card-header">
            <h3>Technical Distribution</h3>
          </div>
          <div style={{ width: '100%', height: 350, marginTop: '-20px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="75%" data={radarData}>
                <PolarGrid stroke="var(--line)" />
                <PolarAngleAxis dataKey="subject" tick={{ fill: 'var(--charcoal)', fontSize: 12, fontWeight: 600 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Skills" dataKey="A" stroke="var(--teal)" fill="var(--teal)" fillOpacity={0.4} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </article>
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
