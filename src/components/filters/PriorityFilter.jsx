import { Select } from '../ui';
import './PriorityFilter.css';

const PRIORITY_FILTER_OPTIONS = [
  { value: 'all', label: 'All Priorities' },
  { value: 'high', label: '🔴 High Priority' },
  { value: 'medium', label: '🟡 Medium Priority' },
  { value: 'low', label: '🟢 Low Priority' },
];

export function PriorityFilter({
  selected = 'all',
  onChange,
  className = '',
}) {
  return (
    <div className={`priority-filter-wrapper ${className}`}>
      <Select
        aria-label="Filter by Priority"
        options={PRIORITY_FILTER_OPTIONS}
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
