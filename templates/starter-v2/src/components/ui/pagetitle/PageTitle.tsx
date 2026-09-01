import type { ReactNode } from 'react';

import './pagetitle.css';

export interface PageTitleProps {
  title: string;
  subtitle?: string;
  action?: ReactNode;
  className?: string;
}

export function PageTitle({ title, subtitle, action, className = '' }: PageTitleProps) {
  return (
    <div className={`pagetitle ${className}`}>
      <div className="pagetitle__text">
        <h1 className="pagetitle__title">{title}</h1>
        {subtitle ? <p className="pagetitle__subtitle">{subtitle}</p> : null}
      </div>
      {action ? <div className="pagetitle__action">{action}</div> : null}
    </div>
  );
}

export default PageTitle;
