import { Clock } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent } from '../ui';
import './ProgressOverview.css';

export function ProgressOverview({
  completionRate = 0,
  completed = 0,
  pending = 0,
  overdue = 0,
  _total = 0,
  estimatedHoursTotal = 0,
  estimatedHoursCompleted = 0,
}) {
  return (
    <Card className="progress-overview-card">
      <CardHeader className="progress-card-header">
        <div className="progress-title-wrap">
          <CardTitle as="h4">Overall Completion</CardTitle>
          <span className="progress-percentage-label">{completionRate}%</span>
        </div>
      </CardHeader>

      <CardContent className="progress-card-body">
        {/* Visual Progress Bar Track & Fill */}
        <div
          className="progress-bar-track"
          role="progressbar"
          aria-valuenow={completionRate}
          aria-valuemin="0"
          aria-valuemax="100"
          aria-label="Overall assignment completion progress"
        >
          <div
            className="progress-bar-fill"
            style={{ width: `${Math.min(100, Math.max(0, completionRate))}%` }}
          />
        </div>

        {/* Detailed Breakdown Chips */}
        <div className="progress-breakdown-row">
          <div className="breakdown-item">
            <span className="breakdown-dot dot-completed" />
            <span className="breakdown-text">
              <strong>{completed}</strong> Completed
            </span>
          </div>

          <div className="breakdown-item">
            <span className="breakdown-dot dot-pending" />
            <span className="breakdown-text">
              <strong>{pending}</strong> Pending
            </span>
          </div>

          {overdue > 0 && (
            <div className="breakdown-item">
              <span className="breakdown-dot dot-overdue" />
              <span className="breakdown-text text-danger">
                <strong>{overdue}</strong> Overdue
              </span>
            </div>
          )}

          {estimatedHoursTotal > 0 && (
            <div className="breakdown-item hours-item">
              <Clock size={13} className="hours-icon" />
              <span className="breakdown-text">
                {estimatedHoursCompleted} / {estimatedHoursTotal} hrs logged
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
