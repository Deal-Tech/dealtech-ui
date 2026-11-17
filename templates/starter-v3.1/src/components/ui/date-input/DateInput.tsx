import { forwardRef, useId, type InputHTMLAttributes } from 'react';

import './date-input.css';

export interface DateInputProps extends Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> {
  label?: string;
  hint?: string;
  error?: string;
  mode?: 'tanggal' | 'bulan';
}

export const DateInput = forwardRef<HTMLInputElement, DateInputProps>(function DateInput(
  { className = '', label, hint, error, mode = 'tanggal', id, ...props },
  ref,
) {
  // klik label tidak memfokuskan field.
  const idOtomatis = useId();
  const idField = id ?? idOtomatis;

  return (
    <div className="date-input-wrap">
      {label ? (
        <label className="date-input__label" htmlFor={idField}>
          {label}
        </label>
      ) : null}
      <input
        type={mode === 'bulan' ? 'month' : 'date'}
        ref={ref}
        id={idField}
        aria-invalid={error ? true : undefined}
        className={`date-input ${error ? 'date-input--error' : ''} ${className}`}
        {...props}
      />
      {hint && !error ? <p className="date-input__hint">{hint}</p> : null}
      {error ? <p className="date-input__error">{error}</p> : null}
    </div>
  );
});

export default DateInput;
