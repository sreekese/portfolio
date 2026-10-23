import Image from "next/image";
import photo from "@/assets/sreekese-photo-clean.png";
import { HeroAvatar } from "@/components/hero-avatar";
import { connection } from "next/server";
import { Header } from "@/components/header";
import { Work } from "@/components/work";
import { Contact } from "@/components/contact";
import { HeroName, Motion } from "@/components/motion";
import { portfolio, safeExternalUrl } from "@/lib/portfolio";
export default async function Home() {
  // Request rendering allows Next.js to attach the per-request CSP nonce.
  await connection();
  const socialLinks = portfolio.elsewhere.map(([label, url]) => ({
    label,
    url,
  }));
  return (
    <div id="top" className="page">
      <Motion />
      <Header name={portfolio.name} />
      <main id="main">
        <section className="hero wrap" aria-label="Introduction">
          <span className="avail mono">
            <i aria-hidden="true" />
            {portfolio.status}
          </span>
          <div className="hero-identity">
            <div className="hero-copy">
              <HeroName name={portfolio.name} />
              <p className="tagline">{portfolio.tagline}</p>
            </div>
            <HeroAvatar />
          </div>
        </section>
        <Work projects={portfolio.projects} skills={portfolio.skills}>
          <div>
            <p className="lede">{portfolio.lede}</p>
            <div className="cta">
              <a className="btn" href="#work">
                View selected work{" "}
                <span className="ar" aria-hidden="true">
                  →
                </span>
              </a>
              <a className="btn ghost" href="#contact">
                Get in touch
              </a>
            </div>
            <p className="sample-note mono">
              React.js · JavaScript · TypeScript
            </p>
          </div>
        </Work>
        <section className="stats" aria-label="Career at a glance">
          <div className="wrap">
            {portfolio.stats.map(([number, suffix, label]) => (
              <div className="stat" key={label}>
                <strong>
                  {number}
                  <sup>{suffix}</sup>
                </strong>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </section>
        <div className="mq" aria-hidden="true">
          <div className="mq-track">
            {[...portfolio.marquee, ...portfolio.marquee].map((text, i) => (
              <span key={i}>
                {text} <i>✦</i>
              </span>
            ))}
          </div>
        </div>
        <section className="sec" id="about">
          <div className="wrap">
            <span className="eyebrow mono">About</span>
            <div className="about-grid">
              <h2 className="statement">{portfolio.statement}</h2>
              <div className="portrait personal-portrait">
                <svg className="ring" viewBox="0 0 200 200" aria-hidden="true">
                  <defs>
                    <path
                      id="portrait-circle"
                      d="M100,100 m-86,0 a86,86 0 1,1 172,0 a86,86 0 1,1 -172,0"
                    />
                  </defs>
                  <text>
                    <textPath href="#portrait-circle">
                      HTML / CSS / JavaScript /PHP / FastAPI / React.js /
                    </textPath>
                  </text>
                </svg>
                <div className="portrait-photo">
                  <Image
                    src={photo}
                    alt="Sreekese P S outdoors, wearing glasses and a burgundy shirt"
                    fill
                    sizes="(max-width: 720px) 250px, 260px"
                  />
                </div>
              </div>
            </div>
            <div className="services">
              {portfolio.services.map((service) => (
                <article className="svc" key={service.t}>
                  <div className="ic" aria-hidden="true">
                    <svg
                      width="22"
                      height="22"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="1.8"
                    >
                      <path d={service.ic} />
                    </svg>
                  </div>
                  <h3>{service.t}</h3>
                  <p>{service.d}</p>
                  <ul>
                    {service.l.map((item) => (
                      <li key={item}>{item}</li>
                    ))}
                  </ul>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="sec" id="experience">
          <div className="wrap">
            <span className="eyebrow mono">Experience</span>
            <h2 className="h2">
              Seven years. <em>Building for the web.</em>
            </h2>
            <div className="xp">
              {portfolio.experience.map((job) => (
                <article className="job" key={`${job.org}-${job.when}`}>
                  <i aria-hidden="true" />
                  <div className="when mono">{job.when}</div>
                  <div className="body">
                    <h3>{job.role}</h3>
                    <div className="org">{job.org}</div>
                    <p>{job.d}</p>
                    <ul className="job-highlights">
                      {job.highlights.map((item) => (
                        <li key={item}>{item}</li>
                      ))}
                    </ul>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </section>
        <section className="sec" id="learning" aria-labelledby="learning-title">
          <div className="wrap">
            <span className="eyebrow mono">Education & certifications</span>
            <h2 className="h2" id="learning-title">
              A foundation for <em>what’s next.</em>
            </h2>
            <div className="learning-grid">
              <div>
                <h3>Education</h3>
                {portfolio.education.map((entry) => (
                  <article className="education-entry" key={entry.year}>
                    <span className="mono mute">
                      {entry.year} · {entry.result}
                    </span>
                    <h4>{entry.qualification}</h4>
                    <p>{entry.institution}</p>
                  </article>
                ))}
              </div>
              <div>
                <h3>Certifications</h3>
                <ul className="certifications">
                  {portfolio.certifications.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </section>
        <section className="sec" id="contact">
          <div className="wrap">
            <div className="contact">
              <span className="eyebrow mono">Contact</span>
              <h2 className="h2">
                Let’s build your next <em>application.</em>
              </h2>
              <Contact email={portfolio.email} />
              <p className="contact-details">
                <a href={portfolio.phoneHref}>{portfolio.phone}</a>
                <span>{portfolio.location}</span>
              </p>
              <div className="else mono">
                {socialLinks.map(({ label, url }) => {
                  const safe = safeExternalUrl(url);
                  return safe ? (
                    <a
                      key={label}
                      href={safe}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {label} ↗
                    </a>
                  ) : null;
                })}
              </div>
            </div>
            <footer className="foot mono">
              <span>{portfolio.name} · Software Engineer</span>
              <span>Software engineering · React.js</span>
            </footer>
          </div>
        </section>
      </main>
    </div>
  );
}
