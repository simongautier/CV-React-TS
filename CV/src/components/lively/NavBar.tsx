import { useEffect, useRef, useState } from 'react';
import { experiences, education } from '../../data/cv';
import { scrollToId } from './scrollToId';

interface DropdownEntry {
  label: string;
  id: string;
}

interface NavItem {
  label: string;
  id: string;
  dropdown?: DropdownEntry[];
}

const navItems: NavItem[] = [
  { label: 'Profil', id: 'profil' },
  {
    label: 'Expériences',
    id: 'experiences',
    dropdown: experiences.map((exp, i) => ({ label: exp.company, id: `exp-${i}` })),
  },
  {
    label: 'Formation',
    id: 'formation',
    dropdown: education.map((ed, i) => ({ label: ed.degree, id: `edu-${i}` })),
  },
  {
    label: 'Compétences',
    id: 'competences',
    dropdown: [
      { label: 'Langages', id: 'skills-languages' },
      { label: 'Outils', id: 'skills-tools' },
      { label: 'Autres', id: 'skills-other' },
    ],
  },
  { label: 'Contact', id: 'contact' },
];

export default function NavBar() {
  const [openId, setOpenId] = useState<string | null>(null);
  const navRef = useRef<HTMLElement>(null);

  useEffect(() => {
    function handleOutsideClick(e: MouseEvent) {
      if (navRef.current && !navRef.current.contains(e.target as Node)) {
        setOpenId(null);
      }
    }
    document.addEventListener('click', handleOutsideClick);
    return () => document.removeEventListener('click', handleOutsideClick);
  }, []);

  return (
    <nav className="lv-nav" ref={navRef}>
      <a
        className="lv-nav-brand"
        href="#top"
        onClick={(e) => {
          e.preventDefault();
          scrollToId('top');
          setOpenId(null);
        }}
      >
        SG<span className="lv-nav-brand-dot">.</span>
      </a>
      <ul className="lv-nav-list">
        {navItems.map((item) => (
          <li
            key={item.id}
            className="lv-nav-item"
            onMouseEnter={() => item.dropdown && setOpenId(item.id)}
            onMouseLeave={() => item.dropdown && setOpenId(null)}
          >
            <button
              type="button"
              className="lv-nav-link"
              onClick={() => {
                scrollToId(item.id);
                setOpenId((cur) => (item.dropdown ? (cur === item.id ? null : item.id) : null));
              }}
            >
              {item.label}
              {item.dropdown && <span className="lv-caret">▾</span>}
            </button>
            {item.dropdown && (
              <ul className={`lv-dropdown ${openId === item.id ? 'is-open' : ''}`}>
                {item.dropdown.map((entry) => (
                  <li key={entry.id}>
                    <button
                      type="button"
                      onClick={() => {
                        scrollToId(entry.id);
                        setOpenId(null);
                      }}
                    >
                      {entry.label}
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </li>
        ))}
      </ul>
    </nav>
  );
}
