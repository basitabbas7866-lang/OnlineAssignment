import { useMemo } from 'react';
import { KanbanColumn } from './KanbanColumn';
import './KanbanBoard.css';

export function KanbanBoard({
  assignments = [],
  onEdit,
  onDelete,
  onMoveStatus,
  onAddNewWithStatus,
}) {
  const pendingAssignments = useMemo(
    () => assignments.filter((item) => item.status === 'pending'),
    [assignments]
  );

  const inProgressAssignments = useMemo(
    () => assignments.filter((item) => item.status === 'in_progress'),
    [assignments]
  );

  const completedAssignments = useMemo(
    () => assignments.filter((item) => item.status === 'completed'),
    [assignments]
  );

  return (
    <div className="kanban-board-container">
      <div className="kanban-board-grid">
        <KanbanColumn
          title="PENDING"
          statusKey="pending"
          dotColor="warning"
          assignments={pendingAssignments}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveStatus={onMoveStatus}
          onAddNewToStatus={onAddNewWithStatus}
        />

        <KanbanColumn
          title="IN PROGRESS"
          statusKey="in_progress"
          dotColor="info"
          assignments={inProgressAssignments}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveStatus={onMoveStatus}
          onAddNewToStatus={onAddNewWithStatus}
        />

        <KanbanColumn
          title="COMPLETED"
          statusKey="completed"
          dotColor="success"
          assignments={completedAssignments}
          onEdit={onEdit}
          onDelete={onDelete}
          onMoveStatus={onMoveStatus}
          onAddNewToStatus={onAddNewWithStatus}
        />
      </div>
    </div>
  );
}
