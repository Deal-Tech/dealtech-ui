import { useEffect, useId, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { X } from 'lucide-react';

import './modal.css';

export interface ModalProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  children: ReactNode;
  footer?: ReactNode;
  className?: string;
}

export function Modal({ open, onClose, title, children, footer, className = '' }: ModalProps) {
  const titleId = useId();

  // Kunci scroll halaman selama modal terbuka.
  useEffect(() => {
    if (!open) return undefined;
    const sebelumnya = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = sebelumnya;
    };
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', onKey);
    return () => document.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open) return null;

  return createPortal(
    <div className="modal-overlay" onClick={onClose}>
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby={title ? titleId : undefined}
        className={`modal animate-fade-in-scale ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {title ? (
          <div className="modal__header">
            <h3 id={titleId} className="modal__title">
              {title}
            </h3>
            <button type="button" onClick={onClose} className="modal__close" aria-label="Tutup">
              <X className="modal__close-icon" />
            </button>
          </div>
        ) : null}

        <div className={`modal__body ${title ? '' : 'modal__body--no-title'}`}>{children}</div>

        {footer ? <div className="modal__footer">{footer}</div> : null}
      </div>
    </div>,
    document.body,
  );
}

export default Modal;
