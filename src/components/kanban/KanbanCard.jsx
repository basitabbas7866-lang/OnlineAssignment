import { Calendar, Clock, ArrowRight, ArrowLeft, Check, Edit3, Trash2 } from 'lucide-react';
import { Badge } from '../ui';
import { formatDate, isOverdue } from '../../utils/dateUtils.js';
import './KanbanCard.css';

export function KanbanCard({
  assignment,
  onEdit,
  onDelete,
  onMoveStatus,
}) {
  const { id, title, subject, deadline, priority, status, estimatedHours } = assignment;
  const overdue = isOverdue(deadline, status);

  const getPriorityVariant = () => {
    switch (priority?.toLowerCase()) {
      case 'high': return 'danger';
      case 'medium': return 'warning';
      default: return 'neutral';
    }
  };

  return (
    <div className={`kanban-card ${status === 'completed' ? 'is-completed' : ''}`}>
      {/* Top Bar: Subject & Priority */}
      <div className="kanban-card-top">
        <Badge variant="primary" size="sm" className="kanban-subject-badge">
          {subject}
        </Badge>
        <div className="kanban-badges-right">
          {overdue && (
            <Badge variant="danger" size="sm" dot>
              OVERDUE
            </Badge>
          )}
          <Badge variant={getPriorityVariant()} size="sm">
            {priority?.toUpperCase()}
          </Badge>
        </div>
      </div>

      {/* Title */}
      <h5 className="kanban-card-title" onClick={() => onEdit(assignment)} title="Click to edit">
        {title}
      </h5>

      {/* Meta: Deadline & Hours */}
      <div className="kanban-card-meta">
        <span className="kanban-meta-item" title={`Due: ${deadline}`}>
          <Calendar size={13} />
          {formatDate(deadline)}
        </span>
        {estimatedHours ? (
          <span className="kanban-meta-item" title="Estimated hours">
            <Clock size={13} />
            {estimatedHours}h
          </span>
        ) : null}
      </div>

      {/* Action Controls & Move Buttons */}
      <div className="kanban-card-actions">
        <div className="kanban-utility-btns">
          <button
            type="button"
            className="kanban-mini-btn"
            onClick={() => onEdit(assignment)}
            title="Edit assignment"
          >
            <Edit3 size={13} />
          </button>
          <button
            type="button"
            className="kanban-mini-btn btn-danger-hover"
            onClick={() => onDelete(assignment)}
            title="Delete assignment"
          >
            <Trash2 size={13} />
          </button>
        </div>

        {/* Transition Status Buttons */}
        <div className="kanban-move-btns">
          {status === 'pending' && (
            <>
              <button
                type="button"
                className="kanban-status-move-btn"
                onClick={() => onMoveStatus(id, 'in_progress')}
                title="Move to In Progress"
              >
                <span>Start</span>
                <ArrowRight size={12} />
              </button>
              <button
                type="button"
                className="kanban-status-move-btn move-btn-success"
                onClick={() => onMoveStatus(id, 'completed')}
                title="Mark as Completed"
              >
                <Check size={12} />
              </button>
            </>
          )}

          {status === 'in_progress' && (
            <>
              <button
                type="button"
                className="kanban-status-move-btn move-btn-back"
                onClick={() => onMoveStatus(id, 'pending')}
                title="Move back to Pending"
              >
                <ArrowLeft size={12} />
              </button>
              <button
                type="button"
                className="kanban-status-move-btn move-btn-success"
                onClick={() => onMoveStatus(id, 'completed')}
                title="Mark as Completed"
              >
                <span>Done</span>
                <Check size={12} />
              </button>
            </>
          )}

          {status === 'completed' && (
            <button
              type="button"
              className="kanban-status-move-btn move-btn-reopen"
              onClick={() => onMoveStatus(id, 'in_progress')}
              title="Reopen into In Progress"
            >
              <ArrowLeft size={12} />
              <span>Reopen</span>
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
