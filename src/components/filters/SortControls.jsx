import { Select } from '../ui';
import { SORT_OPTIONS } from '../../hooks/useAssignmentFilters';
import './SortControls.css';

export function SortControls({
  value = 'deadline-asc',
  onChange,
  className = '',
}) {
  return (
    <div className={`sort-controls-wrapper ${className}`}>
      <Select
        aria-label="Sort assignments"
        options={SORT_OPTIONS}
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
