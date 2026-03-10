import { type ReactNode, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

type ModalSize = 'sm' | 'md' | 'lg' | 'xl';

interface ModalProps {
    open: boolean;
    onClose: () => void;
    title?: string;
    size?: ModalSize;
    children: ReactNode;
    footer?: ReactNode;
}

const sizeStyles: Record<ModalSize, string> = {
    sm: 'max-w-md',
    md: 'max-w-lg',
    lg: 'max-w-xl',
    xl: 'max-w-2xl',
};

export const Modal = ({
    open,
    onClose,
    title,
    size = 'md',
    children,
    footer,
}: ModalProps) => {
    // Lock body scroll when modal is open
    useEffect(() => {
        if (open) {
            document.body.style.overflow = 'hidden';
        } else {
            document.body.style.overflow = '';
        }
        return () => { document.body.style.overflow = ''; };
    }, [open]);

    if (!open) return null;

    const modalContent = (
        <div
            className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 p-4"
            role="dialog"
            aria-modal="true"
            onClick={onClose}
        >
            <div
                className={`w-full ${sizeStyles[size]} bg-white rounded-xl shadow-xl flex flex-col max-h-[85vh]`}
                onClick={(e) => e.stopPropagation()}
            >
                {/* Header */}
                {title && (
                    <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
                        <h3 className="text-base font-semibold text-gray-900">{title}</h3>
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex h-7 w-7 items-center justify-center rounded-md text-gray-400 hover:text-gray-900 hover:bg-gray-100 transition-colors"
                        >
                            <X className="h-4 w-4" />
                        </button>
                    </div>
                )}

                {/* Body — scrollable, hidden scrollbar */}
                <div className={`flex-1 overflow-y-auto px-5 pb-5 ${title ? 'pt-4' : 'pt-5'} [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]`}>
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-2 px-5 py-4 border-t border-gray-100 shrink-0">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    );

    return createPortal(modalContent, document.body);
};

export default Modal;
