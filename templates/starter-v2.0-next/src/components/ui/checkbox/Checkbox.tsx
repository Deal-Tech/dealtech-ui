import { forwardRef, useEffect, useRef, type InputHTMLAttributes } from 'react';
import { Check, Minus } from 'lucide-react';

import './checkbox.css';

export interface CheckboxProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  indeterminate?: boolean;
}

export const Checkbox = forwardRef<HTMLInputElement, CheckboxProps>(function Checkbox(
  { label, indeterminate = false, className = '', checked, ...props },
  ref,
) {
  const dalam = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const el = dalam.current;
    if (el) el.indeterminate = indeterminate && !checked;
  }, [indeterminate, checked]);

  return (
    <label className={`checkbox ${className}`}>
      <input
        ref={(node) => {
          dalam.current = node;
          if (typeof ref === 'function') ref(node);
          else if (ref) ref.current = node;
        }}
        type="checkbox"
        checked={checked}
        className="checkbox__input"
        {...props}
      />
      <span className="checkbox__kotak" aria-hidden="true">
        {checked ? (
          <Check className="checkbox__ikon" />
        ) : indeterminate ? (
          <Minus className="checkbox__ikon" />
        ) : null}
      </span>
      {label ? <span className="checkbox__label">{label}</span> : null}
    </label>
  );
});

export default Checkbox;
