import { Select } from '../ui';
import './StatusFilter.css';

const STATUS_FILTER_OPTIONS = [
  { value: 'all', label: 'All Statuses' },
  { value: 'pending', label: '⏳ Pending' },
  { value: 'in_progress', label: '⚡ In Progress' },
  { value: 'completed', label: '✅ Completed' },
  { value: 'overdue', label: '🚨 Overdue' },
];

export function StatusFilter({
  selected = 'all',
  onChange,
  className = '',
}) {
  return (
    <div className={`status-filter-wrapper ${className}`}>
      <Select
        aria-label="Filter by Status"
        options={STATUS_FILTER_OPTIONS}
        value={selected}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}
