import './toggleonoff.css';

export interface ToggleOnOffProps {
  checked: boolean;
  onChange?: (checked: boolean) => void;
  disabled?: boolean;
  label?: string;
  /** Wajib diisi kalau dipakai tanpa `label` — mis. di dalam kolom tabel. */
  'aria-label'?: string;
  title?: string;
  className?: string;
}

export function ToggleOnOff({
  checked,
  onChange,
  disabled = false,
  label,
  'aria-label': ariaLabel,
  title,
  className = '',
}: ToggleOnOffProps) {
  const handleToggle = () => {
    if (!disabled) onChange?.(!checked);
  };

  const switchBtn = (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      title={title}
      disabled={disabled}
      onClick={handleToggle}
      className={`toggleonoff ${checked ? 'is-on' : ''} ${label ? '' : className}`}
    >
      <span className="toggleonoff__knob" />
    </button>
  );

  if (!label) return switchBtn;

  return (
    <div className={`toggleonoff-field ${className}`}>
      {switchBtn}
      <span className="toggleonoff-field__label" onClick={handleToggle}>
        {label}
      </span>
    </div>
  );
}

export default ToggleOnOff;
