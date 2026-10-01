import { Plus } from 'lucide-react';
import { KanbanCard } from './KanbanCard';
import './KanbanColumn.css';

export function KanbanColumn({
  title,
  statusKey,
  dotColor = 'warning',
  assignments = [],
  onEdit,
  onDelete,
  onMoveStatus,
  onAddNewToStatus,
}) {
  return (
    <div className={`kanban-column kanban-column-${statusKey}`}>
      {/* Column Header */}
      <div className="kanban-col-header">
        <div className="kanban-col-title-group">
          <span className={`kanban-col-dot dot-${dotColor}`} />
          <h4 className="kanban-col-title">{title}</h4>
          <span className="kanban-col-count">{assignments.length}</span>
        </div>

        {onAddNewToStatus && (
          <button
            type="button"
            className="kanban-add-mini-btn"
            onClick={() => onAddNewToStatus(statusKey)}
            title={`Add assignment to ${title}`}
          >
            <Plus size={16} />
          </button>
        )}
      </div>

      {/* Cards Scroll Area */}
      <div className="kanban-cards-track">
        {assignments.length === 0 ? (
          <div className="kanban-col-empty">
            <span>No {title.toLowerCase()} assignments</span>
          </div>
        ) : (
          assignments.map((item) => (
            <KanbanCard
              key={item.id}
              assignment={item}
              onEdit={onEdit}
              onDelete={onDelete}
              onMoveStatus={onMoveStatus}
            />
          ))
        )}
      </div>
    </div>
  );
}
