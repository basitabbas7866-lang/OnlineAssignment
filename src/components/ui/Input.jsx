import './Input.css';

export function Input({
  label,
  error,
  helperText,
  icon: Icon,
  className = '',
  id,
  type = 'text',
  ...props
}) {
  const inputId = id || (label ? `input-${label.toLowerCase().replace(/\s+/g, '-')}` : undefined);

  return (
    <div className={`input-field-group ${className}`}>
      {label && (
        <label htmlFor={inputId} className="input-label">
          {label}
        </label>
      )}

      <div className={`input-container ${Icon ? 'has-icon' : ''} ${error ? 'has-error' : ''}`}>
        {Icon && (
          <span className="input-icon-left">
            <Icon size={16} />
          </span>
        )}
        <input
          id={inputId}
          type={type}
          className="input-control"
          {...props}
        />
      </div>

      {error ? (
        <p className="input-feedback error">{error}</p>
      ) : helperText ? (
        <p className="input-feedback helper">{helperText}</p>
      ) : null}
    </div>
  );
}
