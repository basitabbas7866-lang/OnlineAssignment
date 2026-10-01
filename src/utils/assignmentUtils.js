import { isOverdue, isDueThisWeek } from './dateUtils.js';

/**
 * Returns total count of assignments
 * @param {Array} assignments
 * @returns {number}
 */
export function getTotal(assignments = []) {
  return assignments.length;
}

/**
 * Returns count of assignments that are pending or in-progress
 * @param {Array} assignments
 * @returns {number}
 */
export function getPending(assignments = []) {
  return assignments.filter(
    (item) => item.status === 'pending' || item.status === 'in_progress'
  ).length;
}

/**
 * Returns count of completed assignments
 * @param {Array} assignments
 * @returns {number}
 */
export function getCompleted(assignments = []) {
  return assignments.filter((item) => item.status === 'completed').length;
}

/**
 * Returns count of overdue assignments (deadline passed and not completed)
 * @param {Array} assignments
 * @param {Date} [referenceDate]
 * @returns {number}
 */
export function getOverdue(assignments = []) {
  return assignments.filter((item) => isOverdue(item.deadline, item.status)).length;
}

/**
 * Returns completion rate as a rounded percentage (0-100)
 * @param {Array} assignments
 * @returns {number}
 */
export function getCompletionRate(assignments = []) {
  const total = getTotal(assignments);
  if (total === 0) return 0;
  const completed = getCompleted(assignments);
  return Math.round((completed / total) * 100);
}

/**
 * Returns count of assignments due within the current 7 days
 * @param {Array} assignments
 * @returns {number}
 */
export function getDueThisWeek(assignments = []) {
  return assignments.filter(
    (item) => item.status !== 'completed' && isDueThisWeek(item.deadline)
  ).length;
}

/**
 * Returns the most urgent upcoming or overdue active assignment
 * @param {Array} assignments
 * @returns {Object|null}
 */
export function getMostUrgentAssignment(assignments = []) {
  const activeItems = assignments.filter((item) => item.status !== 'completed');
  if (activeItems.length === 0) return null;

  // Check if any are overdue
  const overdueItems = activeItems.filter((item) => isOverdue(item.deadline, item.status));
  if (overdueItems.length > 0) {
    // Sort earliest overdue first
    return overdueItems.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
  }

  // Otherwise, sort closest upcoming deadline first
  return activeItems.sort((a, b) => new Date(a.deadline) - new Date(b.deadline))[0];
}

/**
 * Calculates a consolidated statistics summary for a list of assignments
 * @param {Array} assignments
 * @returns {Object}
 */
export function calculateAssignmentStats(assignments = []) {
  const total = getTotal(assignments);
  const pending = getPending(assignments);
  const completed = getCompleted(assignments);
  const overdue = getOverdue(assignments);
  const completionRate = getCompletionRate(assignments);
  const dueThisWeek = getDueThisWeek(assignments);

  // Derived estimated hours
  const estimatedHoursTotal = assignments.reduce(
    (acc, curr) => acc + (Number(curr.estimatedHours) || 0),
    0
  );
  const estimatedHoursCompleted = assignments
    .filter((item) => item.status === 'completed')
    .reduce((acc, curr) => acc + (Number(curr.estimatedHours) || 0), 0);

  const mostUrgent = getMostUrgentAssignment(assignments);

  return {
    total,
    pending,
    completed,
    overdue,
    completionRate,
    dueThisWeek,
    estimatedHoursTotal,
    estimatedHoursCompleted,
    mostUrgent,
  };
}
