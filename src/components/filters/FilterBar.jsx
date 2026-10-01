import { RotateCcw } from 'lucide-react';
import { Button } from '../ui';
import { SearchBar } from './SearchBar';
import { SubjectFilter } from './SubjectFilter';
import { StatusFilter } from './StatusFilter';
import { PriorityFilter } from './PriorityFilter';
import { SortControls } from './SortControls';
import './FilterBar.css';

export function FilterBar({
  searchTerm,
  onSearchChange,
  searchInputRef,
  selectedSubject,
  onSubjectChange,
  selectedStatus,
  onStatusChange,
  selectedPriority,
  onPriorityChange,
  sortBy,
  onSortChange,
  availableSubjects,
  totalCount,
  filteredCount,
  hasActiveFilters,
  onResetFilters,
}) {
  return (
    <div className="filter-bar-card">
      {/* Top Search & Dropdown Controls Row */}
      <div className="filter-top-row">
        <div className="filter-search-col">
          <SearchBar
            value={searchTerm}
            onChange={onSearchChange}
            onClear={() => onSearchChange('')}
            inputRef={searchInputRef}
          />
        </div>

        <div className="filter-dropdowns-group">
          <StatusFilter
            selected={selectedStatus}
            onChange={onStatusChange}
          />

          <PriorityFilter
            selected={selectedPriority}
            onChange={onPriorityChange}
          />

          <SortControls
            value={sortBy}
            onChange={onSortChange}
          />
        </div>
      </div>

      {/* Subject Pills & Results Row */}
      <div className="filter-bottom-row">
        <div className="filter-subject-section">
          <span className="filter-subject-label">Subject:</span>
          <SubjectFilter
            selected={selectedSubject}
            onChange={onSubjectChange}
            subjects={availableSubjects}
          />
        </div>

        <div className="filter-meta-actions">
          <span className="filter-counter-text">
            Showing <strong>{filteredCount}</strong> of {totalCount}
          </span>

          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              icon={RotateCcw}
              onClick={onResetFilters}
              title="Reset all search queries and active filters"
            >
              Reset Filters
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
