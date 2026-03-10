import React from 'react';

export interface TabOption {
    /** The value returned when the tab is clicked */
    value: string | number;
    /** The text displayed on the tab */
    label: string | React.ReactNode;
}

export interface TabButtonProps {
    /** The currently selected value */
    value: string | number;
    /** Callback when a tab is clicked */
    onChange: (value: any) => void;
    /** Array of options to display as tabs */
    options: TabOption[];
    /** Optional container class name */
    className?: string;
    /** Layout orientation (default 'horizontal') */
    orientation?: 'horizontal' | 'vertical';
    /** Sizing of the tabs (default 'sm') */
    size?: 'sm' | 'md' | 'lg';
}

export const TabButton = ({
    value,
    onChange,
    options,
    className = '',
    orientation = 'horizontal',
    size = 'sm',
}: TabButtonProps) => {
    const sizeClasses = {
        sm: 'text-xs px-3 py-1.5',
        md: 'text-sm px-4 py-2',
        lg: 'text-base px-5 py-2.5',
    };

    const containerClasses = orientation === 'horizontal'
        ? 'flex items-center gap-1'
        : 'flex flex-col gap-1';

    return (
        <div className={`${containerClasses} ${className}`}>
            {options.map((item) => (
                <button
                    key={item.value}
                    type="button"
                    onClick={() => onChange(item.value)}
                    className={`font-medium rounded-lg transition-colors ${sizeClasses[size]} ${value === item.value
                            ? 'bg-gray-800 text-white shadow-sm'
                            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                        }`}
                >
                    {item.label}
                </button>
            ))}
        </div>
    );
};

export default TabButton;
