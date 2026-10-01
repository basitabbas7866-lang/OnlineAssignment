import { Modal } from '../ui';
import { AssignmentForm } from './AssignmentForm';

export function AssignmentModal({
  isOpen,
  onClose,
  initialData = null,
  onSubmit,
}) {
  const isEditing = Boolean(initialData);

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={isEditing ? 'Edit Assignment' : 'Add New Assignment'}
      description={
        isEditing
          ? `Update details and timeline for "${initialData?.title}"`
          : 'Create a new course deliverable with subject, priority, and deadline.'
      }
      maxWidth="560px"
    >
      <AssignmentForm
        key={initialData?.id || 'new'}
        initialData={initialData}
        onSubmit={(formData) => {
          onSubmit(formData);
          onClose();
        }}
        onCancel={onClose}
      />
    </Modal>
  );
}
