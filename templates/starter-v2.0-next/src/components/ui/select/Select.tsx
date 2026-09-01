import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, ChevronUp } from 'lucide-react';

import './select.css';

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  options?: SelectOption[];
  placeholder?: string;
  className?: string;
  triggerClassName?: string;
  panelClassName?: string;
  disabled?: boolean;
  searchable?: boolean;
}

interface Pos {
  top: number | 'auto';
  bottom: number | 'auto';
  left: number | 'auto';
  right: number | 'auto';
  width: number;
}

export function Select({
  value,
  onValueChange,
  options = [],
  placeholder = 'Pilih',
  className = '',
  triggerClassName = '',
  panelClassName = '',
  disabled = false,
  searchable = false,
}: SelectProps) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState<Pos | null>(null);
  const [canUp, setCanUp] = useState(false);
  const [canDown, setCanDown] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const triggerRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const scrollTimer = useRef<number | null>(null);
  const selected = options.find((o) => String(o.value) === String(value));

  const place = () => {
    const el = triggerRef.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const minWidth = 176;
    const panelWidth = Math.max(r.width, minWidth);
    const estimatedHeight = 320;

    let top: number | 'auto' = r.bottom + 4;
    let bottom: number | 'auto' = 'auto';
    if (r.bottom + estimatedHeight > window.innerHeight && r.top > window.innerHeight - r.bottom) {
      top = 'auto';
      bottom = window.innerHeight - r.top + 4;
    }

    let left: number | 'auto' = r.left;
    let right: number | 'auto' = 'auto';
    if (r.left + panelWidth > window.innerWidth) {
      left = 'auto';
      right = window.innerWidth - r.right;
    }

    setPos({ top, bottom, left, right, width: r.width });
  };

  const updateScroll = () => {
    const el = listRef.current;
    if (!el) return;
    setCanUp(el.scrollTop > 0);
    setCanDown(el.scrollTop + el.clientHeight < el.scrollHeight - 1);
  };

  const stopScroll = () => {
    if (scrollTimer.current) {
      clearInterval(scrollTimer.current);
      scrollTimer.current = null;
    }
  };
  const startScroll = (dir: number) => {
    stopScroll();
    scrollTimer.current = window.setInterval(() => {
      const el = listRef.current;
      if (!el) return;
      el.scrollTop += dir * 14;
      updateScroll();
    }, 16);
  };

  useLayoutEffect(() => {
    if (open) {
      place();
      requestAnimationFrame(updateScroll);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) {
      setSearchQuery('');
      return;
    }
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

  useEffect(() => () => stopScroll(), []);

  const pick = (v: string) => {
    onValueChange?.(v);
    setOpen(false);
  };

  const filteredOptions =
    searchable && searchQuery.trim() !== ''
      ? options.filter((opt) => opt.label.toLowerCase().includes(searchQuery.toLowerCase()))
      : options;

  return (
    <div className={className}>
      <button
        ref={triggerRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((o) => !o)}
        className={`select__trigger ${triggerClassName}`}
      >
        <span className={`select__value ${selected ? '' : 'select__value--placeholder'}`}>
          {selected ? selected.label : placeholder}
        </span>
        <ChevronDown className={`select__chevron ${open ? 'select__chevron--open' : ''}`} />
      </button>

      {open && pos
        ? createPortal(
            <div
              ref={panelRef}
              style={{
                position: 'fixed',
                top: pos.top,
                bottom: pos.bottom,
                left: pos.left,
                right: pos.right,
                width: pos.width,
                minWidth: 176,
                zIndex: 9999,
              }}
              className={`select__panel animate-fade-in-scale ${pos.bottom !== 'auto' ? 'select__panel--top' : ''} ${panelClassName}`}
            >
              {searchable ? (
                <div className="select__search-wrap">
                  <input
                    type="text"
                    placeholder="Cari..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onClick={(e) => e.stopPropagation()}
                    onKeyDown={(e) => e.stopPropagation()}
                    autoFocus
                    className="select__search"
                  />
                </div>
              ) : null}

              {canUp ? (
                <div
                  className="select__scroll-btn"
                  onMouseEnter={() => startScroll(-1)}
                  onMouseLeave={stopScroll}
                >
                  <ChevronUp className="select__scroll-icon" />
                </div>
              ) : null}

              <div ref={listRef} onScroll={updateScroll} className="select__list">
                {filteredOptions.length === 0 ? (
                  <div className="select__empty">Tidak ada data</div>
                ) : (
                  filteredOptions.map((opt) => {
                    const active = String(opt.value) === String(value);
                    return (
                      <button
                        key={String(opt.value)}
                        type="button"
                        onClick={() => pick(opt.value)}
                        className={`select__option ${active ? 'select__option--active' : ''}`}
                      >
                        <Check
                          className={`select__check ${active ? 'select__check--visible' : ''}`}
                        />
                        <span className="select__option-label">{opt.label}</span>
                      </button>
                    );
                  })
                )}
              </div>

              {canDown ? (
                <div
                  className="select__scroll-btn"
                  onMouseEnter={() => startScroll(1)}
                  onMouseLeave={stopScroll}
                >
                  <ChevronDown className="select__scroll-icon" />
                </div>
              ) : null}
            </div>,
            document.body,
          )
        : null}
    </div>
  );
}

export default Select;
