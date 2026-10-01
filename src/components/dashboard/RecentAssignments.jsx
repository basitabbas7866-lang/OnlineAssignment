import { CheckCircle2, FileText, ChevronRight } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge, Button } from '../ui';
import { formatDate } from '../../utils/dateUtils.js';
import './RecentAssignments.css';

export function RecentAssignments({
  assignments = [],
  onViewAssignment,
  onViewAll,
}) {
  // Take the latest 4 assignments by creation date
  const recentList = [...assignments]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 4);

  return (
    <Card className="recent-assignments-card">
      <CardHeader className="recent-card-header">
        <div className="recent-title-row">
          <CardTitle as="h4">Recent Activity</CardTitle>
          {onViewAll && (
            <Button variant="ghost" size="sm" iconRight={ChevronRight} onClick={onViewAll}>
              View All
            </Button>
          )}
        </div>
      </CardHeader>

      <CardContent className="recent-card-content">
        {recentList.length === 0 ? (
          <p className="recent-empty-note">No recent activity found.</p>
        ) : (
          <div className="recent-items-list">
            {recentList.map((item) => {
              const isCompleted = item.status === 'completed';

              return (
                <div key={item.id} className="recent-item-row">
                  <div className="recent-icon-indicator">
                    {isCompleted ? (
                      <CheckCircle2 size={16} className="text-success" />
                    ) : (
                      <FileText size={16} className="text-primary" />
                    )}
                  </div>

                  <div className="recent-details">
                    <h5
                      className="recent-item-title"
                      onClick={() => onViewAssignment(item)}
                      title="Click to view details"
                    >
                      {item.title}
                    </h5>
                    <span className="recent-item-meta">
                      {item.subject} • {isCompleted ? 'Completed' : 'Created'}{' '}
                      {formatDate(isCompleted && item.completedAt ? item.completedAt : item.createdAt)}
                    </span>
                  </div>

                  <Badge
                    variant={isCompleted ? 'success' : item.status === 'in_progress' ? 'info' : 'neutral'}
                    size="sm"
                  >
                    {item.status}
                  </Badge>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
