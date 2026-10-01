import {
  FolderGit2,
  Clock,
  CheckCircle2,
  AlertTriangle,
  Plus,
} from 'lucide-react';
import { Button } from '../ui';
import { StatCard } from './StatCard';
import { ProgressOverview } from './ProgressOverview';
import { DeadlineBanner } from './DeadlineBanner';
import { UpcomingAssignments } from './UpcomingAssignments';
import { RecentAssignments } from './RecentAssignments';
import './DashboardView.css';

export function DashboardView({
  assignments = [],
  stats,
  onAddNew,
  onViewAssignment,
  onCompleteAssignment,
  onNavigateToAssignments,
}) {
  return (
    <div className="dashboard-view-container">
      {/* 1. Header Bar with Quick Action */}
      <div className="dashboard-header-bar">
        <div className="dashboard-header-text">
          <h2 className="dashboard-title">Academic Performance Dashboard</h2>
          <p className="dashboard-subtitle">
            Derived analytics, real-time workload tracking, and priority deadlines.
          </p>
        </div>
        <div className="dashboard-header-cta">
          <Button variant="primary" icon={Plus} onClick={onAddNew}>
            Add Assignment
          </Button>
        </div>
      </div>

      {/* 2. Top Metric StatCards */}
      <div className="dashboard-stats-grid">
        <StatCard
          label="TOTAL"
          value={stats.total}
          icon={FolderGit2}
          variant="primary"
          badgeText="All Courses"
          subtitle="Enrolled deliverables"
        />

        <StatCard
          label="PENDING"
          value={stats.pending}
          icon={Clock}
          variant="warning"
          badgeText={`${stats.dueThisWeek} due this week`}
          subtitle="Awaiting submission"
        />

        <StatCard
          label="COMPLETED"
          value={stats.completed}
          icon={CheckCircle2}
          variant="success"
          badgeText={`${stats.completionRate}% rate`}
          subtitle="Finished deliverables"
        />

        <StatCard
          label="OVERDUE"
          value={stats.overdue}
          icon={AlertTriangle}
          variant="danger"
          badgeText={stats.overdue > 0 ? 'Urgent' : 'None'}
          subtitle={stats.overdue > 0 ? 'Requires attention' : 'No overdue work'}
        />
      </div>

      {/* 3. Urgent Deadline Banner */}
      <DeadlineBanner
        assignment={stats.mostUrgent}
        onViewAssignment={onViewAssignment}
      />

      {/* 4. Overall Completion Progress Bar */}
      <ProgressOverview
        completionRate={stats.completionRate}
        completed={stats.completed}
        pending={stats.pending}
        overdue={stats.overdue}
        total={stats.total}
        estimatedHoursTotal={stats.estimatedHoursTotal}
        estimatedHoursCompleted={stats.estimatedHoursCompleted}
      />

      {/* 5. Dual Column Section: Upcoming vs Recent Activity */}
      <div className="dashboard-dual-grid">
        <UpcomingAssignments
          assignments={assignments}
          onViewAssignment={onViewAssignment}
          onCompleteAssignment={onCompleteAssignment}
          onViewAll={onNavigateToAssignments}
        />

        <RecentAssignments
          assignments={assignments}
          onViewAssignment={onViewAssignment}
          onViewAll={onNavigateToAssignments}
        />
      </div>
    </div>
  );
}
