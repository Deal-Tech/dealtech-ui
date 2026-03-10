import React, { type InputHTMLAttributes, forwardRef } from 'react';

export interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Input label */
    label?: string;
    /** Error message to display */
    error?: string;
    /** Helper text below input */
    hint?: string;
    /** Whether to include time (datetime-local vs date) */
    withTime?: boolean;
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
    { label, error, hint, withTime = false, className = '', required, disabled, ...props },
    ref
) {
    const inputType = withTime ? 'datetime-local' : 'date';

    return (
        <div>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <input
                ref={ref}
                type={inputType}
                required={required}
                disabled={disabled}
                className={`w-full text-sm px-3 py-2.5 rounded-lg border bg-white focus:outline-none focus:ring-2 transition-shadow disabled:opacity-50 disabled:bg-gray-50 cursor-pointer
                    ${error
                        ? 'border-red-500 focus:border-red-500 focus:ring-red-500/20'
                        : 'border-gray-200 focus:ring-gray-300'
                    } ${className}`}
                {...props}
            />

            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
        </div>
    );
});

export default DateInput;
