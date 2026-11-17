import { useId, type ReactNode } from 'react';

import './bidang.css';

export interface BidangProps {
  label?: string;
  /** Tanda bintang wajib isi. */
  wajib?: boolean;
  hint?: string;
  error?: string;
  /** id kontrol di dalamnya, untuk htmlFor. */
  htmlFor?: string;
  className?: string;
  children: ReactNode;
}

/**
 * Label + hint + galat untuk kontrol tanpa label sendiri (Select, DateInput
 * kustom, grup tombol). Ukurannya sama dengan label InputText.
 */
export function Bidang({ label, wajib = false, hint, error, htmlFor, className = '', children }: BidangProps) {
  const id = useId();
  return (
    <div className={`bidang ${className}`} role="group" aria-labelledby={label ? id : undefined}>
      {label ? (
        <label id={id} className="bidang__label" htmlFor={htmlFor}>
          {label}
          {wajib ? <span className="bidang__wajib">*</span> : null}
        </label>
      ) : null}
      {children}
      {hint && !error ? <p className="bidang__hint">{hint}</p> : null}
      {error ? <p className="bidang__error">{error}</p> : null}
    </div>
  );
}

export default Bidang;
