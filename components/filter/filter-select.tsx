import React, { type SelectHTMLAttributes, forwardRef } from 'react';

export interface FilterOption {
    value: string | number;
    label: string;
}

export interface FilterSelectProps extends Omit<SelectHTMLAttributes<HTMLSelectElement>, 'options'> {
    /** Array of options to display */
    options: FilterOption[];
    /** Default/placeholder option (shown as first option) */
    placeholder?: string;
    /** Hide placeholder (only show if provided) */
    hidePlaceholder?: boolean;
}

export const FilterSelect = forwardRef<HTMLSelectElement, FilterSelectProps>(function FilterSelect(
    { options, placeholder = 'Semua', hidePlaceholder = false, className = '', ...props },
    ref
) {
    return (
        <select
            ref={ref}
            className={`text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 min-w-[140px] cursor-pointer appearance-none bg-[url('data:image/svg+xml;charset=US-ASCII,%3Csvg%20width%3D%2220%22%20height%3D%2220%22%20viewBox%3D%220%200%2024%2024%22%20fill%3D%22none%22%20stroke%3D%22currentColor%22%20stroke-width%3D%222%22%20stroke-linecap%3D%22round%22%20stroke-linejoin%3D%22round%22%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%3E%3Cpath%20d%3D%22m6%209%206%206%206-6%22%2F%3E%3C%2Fsvg%3E')] bg-[length:1em_1em] bg-[right_0.5rem_center] bg-no-repeat pr-8 ${className}`}
            {...props}
        >
            {!hidePlaceholder && (
                <option value="">{placeholder}</option>
            )}
            {options.map((opt) => (
                <option key={opt.value} value={opt.value}>
                    {opt.label}
                </option>
            ))}
        </select>
    );
});

export default FilterSelect;
