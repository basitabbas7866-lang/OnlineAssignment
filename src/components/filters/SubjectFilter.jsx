import './SubjectFilter.css';

export function SubjectFilter({
  selected = 'all',
  onChange,
  subjects = ['DBMS', 'Computer Networks', 'Java', 'AI', 'Operating Systems'],
}) {
  const allOptions = ['all', ...subjects];

  const getLabel = (sub) => {
    if (sub === 'all') return 'All Subjects';
    if (sub === 'Computer Networks') return 'CN';
    if (sub === 'Operating Systems') return 'OS';
    return sub;
  };

  return (
    <div className="subject-filter-container">
      <div className="subject-pills-row" role="tablist" aria-label="Filter by subject">
        {allOptions.map((sub) => {
          const isActive = selected.toLowerCase() === sub.toLowerCase();
          return (
            <button
              key={sub}
              type="button"
              role="tab"
              aria-selected={isActive}
              className={`subject-pill ${isActive ? 'active' : ''}`}
              onClick={() => onChange(sub)}
            >
              {getLabel(sub)}
            </button>
          );
        })}
      </div>
    </div>
  );
}
