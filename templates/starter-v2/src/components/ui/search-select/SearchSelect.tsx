import { Select, type SelectProps } from '@/components/ui/select/Select';

export type SearchSelectProps = Omit<SelectProps, 'searchable'>;

export function SearchSelect(props: SearchSelectProps) {
  return <Select {...props} searchable />;
}

export default SearchSelect;
