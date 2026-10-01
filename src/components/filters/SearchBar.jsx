import { Search, X } from 'lucide-react';
import './SearchBar.css';

export function SearchBar({
  value = '',
  onChange,
  onClear,
  inputRef,
  placeholder = 'Search by title, subject, or description (e.g. SQL)...',
  className = '',
}) {
  return (
    <div className={`search-bar-container ${className}`}>
      <span className="search-icon-wrapper">
        <Search size={16} />
      </span>
      <input
        ref={inputRef}
        id="global-search-input"
        type="text"
        className="search-input"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search assignments"
      />
      <div className="search-right-controls">
        {value ? (
          <button
            type="button"
            className="search-clear-btn"
            onClick={onClear || (() => onChange(''))}
            aria-label="Clear search input"
          >
            <X size={14} />
          </button>
        ) : (
          <kbd className="search-shortcut-hint" title="Press '/' to search">
            /
          </kbd>
        )}
      </div>
    </div>
  );
}
