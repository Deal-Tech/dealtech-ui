import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from '@/components/ui/button/Button';
import './pagination.css';

const ELLIPSIS = '…';

export interface PaginationProps {
  current: number;
  last: number;
  onNavigate: (page: number) => void;
  info?: string;
  className?: string;
}

const clamp = (v: number, lo: number, hi: number) => Math.min(Math.max(v, lo), hi);

function buildPages(current: number, last: number, mode: 'desktop' | 'mobile'): Array<number | string> {
  if (mode === 'mobile') {
    if (last <= 4) return Array.from({ length: last }, (_, i) => i + 1);
    const start = clamp(current - 1, 1, Math.max(1, last - 3));
    const out: number[] = [];
    for (let p = start; p < start + 4 && p <= last; p++) out.push(p);
    return out;
  }

  const maxFull = 7;
  if (last <= maxFull) return Array.from({ length: last }, (_, i) => i + 1);

  const out: Array<number | string> = [1];
  const start = Math.max(2, current - 1);
  const end = Math.min(last - 1, current + 1);
  if (start > 2) out.push(ELLIPSIS);
  for (let p = start; p <= end; p++) out.push(p);
  if (end < last - 1) out.push(ELLIPSIS);
  out.push(last);
  return out;
}

interface RowProps {
  pages: Array<number | string>;
  current: number;
  last: number;
  onNavigate: (page: number) => void;
  extraClass: string;
}

function Row({ pages, current, last, onNavigate, extraClass }: RowProps) {
  return (
    <div className={`pagination__row ${extraClass}`}>
      <Button
        variant="ghost"
        className="pagination__nav"
        disabled={current <= 1}
        onClick={() => onNavigate(current - 1)}
        aria-label="Sebelumnya"
      >
        <ChevronLeft className="pagination__nav-icon" />
      </Button>

      {pages.map((p, i) =>
        p === ELLIPSIS ? (
          <span key={`e${i}`} className="pagination__ellipsis">
            {ELLIPSIS}
          </span>
        ) : (
          <Button
            key={p}
            variant={p === current ? 'primary' : 'ghost'}
            className="pagination__page"
            aria-current={p === current ? 'page' : undefined}
            onClick={() => onNavigate(Number(p))}
          >
            {p}
          </Button>
        ),
      )}

      <Button
        variant="ghost"
        className="pagination__nav"
        disabled={current >= last}
        onClick={() => onNavigate(current + 1)}
        aria-label="Berikutnya"
      >
        <ChevronRight className="pagination__nav-icon" />
      </Button>
    </div>
  );
}

export function Pagination({ current, last, onNavigate, info, className = '' }: PaginationProps) {
  if (!last || last <= 1) return null;

  return (
    <div className={`pagination ${className}`}>
      {info ? <p className="pagination__info">{info}</p> : null}
      <Row
        pages={buildPages(current, last, 'desktop')}
        current={current}
        last={last}
        onNavigate={onNavigate}
        extraClass="pagination__row--desktop"
      />
      <Row
        pages={buildPages(current, last, 'mobile')}
        current={current}
        last={last}
        onNavigate={onNavigate}
        extraClass="pagination__row--mobile"
      />
    </div>
  );
}

export default Pagination;
