import type { ReactNode } from 'react';
import { Button } from '../button/Button';
import Modal, { type ModalSize } from '../modal/Modal';

interface FormModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  size?: ModalSize;
  formId?: string;
  submitLabel: string;
  cancelLabel?: string;
  loading?: boolean;
  submitDisabled?: boolean;
  onSubmitClick?: () => void;
}

const FormModal = ({
  open,
  onClose,
  title,
  children,
  size = 'lg',
  formId,
  submitLabel,
  cancelLabel = 'Batal',
  loading = false,
  submitDisabled = false,
  onSubmitClick,
}: FormModalProps) => {
  const handleClose = () => {
    if (loading) return;
    onClose();
  };

  const handleSubmit = () => {
    if (formId) {
      (document.getElementById(formId) as HTMLFormElement | null)?.requestSubmit();
      return;
    }

    onSubmitClick?.();
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
          <Button
            variant="premium"
            onClick={handleSubmit}
            loading={loading}
            disabled={submitDisabled}
          >
            {submitLabel}
          </Button>
        </>
      }
    >
      {children}
    </Modal>
  );
};

export default FormModal;
