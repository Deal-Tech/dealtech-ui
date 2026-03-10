import type { ReactNode } from 'react';

export interface PageHeaderProps {
    /** Page title */
    title: string;
    /** Subtitle / description below the title */
    subtitle?: string;
    /** Action area on the right (buttons, links, etc.) */
    action?: ReactNode;
    /** Extra class */
    className?: string;
}

export const PageHeader = ({ title, subtitle, action, className = '' }: PageHeaderProps) => {
    return (
        <div className={`flex items-center justify-between ${className}`}>
            <div>
                <h1 className="text-lg font-semibold">{title}</h1>
                {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
            </div>
            {action && <div className="flex items-center gap-2 shrink-0">{action}</div>}
        </div>
    );
};

export default PageHeader;
