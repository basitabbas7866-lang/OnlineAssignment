import { Card } from '../ui';
import './StatCard.css';

export function StatCard({
  label,
  value,
  icon: Icon,
  variant = 'primary',
  badgeText,
  subtitle,
  onClick,
}) {
  return (
    <Card
      hoverable={Boolean(onClick)}
      className={`stat-card stat-card-${variant} ${onClick ? 'is-clickable' : ''}`}
      onClick={onClick}
    >
      <div className="stat-card-inner">
        <div className="stat-card-header">
          <span className="stat-card-label">{label}</span>
          {Icon && (
            <div className={`stat-icon-box stat-icon-${variant}`}>
              <Icon size={18} />
            </div>
          )}
        </div>

        <div className="stat-card-body">
          <span className="stat-card-value">{value}</span>
          {badgeText && (
            <span className={`stat-card-badge stat-badge-${variant}`}>
              {badgeText}
            </span>
          )}
        </div>

        {subtitle && <p className="stat-card-subtitle">{subtitle}</p>}
      </div>
    </Card>
  );
}
