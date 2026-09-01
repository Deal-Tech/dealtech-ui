import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

import './search-input.css';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showIcon?: boolean;
}

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
        className={`search-input ${className}`}
        {...props}
      />
    );
  }
  return (
    <div className={`search-input-wrap ${className}`}>
      <Search className="search-input__icon" />
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className="search-input search-input--with-icon"
        {...props}
      />
    </div>
  );
});

export default SearchInput;
