import {
  LayoutDashboard,
  CheckSquare,
  Calendar,
  BarChart3,
  Settings as SettingsIcon,
  BookOpen,
  GraduationCap,
} from 'lucide-react';
import './Sidebar.css';

export function Sidebar({ currentNav, onNavChange, isOpen, onClose, pendingCount }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    {
      id: 'assignments',
      label: 'Assignments',
      icon: CheckSquare,
      badge: pendingCount !== undefined ? String(pendingCount) : undefined,
    },
    { id: 'calendar', label: 'Calendar', icon: Calendar },
    { id: 'analytics', label: 'Analytics', icon: BarChart3 },
    { id: 'settings', label: 'Settings', icon: SettingsIcon },
  ];
  return (
    <>
      {/* Mobile Backdrop */}
      {isOpen && <div className="sidebar-backdrop" onClick={onClose} />}

      <aside className={`app-sidebar ${isOpen ? 'is-open' : ''}`}>
        {/* App Branding */}
        <div className="sidebar-header">
          <div className="sidebar-brand-icon">
            <GraduationCap size={22} />
          </div>
          <div className="sidebar-brand-text">
            <span className="brand-title">Workspace</span>
            <span className="brand-subtitle">Student Portal</span>
          </div>
        </div>

        {/* Navigation Section */}
        <div className="sidebar-nav-section">
          <span className="nav-section-title">Menu</span>
          <nav className="sidebar-nav">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentNav === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  className={`nav-item ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    onNavChange(item.id);
                    if (onClose) onClose();
                  }}
                >
                  <Icon size={18} className="nav-icon" />
                  <span className="nav-label">{item.label}</span>
                  {item.badge && <span className="nav-badge">{item.badge}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* Quick Subjects Footer / Context */}
        <div className="sidebar-footer">
          <div className="semester-pill">
            <BookOpen size={16} />
            <div className="semester-info">
              <span className="semester-name">Fall Semester 2026</span>
              <span className="semester-status">Active Session</span>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
}
