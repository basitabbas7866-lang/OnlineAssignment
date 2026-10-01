import { LayoutGrid, Columns3, Calendar as CalendarIcon } from 'lucide-react';
import './ViewSwitcher.css';

export function ViewSwitcher({ currentView = 'list', onViewChange }) {
  const views = [
    { id: 'list', label: 'List', icon: LayoutGrid },
    { id: 'kanban', label: 'Kanban', icon: Columns3 },
    { id: 'calendar', label: 'Calendar', icon: CalendarIcon },
  ];

  return (
    <div className="view-switcher-group" role="tablist" aria-label="Switch workspace view">
      {views.map((v) => {
        const Icon = v.icon;
        const isActive = currentView === v.id;
        return (
          <button
            key={v.id}
            type="button"
            role="tab"
            aria-selected={isActive}
            className={`view-switcher-btn ${isActive ? 'active' : ''}`}
            onClick={() => onViewChange(v.id)}
            title={`Switch to ${v.label} view`}
          >
            <Icon size={16} />
            <span>{v.label}</span>
          </button>
        );
      })}
    </div>
  );
}
