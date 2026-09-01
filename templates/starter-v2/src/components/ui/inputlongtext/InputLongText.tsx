import {
  forwardRef,
  useCallback,
  useEffect,
  useRef,
  type MutableRefObject,
  type TextareaHTMLAttributes,
} from 'react';

import './inputlongtext.css';

export interface InputLongTextProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  hint?: string;
  autoResize?: boolean;
}

export const InputLongText = forwardRef<HTMLTextAreaElement, InputLongTextProps>(
  function InputLongText(
    { label, error, hint, className = '', rows = 4, autoResize = false, value, onChange, onInput, required, ...props },
    ref,
  ) {
    const innerRef = useRef<HTMLTextAreaElement | null>(null);

    const setRefs = useCallback(
      (node: HTMLTextAreaElement | null) => {
        innerRef.current = node;
        if (typeof ref === 'function') ref(node);
        else if (ref) (ref as MutableRefObject<HTMLTextAreaElement | null>).current = node;
      },
      [ref],
    );

    const resize = useCallback(() => {
      const el = innerRef.current;
      if (!el || !autoResize) return;
      el.style.height = 'auto';
      el.style.height = `${el.scrollHeight}px`;
    }, [autoResize]);

    useEffect(() => {
      resize();
    }, [value, resize]);

    return (
      <div className="inputlongtext">
        {label ? (
          <label className="inputlongtext__label">
            {label}
            {required ? <span className="inputlongtext__req">*</span> : null}
          </label>
        ) : null}
        <textarea
          ref={setRefs}
          rows={autoResize ? undefined : rows}
          value={value}
          required={required}
          onChange={(event) => {
            onChange?.(event);
            resize();
          }}
          onInput={(event) => {
            onInput?.(event);
            resize();
          }}
          className={`inputlongtext__field ${autoResize ? 'inputlongtext__field--autoresize' : ''} ${
            error ? 'inputlongtext__field--error' : ''
          } ${className}`}
          {...props}
        />
        {hint && !error ? <p className="inputlongtext__hint">{hint}</p> : null}
        {error ? <p className="inputlongtext__error">{error}</p> : null}
      </div>
    );
  },
);

export default InputLongText;
