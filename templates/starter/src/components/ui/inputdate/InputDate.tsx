import React from 'react';
import { Input } from '../input/Input';

interface InputDateProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {}

const InputDate = React.forwardRef<HTMLInputElement, InputDateProps>(
  ({ className = '', ...props }, ref) => (
    <Input
      ref={ref}
      type="date"
      className={`tabular-nums ${className}`.trim()}
      {...props}
    />
  )
);

InputDate.displayName = 'InputDate';

export default InputDate;
