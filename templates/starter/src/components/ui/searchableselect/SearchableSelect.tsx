import { useEffect, useMemo, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { Check, ChevronDown, Search } from 'lucide-react';
import { Input } from '../input/Input';

export interface SearchableSelectOption {
  value: string;
  label: string;
  keywords?: string;
}

interface SearchableSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: SearchableSelectOption[];
  selectPlaceholder?: string;
  searchPlaceholder?: string;
  emptyText?: string;
  disabled?: boolean;
  className?: string;
  searchClassName?: string;
  selectClassName?: string;
}

const SearchableSelect = ({
  value,
  onChange,
  options,
  selectPlaceholder = 'Pilih...',
  searchPlaceholder = 'Cari...',
  emptyText = 'Data tidak ditemukan',
  disabled = false,
  className = '',
  searchClassName = '',
  selectClassName = '',
}: SearchableSelectProps) => {
  const rootRef = useRef<HTMLDivElement | null>(null);
  const triggerRef = useRef<HTMLButtonElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const searchInputRef = useRef<HTMLInputElement | null>(null);

  const [open, setOpen] = useState(false);
  const [keyword, setKeyword] = useState('');
  const [dropdownStyle, setDropdownStyle] = useState<{ top: number; left: number; width: number; maxHeight: number }>({
    top: 0,
    left: 0,
    width: 0,
    maxHeight: 240,
  });

  const normalizedKeyword = keyword.trim().toLowerCase();

  const filteredOptions = useMemo(() => {
    if (!normalizedKeyword) return options;

    return options.filter((option) => {
      const haystack = `${option.label} ${option.keywords || ''}`.toLowerCase();
      return haystack.includes(normalizedKeyword);
    });
  }, [normalizedKeyword, options]);

  const selectedOption = useMemo(
    () => options.find((option) => option.value === value) || null,
    [options, value]
  );

  const closeMenu = () => {
    setOpen(false);
    setKeyword('');
  };

  const selectValue = (nextValue: string) => {
    onChange(nextValue);
    closeMenu();
  };

  const updateDropdownPosition = () => {
    if (!triggerRef.current) return;
    const rect = triggerRef.current.getBoundingClientRect();
    const top = rect.bottom + 4;
    const maxHeight = Math.max(120, window.innerHeight - rect.bottom - 12);

    setDropdownStyle({
      top,
      left: rect.left,
      width: rect.width,
      maxHeight,
    });
  };

  useEffect(() => {
    if (!open) return;

    const onDocumentClick = (event: MouseEvent) => {
      const target = event.target as Node;
      const clickedTrigger = rootRef.current?.contains(target);
      const clickedMenu = dropdownRef.current?.contains(target);
      if (!clickedTrigger && !clickedMenu) closeMenu();
    };

    updateDropdownPosition();
    document.addEventListener('mousedown', onDocumentClick);
    window.addEventListener('resize', updateDropdownPosition);
    window.addEventListener('scroll', updateDropdownPosition, true);

    return () => {
      document.removeEventListener('mousedown', onDocumentClick);
      window.removeEventListener('resize', updateDropdownPosition);
      window.removeEventListener('scroll', updateDropdownPosition, true);
    };
  }, [open]);

  useEffect(() => {
    if (open) {
      searchInputRef.current?.focus();
    }
  }, [open]);

  return (
    <div ref={rootRef} className={`relative ${className}`}>
      <button
        ref={triggerRef}
        type="button"
        onClick={() => {
          if (disabled) return;
          setOpen((prev) => {
            const next = !prev;
            if (next) {
              requestAnimationFrame(updateDropdownPosition);
            }
            return next;
          });
        }}
        disabled={disabled}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`flex w-full items-center justify-between gap-2 rounded border border-neutral-300/50 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-[#334a34] focus:outline-none focus:ring-2 focus:ring-[#334a34]/40 disabled:cursor-not-allowed disabled:bg-gray-50 disabled:text-gray-400 ${selectClassName}`}
      >
        <span className={selectedOption ? 'text-gray-900' : 'text-gray-400'}>
          {selectedOption?.label || selectPlaceholder}
        </span>
        <ChevronDown size={16} className={`text-neutral-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open &&
        typeof document !== 'undefined' &&
        createPortal(
          <div
            ref={dropdownRef}
            role="listbox"
            style={{
              top: dropdownStyle.top,
              left: dropdownStyle.left,
              width: dropdownStyle.width,
              maxHeight: dropdownStyle.maxHeight,
            }}
            className="fixed z-[1000] rounded border border-gray-200 bg-white shadow-lg"
            onKeyDown={(event) => {
              if (event.key === 'Escape') {
                closeMenu();
              }
            }}
          >
            <div className="border-b border-gray-100 p-2">
              <div className="relative">
                <Search size={14} className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
                <Input
                  ref={searchInputRef}
                  type="text"
                  value={keyword}
                  onChange={(event) => setKeyword(event.target.value)}
                  placeholder={searchPlaceholder}
                  className={`h-9 py-1.5 pl-9 ${searchClassName}`}
                />
              </div>
            </div>

            <div className="overflow-auto py-1" style={{ maxHeight: Math.max(80, dropdownStyle.maxHeight - 56) }}>
              <button
                type="button"
                role="option"
                aria-selected={value === ''}
                onClick={() => selectValue('')}
                className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                  value === '' ? 'bg-[#334a34]/[0.06] text-[#334a34] font-medium' : 'text-gray-700'
                }`}
              >
                <span>{selectPlaceholder}</span>
                {value === '' && <Check size={14} className="text-[#334a34]" />}
              </button>

              {filteredOptions.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  role="option"
                  aria-selected={value === option.value}
                  onClick={() => selectValue(option.value)}
                  className={`flex w-full items-center justify-between px-3 py-2 text-left text-sm transition-colors hover:bg-gray-50 ${
                    value === option.value ? 'bg-[#334a34]/[0.06] text-[#334a34] font-medium' : 'text-gray-700'
                  }`}
                >
                  <span className="truncate pr-3">{option.label}</span>
                  {value === option.value && <Check size={14} className="shrink-0 text-[#334a34]" />}
                </button>
              ))}

              {normalizedKeyword && filteredOptions.length === 0 && (
                <p className="px-3 py-2 text-sm text-neutral-400">{emptyText}</p>
              )}
            </div>
          </div>,
          document.body
        )}
    </div>
  );
};

export default SearchableSelect;