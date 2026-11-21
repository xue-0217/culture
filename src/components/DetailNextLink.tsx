import { ArrowLeft, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

interface DetailNextLinkProps {
  to: string;
  label: string;
  title: string;
  atEnd?: boolean;
}

export default function DetailNextLink({ to, label, title, atEnd = false }: DetailNextLinkProps) {
  const Arrow = atEnd ? ArrowLeft : ArrowRight;
  return (
    <nav className="detail-continuation wrap" aria-label="继续浏览">
      <Link to={to} state={{ focusContent: true }} className="detail-next-link" data-end={atEnd || undefined}>
        <span className="detail-next-copy">
          <span className="editorial-label">{label}</span>
          <strong>{title}</strong>
        </span>
        <Arrow size={26} aria-hidden="true" />
      </Link>
    </nav>
  );
}
