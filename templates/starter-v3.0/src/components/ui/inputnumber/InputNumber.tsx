import { forwardRef, type ChangeEvent, type InputHTMLAttributes } from 'react';

import { formatCurrencyInputValue, normalizeCurrencyDigits } from '@/lib/currency';
import './inputnumber.css';

export interface InputNumberProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  error?: string;
  hint?: string;
  currency?: boolean;
  invalid?: boolean;
}

export const InputNumber = forwardRef<HTMLInputElement, InputNumberProps>(function InputNumber(
  { label, error, hint, invalid = false, className = '', currency = false, onChange, onWheel, value, inputMode, pattern, required, ...props },
  ref,
) {
  const displayValue =
    currency && value !== undefined ? formatCurrencyInputValue(value) : value;

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!currency) {
      onChange?.(event);
      return;
    }
    const rawValue = normalizeCurrencyDigits(event.target.value);
    onChange?.({
      ...event,
      target: { ...event.target, value: rawValue },
      currentTarget: { ...event.currentTarget, value: rawValue },
    } as ChangeEvent<HTMLInputElement>);
  };

  return (
    <div className="inputnumber">
      {label ? (
        <label className="inputnumber__label">
          {label}
          {required ? <span className="inputnumber__req">*</span> : null}
        </label>
      ) : null}
      <input
        ref={ref}
        type={currency ? 'text' : 'number'}
        inputMode={currency ? 'numeric' : inputMode}
        pattern={currency ? '[0-9.]*' : pattern}
        value={displayValue}
        onChange={handleChange}
        onWheel={(event) => {
          if (!currency) event.currentTarget.blur();
          onWheel?.(event);
        }}
        required={required}
        className={`inputnumber__field ${error || invalid ? 'inputnumber__field--error' : ''} ${className}`}
        {...props}
      />
      {hint && !error ? <p className="inputnumber__hint">{hint}</p> : null}
      {error ? <p className="inputnumber__error">{error}</p> : null}
    </div>
  );
});

export default InputNumber;
