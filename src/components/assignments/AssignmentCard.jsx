import { Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Card, Badge } from '../ui';
import { AssignmentActions } from './AssignmentActions';
import { formatDate, isOverdue } from '../../utils/dateUtils.js';
import './AssignmentCard.css';

export function AssignmentCard({
  assignment,
  onEdit,
  onDuplicate,
  onDelete,
  onCycleStatus,
}) {
  const {
    id,
    title,
    subject,
    description,
    deadline,
    priority,
    status,
    estimatedHours,
  } = assignment;

  const overdue = isOverdue(deadline, status);

  // Status visual attributes
  const getStatusBadgeProps = () => {
    switch (status) {
      case 'completed':
        return { variant: 'success', label: 'Completed', dot: true };
      case 'in_progress':
        return { variant: 'info', label: 'In Progress', dot: true };
      case 'pending':
      default:
        return { variant: 'warning', label: 'Pending', dot: true };
    }
  };

  const getPriorityBadgeProps = () => {
    switch (priority?.toLowerCase()) {
      case 'high':
        return { variant: 'danger', label: 'HIGH' };
      case 'medium':
        return { variant: 'warning', label: 'MEDIUM' };
      case 'low':
      default:
        return { variant: 'neutral', label: 'LOW' };
    }
  };

  const statusProps = getStatusBadgeProps();
  const priorityProps = getPriorityBadgeProps();

  return (
    <Card hoverable className={`assignment-card ${status === 'completed' ? 'is-completed' : ''}`}>
      {/* Top Header: Subject (left) and Priority (right) */}
      <div className="card-top-bar">
        <Badge variant="primary" size="sm" className="subject-badge">
          {subject}
        </Badge>
        <div className="card-badges-right">
          {overdue && (
            <Badge variant="danger" size="sm" dot>
              OVERDUE
            </Badge>
          )}
          <Badge variant={priorityProps.variant} size="sm">
            {priorityProps.label}
          </Badge>
        </div>
      </div>

      {/* Main Info: Title and Description */}
      <div className="card-main-body">
        <h4 className="assignment-title" title={title}>
          {status === 'completed' && <CheckCircle2 size={16} className="title-completed-icon" />}
          {title}
        </h4>
        {description ? (
          <p className="assignment-description">{description}</p>
        ) : (
          <p className="assignment-description empty">No additional instructions provided.</p>
        )}
      </div>

      {/* Metadata Bar: Deadline, Hours, and Status */}
      <div className="card-meta-bar">
        <div className="meta-item meta-deadline" title={`Due: ${deadline}`}>
          <Calendar size={14} className="meta-icon" />
          <span>{formatDate(deadline)}</span>
        </div>

        {estimatedHours ? (
          <div className="meta-item meta-hours" title="Estimated workload">
            <Clock size={14} className="meta-icon" />
            <span>{estimatedHours} {estimatedHours === 1 ? 'hr' : 'hrs'}</span>
          </div>
        ) : null}

        {/* Interactive Status Badge: Pending -> In Progress -> Completed */}
        <button
          type="button"
          className="interactive-status-btn"
          onClick={() => onCycleStatus(id)}
          title="Click to advance status: Pending → In Progress → Completed"
        >
          <Badge
            variant={statusProps.variant}
            size="sm"
            dot={statusProps.dot}
            className="status-pill"
          >
            {statusProps.label}
          </Badge>
        </button>
      </div>

      {/* Card Action Controls: Edit, Duplicate, Delete */}
      <div className="card-bottom-actions">
        <AssignmentActions
          onEdit={() => onEdit(assignment)}
          onDuplicate={() => onDuplicate(id)}
          onDelete={() => onDelete(assignment)}
        />
      </div>
    </Card>
  );
}
