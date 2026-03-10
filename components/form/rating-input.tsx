import React, { forwardRef } from 'react';
import { Star } from 'lucide-react';

export interface RatingInputProps {
    /** Input label */
    label?: string;
    /** Current rating value (1-5) */
    value: number;
    /** Callback when rating changes */
    onChange: (value: number) => void;
    /** Error message to display */
    error?: string;
    /** Helper text below input */
    hint?: string;
    /** Is the input required? (Adds *) */
    required?: boolean;
    /** Disabled state */
    disabled?: boolean;
    /** Max rating value (default 5) */
    max?: number;
    /** Star icon size (default 24) */
    size?: number;
}

export const RatingInput = forwardRef<HTMLDivElement, RatingInputProps>(function RatingInput(
    {
        label,
        value,
        onChange,
        error,
        hint,
        required,
        disabled,
        max = 5,
        size = 24,
    },
    ref
) {
    const stars = Array.from({ length: max }, (_, i) => i + 1);

    return (
        <div ref={ref}>
            {label && (
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                    {label} {required && <span className="text-red-500">*</span>}
                </label>
            )}

            <div className="flex gap-2">
                {stars.map((star) => (
                    <button
                        key={star}
                        type="button"
                        onClick={() => onChange(star)}
                        disabled={disabled}
                        className="p-0 bg-transparent border-none cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-gray-300 rounded-sm disabled:cursor-not-allowed transition-transform active:scale-95"
                    >
                        <Star
                            size={size}
                            fill={star <= value ? '#fbbf24' : 'none'}
                            color={star <= value ? '#fbbf24' : '#cbd5e1'}
                            className="transition-colors"
                        />
                    </button>
                ))}
            </div>

            {error && <p className="mt-1.5 text-xs text-red-500">{error}</p>}
            {hint && !error && <p className="mt-1.5 text-xs text-gray-500">{hint}</p>}
        </div>
    );
});

export default RatingInput;
