import Section from './Section';
import TerminalHeader from './TerminalHeader';
import { experiences, extraExperiences, education, type Experience } from '../data/cv';

function ExperienceItem({ exp }: { exp: Experience }) {
  return (
    <li className="timeline-item">
      <div className="timeline-period">{exp.period}</div>
      <div className="timeline-body">
        <h3>
          {exp.title} — {exp.company}
          {exp.location ? ` · ${exp.location}` : ''}
          {exp.note ? <span className="note"> ({exp.note})</span> : null}
        </h3>
        {exp.bullets && exp.bullets.length > 0 && (
          <ul>
            {exp.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        )}
      </div>
    </li>
  );
}

export default function Main() {
  const itExperiences = experiences.filter((exp) => exp.category === 'it');
  const otherExperiences = experiences.filter((exp) => exp.category === 'other');

  return (
    <main className="main">
      <TerminalHeader animate={false} />

      <Section title="Expériences">
        <h3 className="timeline-group-title">Informatique &amp; Sécurité</h3>
        <ol className="timeline">
          {itExperiences.map((exp) => (
            <ExperienceItem exp={exp} key={`${exp.period}-${exp.title}`} />
          ))}
        </ol>

        {otherExperiences.length > 0 && (
          <>
            <h3 className="timeline-group-title timeline-group-title--spaced">Autres expériences</h3>
            <ol className="timeline">
              {otherExperiences.map((exp) => (
                <ExperienceItem exp={exp} key={`${exp.period}-${exp.title}`} />
              ))}
            </ol>
          </>
        )}
      </Section>

      <Section title="Expériences annexes">
        <ul>
          {extraExperiences.map((e) => (
            <li key={e}>{e}</li>
          ))}
        </ul>
      </Section>

      <Section title="Formation">
        <ol className="timeline">
          {education.map((ed) => (
            <li className="timeline-item" key={`${ed.year}-${ed.degree}`}>
              <div className="timeline-period">{ed.year}</div>
              <div className="timeline-body">
                <h3>{ed.degree}</h3>
                <p className="school">{ed.school}</p>
                {ed.detail && <p className="detail">{ed.detail}</p>}
              </div>
            </li>
          ))}
        </ol>
      </Section>
    </main>
  );
}
