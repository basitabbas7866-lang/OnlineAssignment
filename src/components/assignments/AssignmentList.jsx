import { Plus, Layers, SearchX, RotateCcw } from 'lucide-react';
import { Button, Badge } from '../ui';
import { AssignmentCard } from './AssignmentCard';
import './AssignmentList.css';

export function AssignmentList({
  assignments = [],
  totalCount,
  isFiltered = false,
  onResetFilters,
  onAddNew,
  onEdit,
  onDuplicate,
  onDelete,
  onCycleStatus,
}) {
  const displayCount = assignments.length;
  const showBadgeText = totalCount !== undefined && isFiltered
    ? `${displayCount} of ${totalCount}`
    : `${displayCount} Total`;

  return (
    <div className="assignment-list-section">
      {/* List Header Bar */}
      <div className="assignment-list-header">
        <div className="header-info">
          <div className="header-title-group">
            <h3 className="assignment-list-title">Assignments Workspace</h3>
            <Badge variant="primary" size="sm">
              {showBadgeText}
            </Badge>
          </div>
          <p className="assignment-list-subtitle">
            Search, filter, prioritize, and track all course deliverables.
          </p>
        </div>

        <Button
          variant="primary"
          size="md"
          icon={Plus}
          onClick={onAddNew}
        >
          Add Assignment
        </Button>
      </div>

      {/* Grid or Filtered Empty State */}
      {assignments.length === 0 ? (
        <div className="assignments-empty-state">
          {isFiltered ? (
            <>
              <div className="empty-icon-box empty-icon-search">
                <SearchX size={36} />
              </div>
              <h4 className="empty-title">No assignments found</h4>
              <p className="empty-description">
                Try changing your filters or create a new assignment.
              </p>
              <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', justifyContent: 'center' }}>
                {onResetFilters && (
                  <Button variant="outline" icon={RotateCcw} onClick={onResetFilters}>
                    Clear Filters
                  </Button>
                )}
                <Button variant="primary" icon={Plus} onClick={onAddNew}>
                  + Add Assignment
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="empty-icon-box">
                <Layers size={36} />
              </div>
              <h4 className="empty-title">No assignments found</h4>
              <p className="empty-description">
                Try changing your filters or create a new assignment.
              </p>
              <Button variant="primary" icon={Plus} onClick={onAddNew}>
                + Add Assignment
              </Button>
            </>
          )}
        </div>
      ) : (
        <div className="assignments-cards-grid">
          {assignments.map((assignment) => (
            <AssignmentCard
              key={assignment.id}
              assignment={assignment}
              onEdit={onEdit}
              onDuplicate={onDuplicate}
              onDelete={onDelete}
              onCycleStatus={onCycleStatus}
            />
          ))}
        </div>
      )}
    </div>
  );
}
