import { AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../ui';
import './DeleteConfirmModal.css';

export function DeleteConfirmModal({
  isOpen,
  onClose,
  onConfirm,
  assignmentTitle = '',
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="440px"
    >
      <div className="delete-confirm-body">
        <div className="delete-confirm-icon-wrap">
          <AlertTriangle size={28} className="text-danger" />
        </div>
        <h3 className="delete-confirm-title">Delete Assignment?</h3>
        <p className="delete-confirm-text">
          Are you sure you want to permanently delete:
        </p>
        <div className="delete-assignment-name-badge">
          "{assignmentTitle}"
        </div>
        <p className="delete-confirm-subtext">
          This action cannot be undone.
        </p>

        <div className="delete-confirm-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button variant="danger" onClick={onConfirm}>
            Delete
          </Button>
        </div>
      </div>
    </Modal>
  );
}
