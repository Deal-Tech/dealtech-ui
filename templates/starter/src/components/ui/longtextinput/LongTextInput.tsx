import React from 'react';

interface LongTextInputProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const baseClass =
  'w-full px-3.5 py-2 text-sm border border-neutral-300/40 rounded focus:outline-none focus:ring-2 focus:ring-[#334a34]/20 focus:border-[#334a34]/50 transition-all duration-200 bg-white placeholder:text-neutral-400 selection:bg-[#334a34]/10 resize-y min-h-[120px]';

const LongTextInput = React.forwardRef<HTMLTextAreaElement, LongTextInputProps>(
  ({ className = '', rows = 4, ...props }, ref) => {
    return (
      <textarea
        ref={ref}
        rows={rows}
        className={`${baseClass} ${className}`}
        {...props}
      />
    );
  }
);

LongTextInput.displayName = 'LongTextInput';

export default LongTextInput;
