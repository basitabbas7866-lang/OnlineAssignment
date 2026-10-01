import { Sun, Moon, Menu } from 'lucide-react';
import { useTheme } from '../../context';
import { Button } from '../ui/Button';
import './Header.css';

export function Header({ onMenuClick }) {
  const { theme, toggleTheme } = useTheme();

  return (
    <header className="app-header">
      <div className="header-left">
        <button
          type="button"
          className="header-menu-toggle"
          onClick={onMenuClick}
          aria-label="Toggle navigation menu"
        >
          <Menu size={20} />
        </button>
        <div className="header-branding">
          <h1 className="header-app-title">Assignment Workspace</h1>
          <span className="header-tag">Academic Suite</span>
        </div>
      </div>

      <div className="header-right">
        {/* Theme Toggle Button */}
        <Button
          variant="secondary"
          size="md"
          className="theme-toggle-btn"
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
          title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme`}
        >
          {theme === 'light' ? (
            <>
              <Moon size={16} className="theme-icon moon-icon" />
              <span className="theme-text">Dark Mode</span>
            </>
          ) : (
            <>
              <Sun size={16} className="theme-icon sun-icon" />
              <span className="theme-text">Light Mode</span>
            </>
          )}
        </Button>

        {/* User Profile Avatar Pill */}
        <div className="user-profile-pill">
          <div className="user-avatar">
            <span>JD</span>
          </div>
          <div className="user-details">
            <span className="user-name">John Doe</span>
            <span className="user-role">CS Student</span>
          </div>
        </div>
      </div>
    </header>
  );
}
