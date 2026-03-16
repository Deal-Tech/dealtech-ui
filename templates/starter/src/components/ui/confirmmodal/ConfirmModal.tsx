import type { ReactNode } from 'react';
import { Button } from '../button/Button';
import Modal, { type ModalSize } from '../modal/Modal';

interface ConfirmModalProps {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
}

const ConfirmModal = ({
  open,
  onClose,
  onConfirm,
  title,
  children,
  size = 'sm',
  confirmLabel = 'Konfirmasi',
  cancelLabel = 'Batal',
  loading = false,
}: ConfirmModalProps) => {
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={title}
      size={size}
      footer={
        <>
          <Button variant="outline" onClick={handleClose} disabled={loading}>
            {cancelLabel}
          </Button>
          <Button variant="danger" onClick={onConfirm} loading={loading}>
            {confirmLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
};

export default ConfirmModal;
