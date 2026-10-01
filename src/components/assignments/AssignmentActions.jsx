import { Edit3, Copy, Trash2 } from 'lucide-react';
import { Button } from '../ui';
import './AssignmentActions.css';

export function AssignmentActions({
  onEdit,
  onDuplicate,
  onDelete,
  className = '',
}) {
  return (
    <div className={`assignment-actions-row ${className}`}>
      <Button
        variant="ghost"
        size="sm"
        icon={Edit3}
        onClick={onEdit}
        title="Edit Assignment"
      >
        Edit
      </Button>

      <Button
        variant="ghost"
        size="sm"
        icon={Copy}
        onClick={onDuplicate}
        title="Duplicate Assignment"
      >
        Duplicate
      </Button>

      <Button
        variant="ghost"
        size="sm"
        icon={Trash2}
        className="action-btn-danger"
        onClick={onDelete}
        title="Delete Assignment"
      >
        Delete
      </Button>
    </div>
  );
}
