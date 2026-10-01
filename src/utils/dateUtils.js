/**
 * Date utility functions for assignment deadline calculations and formatting
 */

/**
 * Standardizes a date string or Date object to midnight timestamp for date-only comparisons
 * @param {string | Date} dateInput
 * @returns {Date}
 */
export function toMidnight(dateInput) {
  const d = new Date(dateInput);
  d.setHours(0, 0, 0, 0);
  return d;
}

/**
 * Checks if a given deadline is overdue relative to today
 * @param {string} deadline - 'YYYY-MM-DD'
 * @param {string} status - 'pending' | 'in_progress' | 'completed'
 * @param {Date} [referenceDate] - defaults to new Date()
 * @returns {boolean}
 */
export function isOverdue(deadline, status, referenceDate = new Date()) {
  if (status === 'completed') return false;
  if (!deadline) return false;

  const deadlineDate = toMidnight(deadline);
  const today = toMidnight(referenceDate);

  return deadlineDate < today;
}

/**
 * Checks if a given deadline falls within the current 7-day window
 * @param {string} deadline - 'YYYY-MM-DD'
 * @param {Date} [referenceDate] - defaults to new Date()
 * @returns {boolean}
 */
export function isDueThisWeek(deadline, referenceDate = new Date()) {
  if (!deadline) return false;

  const deadlineDate = toMidnight(deadline);
  const today = toMidnight(referenceDate);

  const sevenDaysFromNow = new Date(today);
  sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);

  return deadlineDate >= today && deadlineDate <= sevenDaysFromNow;
}

/**
 * Returns the number of days remaining until deadline (negative if overdue)
 * @param {string} deadline
 * @param {Date} [referenceDate]
 * @returns {number}
 */
export function getDaysRemaining(deadline, referenceDate = new Date()) {
  if (!deadline) return 0;

  const deadlineDate = toMidnight(deadline);
  const today = toMidnight(referenceDate);

  const diffTime = deadlineDate.getTime() - today.getTime();
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
}

/**
 * Formats a deadline into human-readable relative text (e.g., 'Due today', 'Due tomorrow', 'Overdue by 2 days')
 * @param {string} deadline
 * @param {string} status
 * @param {Date} [referenceDate]
 * @returns {string}
 */
export function getRelativeDeadline(deadline, status, referenceDate = new Date()) {
  if (status === 'completed') return 'Completed';
  if (!deadline) return 'No deadline';

  const days = getDaysRemaining(deadline, referenceDate);

  if (days < 0) {
    const overdueDays = Math.abs(days);
    return `Overdue by ${overdueDays} day${overdueDays === 1 ? '' : 's'}`;
  }
  if (days === 0) return 'Due today';
  if (days === 1) return 'Due tomorrow';
  if (days <= 7) return `Due in ${days} days`;

  return formatDate(deadline);
}

/**
 * Formats a date string (YYYY-MM-DD) into 'MMM DD, YYYY' or 'MMM DD'
 * @param {string} dateString
 * @param {boolean} includeYear
 * @returns {string}
 */
export function formatDate(dateString, includeYear = false) {
  if (!dateString) return 'N/A';

  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;

  const options = {
    month: 'short',
    day: 'numeric',
    ...(includeYear ? { year: 'numeric' } : {}),
  };

  return date.toLocaleDateString('en-US', options);
}
