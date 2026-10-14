import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';
import { systemsReviewLabel } from './brandContent';

/** One public conversion destination; never implies that intake is enabled. */
export function SystemsReviewLink({ className = 'public-button', arrow = false }: { className?: string; arrow?: boolean }) {
  return <Link to="/contact" className={className}>{systemsReviewLabel}{arrow && <ArrowRight aria-hidden="true" />}</Link>;
}
