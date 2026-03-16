import type { MouseEvent, ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';

interface ActionButtonProps {
  icon?: LucideIcon;
  children: ReactNode;
  onClick?: (event: MouseEvent) => void;
  variant?: 'default' | 'danger';
  className?: string;
  disabled?: boolean;
}

const ActionButton = ({
  icon: Icon,
  children,
  onClick,
  variant = 'default',
  className = '',
  disabled = false,
}: ActionButtonProps) => {
  const base =
    'inline-flex items-center gap-1 rounded-md border px-2.5 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-40';

  const variants = {
    default: 'border-gray-200 bg-white text-gray-600 hover:bg-gray-50',
    danger: 'border-red-200 bg-white text-red-600 hover:bg-red-50',
  };

  return (
    <button
      type="button"
      onClick={(event) => {
        event.stopPropagation();
        onClick?.(event);
      }}
      disabled={disabled}
      className={`${base} ${variants[variant]} ${className}`}
    >
      {Icon ? <Icon size={13} /> : null}
      {children}
    </button>
  );
};

export default ActionButton;

