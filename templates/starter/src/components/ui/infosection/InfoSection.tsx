import type { ReactNode } from 'react';
import { AlertTriangle, CheckCircle2 } from 'lucide-react';

interface InfoSectionProps {
  variant?: 'success' | 'warning';
  children: ReactNode;
  className?: string;
}

const styles = {
  success: {
    container: 'border-emerald-200 bg-emerald-50 text-emerald-700',
    icon: CheckCircle2,
  },
  warning: {
    container: 'border-red-200 bg-red-50 text-red-700',
    icon: AlertTriangle,
  },
};

const InfoSection = ({
  variant = 'success',
  children,
  className = '',
}: InfoSectionProps) => {
  const config = styles[variant];
  const Icon = config.icon;

  return (
    <div className={`flex items-start gap-2 rounded border px-4 py-3 text-sm ${config.container} ${className}`}>
      <Icon className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
};

export default InfoSection;
