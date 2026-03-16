import React from 'react';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  variant?: 'normal' | 'number';
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className = '', variant = 'normal', ...props }, ref) => {
    const baseClass =
      'w-full px-3.5 py-2 text-sm border border-neutral-300/40 rounded focus:outline-none focus:ring-2 focus:ring-[#334a34]/20 focus:border-[#334a34]/50 transition-all duration-200 bg-white placeholder:text-neutral-400 selection:bg-[#334a34]/10';
    const variantClass = variant === 'number' ? 'text-left tabular-nums font-medium' : '';

    return <input ref={ref} className={`${baseClass} ${variantClass} ${className}`} {...props} />;
  }
);

Input.displayName = 'Input';

