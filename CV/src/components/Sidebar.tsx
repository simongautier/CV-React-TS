import Section from './Section';
import { profile, skills, spokenLanguages, interests } from '../data/cv';

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <Section title="Contact" className="sidebar-section">
        <ul className="plain-list">
          <li>
            <a href={`mailto:${profile.contact.email}`}>{profile.contact.email}</a>
          </li>
          <li>
            <a href={`tel:${profile.contact.phone.replace(/\s/g, '')}`}>{profile.contact.phone}</a>
          </li>
          <li>{profile.contact.license}</li>
        </ul>
      </Section>

      <Section title="Profil" className="sidebar-section">
        <p className="tagline">{profile.tagline}</p>
      </Section>

      <Section title="Compétences" className="sidebar-section">
        <h3 className="sub-heading">Langages</h3>
        <div className="chip-list">
          {skills.languages.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
        <h3 className="sub-heading">Outils</h3>
        <div className="chip-list">
          {skills.tools.map((s) => (
            <span className="chip" key={s}>
              {s}
            </span>
          ))}
        </div>
        <h3 className="sub-heading">Autres</h3>
        <ul className="plain-list">
          {skills.other.map((s) => (
            <li key={s}>{s}</li>
          ))}
        </ul>
      </Section>

      <Section title="Langues" className="sidebar-section">
        <ul className="plain-list">
          {spokenLanguages.map((l) => (
            <li key={l.name}>
              <strong>{l.name}</strong> — {l.level}
            </li>
          ))}
        </ul>
      </Section>

      <Section title="Centres d’intérêt" className="sidebar-section">
        <ul className="plain-list two-col">
          {interests.map((i) => (
            <li key={i}>{i}</li>
          ))}
        </ul>
      </Section>
    </aside>
  );
}
