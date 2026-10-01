import { AlertTriangle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Button, Badge } from '../ui';
import { getRelativeDeadline, isOverdue } from '../../utils/dateUtils.js';
import './DeadlineBanner.css';

export function DeadlineBanner({
  assignment = null,
  onViewAssignment,
}) {
  if (!assignment) {
    return (
      <div className="deadline-banner deadline-banner-all-clear">
        <div className="deadline-banner-left">
          <div className="deadline-icon-wrap all-clear-icon">
            <CheckCircle2 size={24} />
          </div>
          <div className="deadline-info">
            <h4 className="deadline-heading">All Clear! No Impending Deadlines</h4>
            <p className="deadline-assignment-text">
              You are completely caught up on all course assignments. Outstanding work!
            </p>
          </div>
        </div>
      </div>
    );
  }

  const overdue = isOverdue(assignment.deadline, assignment.status);
  const relativeText = getRelativeDeadline(assignment.deadline, assignment.status);

  return (
    <div className={`deadline-banner ${overdue ? 'is-overdue' : 'is-upcoming'}`}>
      <div className="deadline-banner-left">
        <div className="deadline-icon-wrap">
          <AlertTriangle size={24} />
        </div>
        <div className="deadline-info">
          <div className="deadline-badge-row">
            <span className="deadline-kicker">
              {overdue ? '⚠ Overdue Warning' : '⚠ Upcoming Deadline'}
            </span>
            <Badge variant={overdue ? 'danger' : 'warning'} size="sm">
              {relativeText}
            </Badge>
          </div>
          <h4 className="deadline-assignment-title">
            <span className="deadline-subject-tag">{assignment.subject}</span>
            <span className="deadline-separator">—</span>
            <span className="deadline-title-text">{assignment.title}</span>
          </h4>
          <p className="deadline-subtext">
            Due date: <strong>{assignment.deadline}</strong> • Estimated time: {assignment.estimatedHours || 2} hrs
          </p>
        </div>
      </div>

      <div className="deadline-banner-right">
        <Button
          variant={overdue ? 'danger' : 'primary'}
          size="md"
          iconRight={ArrowRight}
          onClick={() => onViewAssignment(assignment)}
        >
          View Assignment
        </Button>
      </div>
    </div>
  );
}
