import React, { type InputHTMLAttributes, forwardRef } from 'react';

export interface FilterDateProps extends InputHTMLAttributes<HTMLInputElement> {
    /** Optional label/placeholder text for accessibility or visual pairing */
    label?: string;
}

export const FilterDate = forwardRef<HTMLInputElement, FilterDateProps>(function FilterDate(
    { className = '', label, ...props },
    ref
) {
    return (
        <input
            type="date"
            ref={ref}
            aria-label={label}
            className={`text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 cursor-pointer ${className}`}
            {...props}
        />
    );
});

export default FilterDate;
