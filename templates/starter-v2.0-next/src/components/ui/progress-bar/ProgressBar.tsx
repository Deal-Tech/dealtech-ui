import './progress-bar.css';

export interface ProgressBarProps {
  value?: number;
  indeterminate?: boolean;
  label?: string;
  showValue?: boolean;
  className?: string;
}

const jepit = (v: number) => Math.min(100, Math.max(0, v));

export function ProgressBar({
  value = 0,
  indeterminate = false,
  label,
  showValue = false,
  className = '',
}: ProgressBarProps) {
  const persen = jepit(value);

  return (
    <div className={`progress-bar ${className}`}>
      {label || showValue ? (
        <div className="progress-bar__head">
          {label ? <span className="progress-bar__label">{label}</span> : <span />}
          {showValue && !indeterminate ? (
            <span className="progress-bar__value">{Math.round(persen)}%</span>
          ) : null}
        </div>
      ) : null}

      <div
        className="progress-bar__track"
        role="progressbar"
        aria-label={label}
        aria-valuemin={indeterminate ? undefined : 0}
        aria-valuemax={indeterminate ? undefined : 100}
        aria-valuenow={indeterminate ? undefined : Math.round(persen)}
      >
        <div
          className={`progress-bar__fill ${indeterminate ? 'progress-bar__fill--indeterminate' : ''}`}
          style={indeterminate ? undefined : { width: `${persen}%` }}
        />
      </div>
    </div>
  );
}

export default ProgressBar;
