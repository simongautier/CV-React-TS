import type { ReactNode } from 'react';

interface SectionProps {
  title: string;
  children: ReactNode;
  className?: string;
}

export default function Section({ title, children, className }: SectionProps) {
  return (
    <section className={`section ${className ?? ''}`}>
      <h2 className="section-title">{title}</h2>
      {children}
    </section>
  );
}
