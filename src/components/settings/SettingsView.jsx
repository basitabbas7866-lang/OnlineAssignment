import { Sun, Moon, Keyboard, Database } from 'lucide-react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, Badge } from '../ui';
import { useTheme } from '../../context';
import { DataManagementBar } from '../data/DataManagementBar';
import './SettingsView.css';

export function SettingsView({
  assignments = [],
  onImportAssignments,
  onResetToDemo,
}) {
  const { theme, setTheme } = useTheme();

  return (
    <div className="settings-view-container">
      {/* Header */}
      <div className="settings-header-bar">
        <div>
          <h2 className="settings-page-title">Workspace Settings</h2>
          <p className="settings-page-subtitle">
            Configure display themes, manage local persistence, and inspect keyboard shortcuts.
          </p>
        </div>
      </div>

      <div className="settings-grid">
        {/* 1. Appearance / Theme Card */}
        <Card className="settings-card">
          <CardHeader>
            <div className="settings-card-title-row">
              <Sun size={20} className="text-primary" />
              <CardTitle as="h3">Appearance & Theme</CardTitle>
            </div>
            <CardDescription>
              Choose your preferred visual aesthetic. Automatically remembers your choice across sessions.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="theme-options-grid">
              <button
                type="button"
                className={`theme-option-box ${theme === 'light' ? 'selected' : ''}`}
                onClick={() => setTheme('light')}
              >
                <div className="theme-preview-bubble light-bubble">
                  <Sun size={24} />
                </div>
                <div className="theme-option-info">
                  <span className="theme-name">Light Theme</span>
                  <span className="theme-desc">Crisp white canvas, high contrast</span>
                </div>
              </button>

              <button
                type="button"
                className={`theme-option-box ${theme === 'dark' ? 'selected' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <div className="theme-preview-bubble dark-bubble">
                  <Moon size={24} />
                </div>
                <div className="theme-option-info">
                  <span className="theme-name">Dark Theme</span>
                  <span className="theme-desc">Sleek obsidian night mode, low glare</span>
                </div>
              </button>
            </div>
          </CardContent>
        </Card>

        {/* 2. Keyboard Shortcuts Cheat Sheet */}
        <Card className="settings-card">
          <CardHeader>
            <div className="settings-card-title-row">
              <Keyboard size={20} className="text-primary" />
              <CardTitle as="h3">Keyboard Navigation</CardTitle>
            </div>
            <CardDescription>
              Power-user hotkeys for fast assignment management and navigation.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="shortcuts-table">
              <div className="shortcut-row">
                <span className="shortcut-desc">Focus Global Search</span>
                <kbd className="shortcut-key">/</kbd>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-desc">Add New Assignment</span>
                <kbd className="shortcut-key">N</kbd>
              </div>
              <div className="shortcut-row">
                <span className="shortcut-desc">Close Active Modal Dialog</span>
                <kbd className="shortcut-key">Esc</kbd>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* 3. Data Persistence & Backup Card */}
        <Card className="settings-card settings-card-wide">
          <CardHeader>
            <div className="settings-card-title-row">
              <Database size={20} className="text-primary" />
              <CardTitle as="h3">Data Backup & Local Persistence</CardTitle>
              <Badge variant="success" size="sm" dot>
                Encrypted in Browser
              </Badge>
            </div>
            <CardDescription>
              Export JSON and CSV backups, restore saved datasets, or reset your workspace to defaults.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <DataManagementBar
              assignments={assignments}
              onImportAssignments={onImportAssignments}
              onResetToDemo={onResetToDemo}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
