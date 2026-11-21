import { ArrowUpRight } from 'lucide-react';
import type { ReadingSection } from '../data/exhibition';

interface DetailReadingProps {
  title: string;
  sections: ReadingSection[];
  source?: { label: string; url: string };
}

export default function DetailReading({ title, sections, source }: DetailReadingProps) {
  return (
    <section className="detail-reading wrap" aria-labelledby="detail-reading-title">
      <h2 id="detail-reading-title">{title}</h2>
      <div className="detail-reading-body">
        {sections.map(section => (
          <section key={section.heading} className="detail-reading-section">
            <h3>{section.heading}</h3>
            {section.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
          </section>
        ))}
        {source && (
          <a className="detail-reading-source" href={source.url} target="_blank" rel="noreferrer">
            {source.label} <ArrowUpRight size={15} aria-hidden="true" />
          </a>
        )}
      </div>
    </section>
  );
}
