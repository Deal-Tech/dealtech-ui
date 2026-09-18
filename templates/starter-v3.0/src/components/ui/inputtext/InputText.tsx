import { forwardRef, useId, useState, type ChangeEvent, type InputHTMLAttributes } from 'react';
import { Eye, EyeOff } from 'lucide-react';

import { formatCurrencyInputValue, normalizeCurrencyDigits } from '@/lib/currency';
import './inputtext.css';

export interface InputTextProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  hint?: string;
  currency?: boolean;
}

export const InputText = forwardRef<HTMLInputElement, InputTextProps>(function InputText(
  { label, error, hint, className = '', type, currency = false, onChange, value, inputMode, pattern, required, id, ...props },
  ref,
) {
  const idOtomatis = useId();
  const idField = id ?? idOtomatis;

  const sandi = !currency && type === 'password';
  const [terlihat, setTerlihat] = useState(false);

  const resolvedType = currency
    ? 'text'
    : sandi
      ? terlihat
        ? 'text'
        : 'password'
      : (type ?? 'text');

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
    <div className="inputtext">
      {label ? (
        <label className="inputtext__label" htmlFor={idField}>
          {label}
          {required ? <span className="inputtext__req">*</span> : null}
        </label>
      ) : null}
      <div className={`inputtext__wrap ${sandi ? 'inputtext__wrap--sandi' : ''}`}>
        <input
          ref={ref}
          id={idField}
          aria-invalid={error ? true : undefined}
          aria-errormessage={error ? `${idField}-galat` : undefined}
          type={resolvedType}
          inputMode={currency ? 'numeric' : inputMode}
          pattern={currency ? '[0-9.]*' : pattern}
          value={displayValue}
          onChange={handleChange}
          required={required}
          className={`inputtext__field ${error ? 'inputtext__field--error' : ''} ${className}`}
          {...props}
        />
        {sandi ? (
          <button
            type="button"
            className="inputtext__reveal"
            onClick={() => setTerlihat((v) => !v)}
            aria-label={terlihat ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
            title={terlihat ? 'Sembunyikan kata sandi' : 'Lihat kata sandi'}
          >
            {terlihat ? <EyeOff /> : <Eye />}
          </button>
        ) : null}
      </div>
      {hint && !error ? <p className="inputtext__hint">{hint}</p> : null}
      {error ? (
        <p id={`${idField}-galat`} className="inputtext__error">
          {error}
        </p>
      ) : null}
    </div>
  );
});

export default InputText;
