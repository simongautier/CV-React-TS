export interface Experience {
  period: string;
  title: string;
  company: string;
  category: 'it' | 'other';
  location?: string;
  bullets?: string[];
  note?: string;
}

export interface EducationEntry {
  year: string;
  degree: string;
  school: string;
  detail?: string;
}

export interface Language {
  name: string;
  level: string;
}

export const profile = {
  name: 'Simon GAUTIER',
  title: 'Technicien informatique — Sécurité informatique',
  tagline:
    "De nature extrêmement curieuse, j'aime comprendre avant d'apprendre.",
  summary:
    "Un antécédent de nature médicale m'a contraint à stopper mon activité professionnelle. Cette pause n'ayant eu aucun impact sur mes capacités est désormais terminée et je reprends une activité en tant que technicien.",
  description:
    "Passionné d'informatique, d'automobile et de musique, j'aime autant comprendre le fonctionnement d'un système que celui d'un moteur. Cette curiosité se retrouve aussi bien dans mes projets techniques que dans mes centres d'intérêt. Pour me détendre, rien ne vaut une balade à moto ou une bonne session de jeux vidéo.",
  contact: {
    email: 'simon-gautier@hotmail.com',
    phone: '07 83 91 84 41',
    license: 'Permis A et B',
  },
};

export const experiences: Experience[] = [
  {
    period: '07/2023 — aujourd’hui',
    title: 'Pause professionnelle',
    company: 'Raison médicale, reprise en cours',
    category: 'it',
    bullets: [
      'Réalisation de projets personnels',
      'Préparation de la certification CKA (Certified Kubernetes Administrator)',
    ],
  },
  {
    period: '2021 — 2023',
    title: 'Référent cyber-sécurité',
    company: 'SPIE ICS',
    category: 'it',
    note: 'Alternance',
    bullets: [
      "Plusieurs missions clients",
      "Assistance aux projets d'intégration d'équipements réseau de niveau 2 et 3",
      "Suivi des formations de l'entreprise (Fortinet, Meraki, Yubico)",
      'Remplacement d’équipements réseaux de niveau 2 (HP, Juniper)',
      'Déploiement Microsoft Active Directory',
      'Formation interne et création d’une PKI Windows AD',
      'Construction des serveurs pour certains clients',
    ],
  },
  {
    period: '2020',
    title: 'Technicien support niveau 1',
    company: 'BCE (RTL Group)',
    category: 'it',
    location: 'Luxembourg',
    bullets: [
      "Migration de la plateforme de gestion des appareils mobiles professionnels du groupe RTL de Microsoft Azure InTune vers MobileIron",
      'Mise à jour de la flotte PC du groupe RTL de Windows 7 vers Windows 10',
      'Installation de bureaux pour les nouveaux employés',
    ],
  },
  {
    period: '2020',
    title: 'Employé polyvalent',
    company: 'Super U L’Hermitage',
    category: 'other',
  },
  {
    period: '2019',
    title: 'Technicien informatique',
    company: 'Rennes Métropole',
    category: 'it',
    note: 'Contractuel',
    bullets: ['Surveillance Nagios et Centreon', 'Mise à niveau des switchs du parc administré par Rennes Métropole'],
  },
  {
    period: '2018',
    title: 'Surveillant parcs et jardins de Rennes',
    company: 'Rennes Métropole',
    category: 'other',
  },
];

export const extraExperiences: string[] = [
  "Participation aux phases qualificatives du CTF Étudiants de l'ECW au FIC (Lille 2022)",
  "Participation à la réalisation d'une plateforme de CTF au sein du Pôle Supérieur De La Salle",
  'Participation à un challenge CTF organisé par la DGSE',
  'Certified Stormshield Network Administrator (13/03/2026)',
];

export const education: EducationEntry[] = [
  {
    year: '2023',
    degree: 'Mastère Sécurité Informatique',
    school: 'Pôle Sup De La Salle, Rennes',
  },
  {
    year: '2021',
    degree: 'Bachelor Sécurité Informatique',
    school: 'Pôle Sup De La Salle, Rennes',
  },
  {
    year: '2020',
    degree: 'BTS Services Informatique aux Organisations',
    school: 'Pôle Sup De La Salle, Rennes',
    detail: 'Option Solutions d’infrastructure, Systèmes et Réseaux',
  },
];

export const skills = {
  languages: ['JavaScript', 'Python', 'C', 'C++', 'C#', 'CSS', 'HTML', 'ASM x64', 'ASM x86', 'Bash'],
  tools: ['VirtualBox', 'VMware', 'Wireshark', 'Windows AD', 'Nmap', 'Metasploit', 'Fuzz', 'Dnsrecon', 'Aircrack-ng'],
  other: ['Fortinet : NSE 1 - 2 - 3 - 4', 'Score Root-Me : 1800 points'],
};

export const spokenLanguages: Language[] = [
  { name: 'Français', level: 'Voltaire : 706 points' },
  { name: 'Anglais', level: 'Courant (TOEIC 890)' },
];

export const interests: string[] = [
  'Jeux vidéo',
  'Mécanique automobile et moto',
  "Apprendre des langues différentes",
  'Piano',
];
