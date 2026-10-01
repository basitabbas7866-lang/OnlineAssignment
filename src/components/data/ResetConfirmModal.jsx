import { RotateCcw, AlertTriangle } from 'lucide-react';
import { Modal, Button } from '../ui';
import './ResetConfirmModal.css';

export function ResetConfirmModal({
  isOpen,
  onClose,
  onConfirm,
}) {
  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      maxWidth="460px"
    >
      <div className="reset-confirm-body">
        <div className="reset-confirm-icon-wrap">
          <AlertTriangle size={28} className="text-warning" />
        </div>
        <h3 className="reset-confirm-title">Reset to Demo Data?</h3>
        <p className="reset-confirm-text">
          Are you sure you want to reset your workspace? This will replace your current assignments with the default course deliverables.
        </p>
        <p className="reset-confirm-warning">
          Tip: You can export a JSON backup first if you want to keep your current tasks.
        </p>

        <div className="reset-confirm-actions">
          <Button variant="ghost" onClick={onClose}>
            Cancel
          </Button>
          <Button
            variant="danger"
            icon={RotateCcw}
            onClick={() => {
              onConfirm();
              onClose();
            }}
          >
            Reset Workspace
          </Button>
        </div>
      </div>
    </Modal>
  );
}
