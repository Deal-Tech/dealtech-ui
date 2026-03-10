import { type InputHTMLAttributes, forwardRef } from 'react';
import { Search } from 'lucide-react';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
    /** Show search icon (default: true) */
    showIcon?: boolean;
}

const inputClass = 'text-sm px-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300 min-w-[250px] flex-1 max-w-md';

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
    { showIcon = true, className = '', placeholder = 'Cari...', ...props },
    ref,
) {
    if (!showIcon) {
        return (
            <input
                ref={ref}
                type="text"
                placeholder={placeholder}
                className={`${inputClass} ${className}`}
                {...props}
            />
        );
    }

    return (
        <div className={`relative flex-1 max-w-md min-w-[250px] ${className}`}>
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
            <input
                ref={ref}
                type="text"
                placeholder={placeholder}
                className="w-full text-sm pl-9 pr-3 py-2 rounded-lg border border-gray-200 bg-white focus:outline-none focus:ring-2 focus:ring-gray-300"
                {...props}
            />
        </div>
    );
});

export default SearchInput;
