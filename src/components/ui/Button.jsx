import './Button.css';

export function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon: Icon,
  iconRight: IconRight,
  fullWidth = false,
  disabled = false,
  className = '',
  type = 'button',
  onClick,
  ...props
}) {
  const classes = [
    'btn',
    `btn-${variant}`,
    `btn-${size}`,
    fullWidth ? 'btn-full' : '',
    className,
  ]
    .filter(Boolean)
    .join(' ');

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled}
      onClick={onClick}
      {...props}
    >
      {Icon && <span className="btn-icon btn-icon-left"><Icon size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} /></span>}
      <span className="btn-text">{children}</span>
      {IconRight && <span className="btn-icon btn-icon-right"><IconRight size={size === 'sm' ? 14 : size === 'lg' ? 18 : 16} /></span>}
    </button>
  );
}
