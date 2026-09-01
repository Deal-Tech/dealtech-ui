import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, type LucideIcon } from 'lucide-react';

import type { BadgeVariant } from '@/components/ui/badge/Badge';
import './badgev2.css';

const VARIANT_COLOR: Record<BadgeVariant, string> = {
  green: 'var(--app-success-text)',
  amber: 'var(--app-warning-text)',
  red: 'var(--app-danger-text)',
  blue: 'var(--app-primary-hover)',
  purple: 'var(--app-primary-deep)',
  gray: 'var(--app-neutral)',
};

export interface BadgeV2Option {
  value: string;
  label: string;
  icon: LucideIcon;
  variant?: BadgeVariant;
  color?: string;
}

export interface BadgeV2Props {
  value: string;
  onValueChange: (value: string) => void;
  options: BadgeV2Option[];
  className?: string;
  disabled?: boolean;
}

function resolveColor(o: { variant?: BadgeVariant; color?: string }): string {
  return o.color ?? VARIANT_COLOR[o.variant ?? 'gray'];
}

interface Pos {
  top: number;
  left: number;
}

export function BadgeV2({
  value,
  onValueChange,
  options,
  className = '',
  disabled = false,
}: BadgeV2Props) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  const selected = options.find((o) => String(o.value) === String(value)) ?? options[0];

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    setPos({ top: r.bottom + 4, left: r.left });
  };

  useLayoutEffect(() => {
    if (open) place();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const onDoc = (e: MouseEvent) => {
      const t = e.target as Node;
      if (triggerRef.current?.contains(t) || panelRef.current?.contains(t)) return;
      setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    const reposition = () => place();
    document.addEventListener('mousedown', onDoc);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', reposition);
    window.addEventListener('scroll', reposition, true);
    return () => {
      document.removeEventListener('mousedown', onDoc);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', reposition);
      window.removeEventListener('scroll', reposition, true);
    };
  }, [open]);

  if (!selected) return null;

  const SelectedIcon = selected.icon;
  const variantClass = selected.color ? '' : `badgev2__trigger--${selected.variant ?? 'gray'}`;

  const pick = (v: string) => {
    onValueChange(v);
    setOpen(false);
  };

  return (
    <div className={`badgev2 ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`badgev2__trigger ${variantClass}`}
        style={selected.color ? { backgroundColor: selected.color } : undefined}
      >
        <SelectedIcon className="badgev2__icon" />
        {selected.label}
        <ChevronDown className={`badgev2__chevron ${open ? 'badgev2__chevron--open' : ''}`} />
      </button>

      {open && pos
        ? createPortal(
            <div
              ref={panelRef}
              style={{ position: 'fixed', top: pos.top, left: pos.left, zIndex: 9999 }}
              className="badgev2__panel animate-fade-in-scale"
            >
              {options.map((opt) => {
                const active = String(opt.value) === String(value);
                const OptIcon = opt.icon;
                return (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => pick(opt.value)}
                    className={`badgev2__option ${active ? 'badgev2__option--active' : ''}`}
                  >
                    <OptIcon className="badgev2__option-icon" style={{ color: resolveColor(opt) }} />
                    <span className="badgev2__option-label">{opt.label}</span>
                    <Check
                      className={`badgev2__check ${active ? 'badgev2__check--visible' : ''}`}
                    />
                  </button>
                );
              })}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export default BadgeV2;
