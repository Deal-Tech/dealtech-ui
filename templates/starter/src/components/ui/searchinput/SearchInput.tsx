import type { InputHTMLAttributes } from 'react';
import { Input } from '../input/Input';

interface SearchInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  className?: string;
}

const SearchInput = ({ className = '', ...props }: SearchInputProps) => (
  <Input type="text" className={`rounded ${className}`} {...props} />
);

export default SearchInput;

