import { ChevronDown } from 'lucide-react';
import './Select.css';

export function Select({
  label,
  error,
  helperText,
  options = [],
  children,
  className = '',
  id,
  ...props
}) {
  const selectId = id || (label ? `select-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`select-field-group ${className}`}>
      {label && (
        <label htmlFor={selectId} className="select-label">
          {label}
        </label>
      )}

      <div className={`select-container ${error ? 'has-error' : ''}`}>
        <select id={selectId} className="select-control" {...props}>
          {options.length > 0
            ? options.map((opt) => (
                <option key={opt.value} value={opt.value} disabled={opt.disabled}>
                  {opt.label}
                </option>
              ))
            : children}
        </select>
        <span className="select-chevron">
          <ChevronDown size={16} />
        </span>
      </div>

      {error ? (
        <p className="select-feedback error">{error}</p>
      ) : helperText ? (
        <p className="select-feedback helper">{helperText}</p>
      ) : null}
    </div>
  );
}
