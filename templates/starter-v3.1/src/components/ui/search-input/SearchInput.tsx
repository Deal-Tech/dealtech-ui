import { forwardRef, type InputHTMLAttributes } from 'react';
import { Search } from 'lucide-react';

import './search-input.css';

export interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  showIcon?: boolean;
  /** Pil abu tanpa garis */
  gaya?: 'kotak' | 'pil';
}

export const SearchInput = forwardRef<HTMLInputElement, SearchInputProps>(function SearchInput(
  { showIcon = true, gaya = 'kotak', className = '', placeholder = 'Cari...', ...props },
  ref,
) {
  if (!showIcon) {
    return (
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={`search-input search-input--${gaya} ${className}`}
        {...props}
      />
    );
  }
  return (
    <div className={`search-input-wrap search-input-wrap--${gaya} ${className}`}>
      <Search className="search-input__icon" />
      <input
        ref={ref}
        type="text"
        placeholder={placeholder}
        className={`search-input search-input--with-icon search-input--${gaya}`}
        {...props}
      />
    </div>
  );
});

export default SearchInput;
