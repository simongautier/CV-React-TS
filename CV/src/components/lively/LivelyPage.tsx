import TerminalHeader from '../TerminalHeader';
import NavBar from './NavBar';
import BubbleField from './BubbleField';
import {
  profile,
  experiences,
  extraExperiences,
  education,
  skills,
  spokenLanguages,
  interests,
  type Experience,
} from '../../data/cv';
import './lively.css';

function ExperienceCard({ exp, id }: { exp: Experience; id: string }) {
  return (
    <article className="lv-card" id={id}>
      <span className="lv-card-period">{exp.period}</span>
      <h3>{exp.title}</h3>
      <p className="lv-card-company">
        {exp.company}
        {exp.location ? ` · ${exp.location}` : ''}
        {exp.note ? ` (${exp.note})` : ''}
      </p>
      {exp.bullets && exp.bullets.length > 0 && (
        <ul>
          {exp.bullets.map((b) => (
            <li key={b}>{b}</li>
          ))}
        </ul>
      )}
    </article>
  );
}

export default function LivelyPage() {
  const indexedExperiences = experiences.map((exp, i) => ({ exp, id: `exp-${i}` }));
  const itExperiences = indexedExperiences.filter(({ exp }) => exp.category === 'it');
  const otherExperiences = indexedExperiences.filter(({ exp }) => exp.category === 'other');

  return (
    <div className="lively" id="top">
      <NavBar />

      <section className="lv-hero">
        <TerminalHeader />
        <p className="lv-hero-sub">{profile.tagline}</p>
      </section>

      <section className="lv-section" id="profil">
        <h2 className="lv-heading">Profil</h2>
        <p className="lv-profile-text">{profile.description}</p>
        <div className="lv-badges">
          <span className="lv-badge">{profile.contact.license}</span>
          {interests.map((i) => (
            <span className="lv-badge" key={i}>
              {i}
            </span>
          ))}
        </div>
      </section>

      <section className="lv-section" id="experiences">
        <h2 className="lv-heading">Expériences</h2>

        <h3 className="lv-subheading">Informatique &amp; Sécurité</h3>
        <div className="lv-card-grid">
          {itExperiences.map(({ exp, id }) => (
            <ExperienceCard exp={exp} id={id} key={id} />
          ))}
        </div>

        {otherExperiences.length > 0 && (
          <>
            <h3 className="lv-subheading lv-subheading--spaced">Autres expériences</h3>
            <div className="lv-card-grid">
              {otherExperiences.map(({ exp, id }) => (
                <ExperienceCard exp={exp} id={id} key={id} />
              ))}
            </div>
          </>
        )}

        <div className="lv-extra">
          <h3 className="lv-subheading">Expériences annexes</h3>
          <ul>
            {extraExperiences.map((e) => (
              <li key={e}>{e}</li>
            ))}
          </ul>
        </div>
      </section>

      <section className="lv-section" id="formation">
        <h2 className="lv-heading">Formation</h2>
        <div className="lv-card-grid">
          {education.map((ed, i) => (
            <article className="lv-card" id={`edu-${i}`} key={`${ed.year}-${ed.degree}`}>
              <span className="lv-card-period">{ed.year}</span>
              <h3>{ed.degree}</h3>
              <p className="lv-card-company">{ed.school}</p>
              {ed.detail && <p className="lv-card-detail">{ed.detail}</p>}
            </article>
          ))}
        </div>
      </section>

      <section className="lv-section" id="competences">
        <h2 className="lv-heading">Compétences</h2>
        <div className="lv-bubble-grid">
          <div id="skills-languages">
            <h3 className="lv-subheading">Langages</h3>
            <BubbleField items={skills.languages} tone="lang" />
          </div>
          <div id="skills-tools">
            <h3 className="lv-subheading">Outils</h3>
            <BubbleField items={skills.tools} tone="tool" />
          </div>
          <div id="skills-other">
            <h3 className="lv-subheading">Autres</h3>
            <BubbleField items={skills.other} tone="other" />
          </div>
        </div>
        <div className="lv-languages">
          {spokenLanguages.map((l) => (
            <span className="lv-lang-pill" key={l.name}>
              <strong>{l.name}</strong> — {l.level}
            </span>
          ))}
        </div>
      </section>

      <section className="lv-section lv-contact" id="contact">
        <h2 className="lv-heading">Contact</h2>
        <div className="lv-contact-links">
          <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
          <a href={`tel:${profile.contact.phone.replace(/\s/g, '')}`}>{profile.contact.phone}</a>
        </div>
      </section>
    </div>
  );
}
