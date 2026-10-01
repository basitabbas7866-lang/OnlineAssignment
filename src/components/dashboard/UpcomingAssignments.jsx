import { CheckCircle2, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../ui';
import { getRelativeDeadline, isOverdue } from '../../utils/dateUtils.js';
import './UpcomingAssignments.css';

export function UpcomingAssignments({
  assignments = [],
  onViewAssignment,
  onCompleteAssignment,
  onViewAll,
}) {
  // Filter for active/pending tasks and sort by deadline ascending
  const upcomingList = assignments
    .filter((item) => item.status !== 'completed')
    .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
    .slice(0, 4);

  return (
    <Card className="upcoming-assignments-card">
      <CardHeader className="upcoming-card-header">
        <div className="upcoming-title-row">
          <CardTitle as="h4">Upcoming Deliverables</CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" iconRight={ChevronRight} onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="upcoming-card-content">
        {upcomingList.length === 0 ? (
          <p className="upcoming-empty-note">
            🎉 No upcoming pending assignments! You're completely up to date.
          </p>
        ) : (
          <div className="upcoming-items-list">
            {upcomingList.map((item) => {
              const overdue = isOverdue(item.deadline, item.status);
              const relativeText = getRelativeDeadline(item.deadline, item.status);

              return (
                <div key={item.id} className="upcoming-item-row">
                  <div className="upcoming-item-left">
                    <div className="upcoming-item-meta">
                      <Badge variant="primary" size="sm">{item.subject}</Badge>
                      <Badge
                        variant={overdue ? 'danger' : 'warning'}
                        size="sm"
                        dot
                      >
                        {relativeText}
                      </Badge>
                    </div>
                    <h5
                      className="upcoming-item-title"
                      onClick={() => onViewAssignment(item)}
                      title="Click to view details"
                    >
                      {item.title}
                    </h5>
                  </div>

                  <div className="upcoming-item-right">
                    <Button
                      variant="outline"
                      size="sm"
                      icon={CheckCircle2}
                      onClick={() => onCompleteAssignment(item.id)}
                      title="Mark as Completed"
                    >
                      Done
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
