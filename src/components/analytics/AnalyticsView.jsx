import { useMemo } from 'react';
import {
  Clock,
  CheckCircle2,
  Flame,
} from 'lucide-react';
import { Card, CardHeader, CardTitle, CardContent, Badge } from '../ui';
import './AnalyticsView.css';

export function AnalyticsView({ assignments = [] }) {
  // 1. Subject Workload (hours per subject, sorted descending)
  const subjectWorkload = useMemo(() => {
    const hoursMap = {};
    const taskCountMap = {};

    assignments.forEach((item) => {
      const sub = item.subject || 'General';
      const hours = Number(item.estimatedHours) || 1;
      hoursMap[sub] = (hoursMap[sub] || 0) + hours;
      taskCountMap[sub] = (taskCountMap[sub] || 0) + 1;
    });

    const entries = Object.entries(hoursMap).map(([subject, hours]) => ({
      subject,
      hours,
      tasks: taskCountMap[subject] || 0,
    }));

    entries.sort((a, b) => b.hours - a.hours);
    const maxHours = Math.max(...entries.map((e) => e.hours), 1);

    return { entries, maxHours };
  }, [assignments]);

  // 2. Priority Distribution
  const priorityDistribution = useMemo(() => {
    const counts = { high: 0, medium: 0, low: 0 };
    assignments.forEach((item) => {
      const p = item.priority?.toLowerCase() || 'medium';
      if (counts[p] !== undefined) counts[p]++;
      else counts.medium++;
    });

    const total = assignments.length || 1;
    const maxCount = Math.max(counts.high, counts.medium, counts.low, 1);

    return [
      {
        priority: 'High',
        count: counts.high,
        percentage: Math.round((counts.high / total) * 100),
        barPercent: Math.round((counts.high / maxCount) * 100),
        color: 'var(--danger-500)',
        bg: 'var(--danger-bg)',
      },
      {
        priority: 'Medium',
        count: counts.medium,
        percentage: Math.round((counts.medium / total) * 100),
        barPercent: Math.round((counts.medium / maxCount) * 100),
        color: 'var(--warning-500)',
        bg: 'var(--warning-bg)',
      },
      {
        priority: 'Low',
        count: counts.low,
        percentage: Math.round((counts.low / total) * 100),
        barPercent: Math.round((counts.low / maxCount) * 100),
        color: 'var(--success-500)',
        bg: 'var(--success-bg)',
      },
    ];
  }, [assignments]);

  // 3. Completion Distribution
  const completionStats = useMemo(() => {
    const total = assignments.length || 1;
    const completed = assignments.filter((i) => i.status === 'completed').length;
    const inProgress = assignments.filter((i) => i.status === 'in_progress').length;
    const pending = assignments.filter((i) => i.status === 'pending').length;

    return {
      completed: {
        count: completed,
        percentage: Math.round((completed / total) * 100),
      },
      inProgress: {
        count: inProgress,
        percentage: Math.round((inProgress / total) * 100),
      },
      pending: {
        count: pending,
        percentage: Math.round((pending / total) * 100),
      },
    };
  }, [assignments]);

  // 4. Summary metrics
  const totalHours = useMemo(
    () => assignments.reduce((acc, curr) => acc + (Number(curr.estimatedHours) || 0), 0),
    [assignments]
  );

  const completedHours = useMemo(
    () =>
      assignments
        .filter((i) => i.status === 'completed')
        .reduce((acc, curr) => acc + (Number(curr.estimatedHours) || 0), 0),
    [assignments]
  );

  const busiestSubject = subjectWorkload.entries[0]?.subject || 'N/A';

  return (
    <div className="analytics-view-container">
      {/* Top Banner */}
      <div className="analytics-header-bar">
        <div>
          <h2 className="analytics-page-title">Coursework Workload Analytics</h2>
          <p className="analytics-page-subtitle">
            Visual breakdown of academic time commitments, priority weights, and completion velocity.
          </p>
        </div>
      </div>

      {/* Quick Summary Cards */}
      <div className="analytics-summary-grid">
        <Card className="summary-stat-box">
          <CardContent className="summary-stat-body">
            <div className="summary-stat-icon icon-indigo">
              <Clock size={20} />
            </div>
            <div>
              <span className="summary-stat-label">Total Workload</span>
              <span className="summary-stat-val">{totalHours} hrs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="summary-stat-box">
          <CardContent className="summary-stat-body">
            <div className="summary-stat-icon icon-emerald">
              <CheckCircle2 size={20} />
            </div>
            <div>
              <span className="summary-stat-label">Hours Finished</span>
              <span className="summary-stat-val">{completedHours} hrs</span>
            </div>
          </CardContent>
        </Card>

        <Card className="summary-stat-box">
          <CardContent className="summary-stat-body">
            <div className="summary-stat-icon icon-amber">
              <Flame size={20} />
            </div>
            <div>
              <span className="summary-stat-label">Busiest Subject</span>
              <span className="summary-stat-val">{busiestSubject}</span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Analytics Visual Charts Grid */}
      <div className="analytics-charts-grid">
        {/* 1. Subject Workload Chart */}
        <Card className="chart-card chart-card-wide">
          <CardHeader>
            <div className="chart-header-row">
              <CardTitle as="h4">Subject Workload Distribution</CardTitle>
              <Badge variant="primary" size="sm">
                Estimated Hours
              </Badge>
            </div>
          </CardHeader>
          <CardContent>
            <div className="workload-bars-list">
              {subjectWorkload.entries.map((item) => {
                const widthPercent = Math.max(
                  8,
                  Math.round((item.hours / subjectWorkload.maxHours) * 100)
                );

                return (
                  <div key={item.subject} className="workload-bar-item">
                    <div className="workload-bar-labels">
                      <span className="subject-name">{item.subject}</span>
                      <span className="subject-hours">{item.hours}h</span>
                    </div>

                    <div className="workload-track">
                      <div
                        className="workload-fill"
                        style={{ width: `${widthPercent}%` }}
                      >
                        <span className="workload-tasks-hint">
                          {item.tasks} {item.tasks === 1 ? 'task' : 'tasks'}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* 2. Priority Distribution Chart */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle as="h4">Priority Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="priority-bars-list">
              {priorityDistribution.map((item) => (
                <div key={item.priority} className="priority-bar-item">
                  <div className="priority-bar-header">
                    <span className="priority-label">{item.priority}</span>
                    <span className="priority-count-badge">
                      {item.count} tasks ({item.percentage}%)
                    </span>
                  </div>

                  <div className="priority-track">
                    <div
                      className="priority-fill"
                      style={{
                        width: `${Math.max(6, item.barPercent)}%`,
                        backgroundColor: item.color,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* 3. Completion Breakdown */}
        <Card className="chart-card">
          <CardHeader>
            <CardTitle as="h4">Completion Status</CardTitle>
          </CardHeader>
          <CardContent>
            {/* Multi-segment stacked progress track */}
            <div className="completion-stacked-track">
              <div
                className="stacked-seg seg-completed"
                style={{ width: `${completionStats.completed.percentage}%` }}
                title={`Completed: ${completionStats.completed.percentage}%`}
              />
              <div
                className="stacked-seg seg-in_progress"
                style={{ width: `${completionStats.inProgress.percentage}%` }}
                title={`In Progress: ${completionStats.inProgress.percentage}%`}
              />
              <div
                className="stacked-seg seg-pending"
                style={{ width: `${completionStats.pending.percentage}%` }}
                title={`Pending: ${completionStats.pending.percentage}%`}
              />
            </div>

            {/* List breakdown */}
            <div className="completion-rows-list">
              <div className="completion-row">
                <div className="completion-label-wrap">
                  <span className="status-dot dot-completed" />
                  <span className="status-text">Completed</span>
                </div>
                <div className="completion-val-wrap">
                  <span className="status-count">{completionStats.completed.count}</span>
                  <span className="status-pct">{completionStats.completed.percentage}%</span>
                </div>
              </div>

              <div className="completion-row">
                <div className="completion-label-wrap">
                  <span className="status-dot dot-in_progress" />
                  <span className="status-text">In Progress</span>
                </div>
                <div className="completion-val-wrap">
                  <span className="status-count">{completionStats.inProgress.count}</span>
                  <span className="status-pct">{completionStats.inProgress.percentage}%</span>
                </div>
              </div>

              <div className="completion-row">
                <div className="completion-label-wrap">
                  <span className="status-dot dot-pending" />
                  <span className="status-text">Pending</span>
                </div>
                <div className="completion-val-wrap">
                  <span className="status-count">{completionStats.pending.count}</span>
                  <span className="status-pct">{completionStats.pending.percentage}%</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
