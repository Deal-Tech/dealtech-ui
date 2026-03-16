import type { SelectHTMLAttributes } from 'react';

interface FilterSelectProps extends SelectHTMLAttributes<HTMLSelectElement> {
  allLabel?: string;
  options: (string | { value: string; label: string })[];
  className?: string;
}

const FilterSelect = ({
  allLabel = 'Semua',
  options,
  className = '',
  ...props
}: FilterSelectProps) => (
  <select
    className={`rounded border border-neutral-300/50 bg-white px-3 py-2 text-sm transition-all duration-200 focus:border-[#334a34] focus:outline-none focus:ring-2 focus:ring-[#334a34]/40 ${className}`}
    {...props}
  >
    <option value="">{allLabel}</option>
    {options.map((opt) => {
      const val = typeof opt === 'string' ? opt : opt.value;
      const label = typeof opt === 'string' ? opt : opt.label;
      return (
        <option key={val} value={val}>
          {label}
        </option>
      );
    })}
  </select>
);

export default FilterSelect;

