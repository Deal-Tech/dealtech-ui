import type { SelectHTMLAttributes } from 'react';
import { forwardRef } from 'react';

export interface SelectOption {
    value: string | number;
    label: string;
}

export interface SelectFieldProps extends SelectHTMLAttributes<HTMLSelectElement> {
    /** Label text */
    label?: string;
    /** Error message */
    error?: string;
    /** Helper text */
    hint?: string;
    /** Options list */
    options: SelectOption[];
    /** Placeholder text for empty value */
    placeholder?: string;
}

const inputClass = 'w-full text-sm px-3 py-2.5 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50';

export const SelectField = forwardRef<HTMLSelectElement, SelectFieldProps>(function SelectField(
    { label, error, hint, options, placeholder = 'Pilih...', className = '', ...props },
    ref,
) {
    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label}
                    {props.required && <span className="text-red-500 ml-0.5">*</span>}
                </label>
            )}
            <select
                ref={ref}
                className={`${inputClass} ${error ? 'border-red-300 focus:ring-red-300' : ''} ${className}`}
                {...props}
            >
                <option value="">{placeholder}</option>
                {options.map((opt) => (
                    <option key={opt.value} value={opt.value}>
                        {opt.label}
                    </option>
                ))}
            </select>
            {hint && !error && <p className="text-xs text-gray-400 mt-1">{hint}</p>}
            {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>
    );
});

export default SelectField;
