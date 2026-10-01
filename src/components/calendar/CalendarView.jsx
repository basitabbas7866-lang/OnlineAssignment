import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock, Plus } from 'lucide-react';
import { Button, Badge } from '../ui';
import { formatDate, isOverdue } from '../../utils/dateUtils.js';
import './CalendarView.css';

const DAYS_OF_WEEK = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const formatToDateString = (date) => {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
};

export function CalendarView({
  assignments = [],
  onSelectAssignment,
  onAddNewWithDate,
}) {
  // Default to October 2026 (or current date's month)
  const [currentDate, setCurrentDate] = useState(() => {
    // Check if there are assignments with deadlines; pick October 2026
    return new Date(2026, 9, 1); // 9 is October (0-indexed)
  });

  const [selectedDayString, setSelectedDayString] = useState('2026-10-02');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  // Map assignments by deadline string: { 'YYYY-MM-DD': [assignments] }
  const assignmentsByDate = useMemo(() => {
    const map = {};
    assignments.forEach((item) => {
      if (item.deadline) {
        if (!map[item.deadline]) map[item.deadline] = [];
        map[item.deadline].push(item);
      }
    });
    return map;
  }, [assignments]);

  // Generate calendar grid matrix
  const calendarDays = useMemo(() => {
    const firstDayOfMonth = new Date(year, month, 1);
    const lastDayOfMonth = new Date(year, month + 1, 0);

    // Day of week for 1st of month: 0 (Sun) to 6 (Sat)
    // Convert to Mon = 0, Sun = 6
    let startDayOfWeek = firstDayOfMonth.getDay() - 1;
    if (startDayOfWeek === -1) startDayOfWeek = 6;

    const daysInCurrentMonth = lastDayOfMonth.getDate();
    const daysInPrevMonth = new Date(year, month, 0).getDate();

    const days = [];

    // Previous month padding days
    for (let i = startDayOfWeek - 1; i >= 0; i--) {
      const dayNum = daysInPrevMonth - i;
      const prevDate = new Date(year, month - 1, dayNum);
      const dateString = formatToDateString(prevDate);
      days.push({
        date: prevDate,
        dayNum,
        dateString,
        isCurrentMonth: false,
        assignments: assignmentsByDate[dateString] || [],
      });
    }

    // Current month days
    for (let dayNum = 1; dayNum <= daysInCurrentMonth; dayNum++) {
      const curDate = new Date(year, month, dayNum);
      const dateString = formatToDateString(curDate);

      days.push({
        date: curDate,
        dayNum,
        dateString,
        isCurrentMonth: true,
        assignments: assignmentsByDate[dateString] || [],
      });
    }

    // Next month padding days to complete 35 or 42 grid cells
    const remainingCells = (7 - (days.length % 7)) % 7;
    for (let dayNum = 1; dayNum <= remainingCells; dayNum++) {
      const nextDate = new Date(year, month + 1, dayNum);
      const dateString = formatToDateString(nextDate);
      days.push({
        date: nextDate,
        dayNum,
        dateString,
        isCurrentMonth: false,
        assignments: assignmentsByDate[dateString] || [],
      });
    }

    return days;
  }, [year, month, assignmentsByDate]);

  const handlePrevMonth = () => {
    setCurrentDate(new Date(year, month - 1, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(new Date(year, month + 1, 1));
  };

  const handleGoToday = () => {
    setCurrentDate(new Date(2026, 8, 28)); // Sep 28, 2026
    setSelectedDayString('2026-09-28');
  };

  const selectedDateAssignments = assignmentsByDate[selectedDayString] || [];

  return (
    <div className="calendar-view-container">
      {/* Calendar Header Navigation */}
      <div className="calendar-header-bar">
        <div className="calendar-title-wrap">
          <CalendarIcon size={20} className="text-primary" />
          <h3 className="calendar-month-heading">
            {monthName} {year}
          </h3>
        </div>

        <div className="calendar-nav-controls">
          <Button variant="secondary" size="sm" onClick={handleGoToday}>
            Today
          </Button>
          <div className="calendar-chevron-btns">
            <button
              type="button"
              className="calendar-arrow-btn"
              onClick={handlePrevMonth}
              aria-label="Previous month"
            >
              <ChevronLeft size={18} />
            </button>
            <button
              type="button"
              className="calendar-arrow-btn"
              onClick={handleNextMonth}
              aria-label="Next month"
            >
              <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Main Calendar Layout: Grid + Selected Day Inspector */}
      <div className="calendar-layout-grid">
        {/* Monthly Grid */}
        <div className="calendar-grid-card">
          {/* Day of Week Header */}
          <div className="calendar-weekdays-header">
            {DAYS_OF_WEEK.map((day) => (
              <div key={day} className="calendar-weekday-cell">
                {day}
              </div>
            ))}
          </div>

          {/* Days Grid Cells */}
          <div className="calendar-days-matrix">
            {calendarDays.map((cell, cellIdx) => {
              const hasDeadlines = cell.assignments.length > 0;
              const isSelected = cell.dateString === selectedDayString;
              const hasOverdue = cell.assignments.some((a) =>
                isOverdue(a.deadline, a.status)
              );

              return (
                <div
                  key={`${cell.dateString}-${cell.isCurrentMonth ? 'in' : 'out'}-${cellIdx}`}
                  className={`calendar-day-cell ${
                    cell.isCurrentMonth ? 'in-month' : 'out-of-month'
                  } ${isSelected ? 'is-selected' : ''} ${
                    hasDeadlines ? 'has-deadlines' : ''
                  }`}
                  onClick={() => setSelectedDayString(cell.dateString)}
                >
                  <div className="day-cell-top">
                    <span className="day-number">{cell.dayNum}</span>
                    {hasDeadlines && (
                      <span
                        className={`day-deadline-dot ${
                          hasOverdue ? 'dot-danger' : 'dot-primary'
                        }`}
                      />
                    )}
                  </div>

                  {/* Mini Assignment Chips on the Date */}
                  <div className="day-cell-chips">
                    {cell.assignments.slice(0, 2).map((item) => (
                      <div
                        key={item.id}
                        className={`mini-deadline-chip chip-${item.status}`}
                        onClick={(e) => {
                          e.stopPropagation();
                          onSelectAssignment(item);
                        }}
                        title={`${item.subject}: ${item.title}`}
                      >
                        <span className="chip-subject">{item.subject}</span>
                        <span className="chip-title">{item.title}</span>
                      </div>
                    ))}
                    {cell.assignments.length > 2 && (
                      <span className="more-chips-indicator">
                        +{cell.assignments.length - 2} more
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Date Inspector Sidebar */}
        <div className="calendar-inspector-panel">
          <div className="inspector-header">
            <h4 className="inspector-title">Deliverables on Date</h4>
            <span className="inspector-date-badge">
              {formatDate(selectedDayString, true)}
            </span>
          </div>

          <div className="inspector-content">
            {selectedDateAssignments.length === 0 ? (
              <div className="inspector-empty">
                <p>No deadlines on this date.</p>
                {onAddNewWithDate && (
                  <Button
                    variant="outline"
                    size="sm"
                    icon={Plus}
                    onClick={() => onAddNewWithDate(selectedDayString)}
                  >
                    Add for this date
                  </Button>
                )}
              </div>
            ) : (
              <div className="inspector-items-list">
                {selectedDateAssignments.map((item) => {
                  const overdue = isOverdue(item.deadline, item.status);
                  return (
                    <div
                      key={item.id}
                      className="inspector-assignment-item"
                      onClick={() => onSelectAssignment(item)}
                    >
                      <div className="inspector-item-top">
                        <Badge variant="primary" size="sm">
                          {item.subject}
                        </Badge>
                        <Badge
                          variant={overdue ? 'danger' : item.status === 'completed' ? 'success' : 'warning'}
                          size="sm"
                          dot
                        >
                          {item.status}
                        </Badge>
                      </div>
                      <h5 className="inspector-item-title">{item.title}</h5>
                      {item.estimatedHours ? (
                        <span className="inspector-item-meta">
                          <Clock size={12} /> {item.estimatedHours} hrs estimated
                        </span>
                      ) : null}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
