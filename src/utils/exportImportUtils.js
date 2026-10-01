/**
 * Utilities for exporting and importing assignment data (JSON and CSV formats)
 */

/**
 * Downloads an array of assignments as a formatted JSON file
 * @param {Array} assignments
 * @param {string} [filename='student-assignments.json']
 */
export function exportToJSON(assignments = [], filename = 'student-assignments.json') {
  const jsonContent = JSON.stringify(assignments, null, 2);
  const blob = new Blob([jsonContent], { type: 'application/json;charset=utf-8;' });
  triggerDownload(blob, filename);
}

/**
 * Downloads an array of assignments as a CSV file
 * @param {Array} assignments
 * @param {string} [filename='student-assignments.csv']
 */
export function exportToCSV(assignments = [], filename = 'student-assignments.csv') {
  const headers = [
    'ID',
    'Title',
    'Subject',
    'Deadline',
    'Priority',
    'Status',
    'EstimatedHours',
    'CreatedAt',
    'CompletedAt',
    'Description',
  ];

  const escapeCSV = (value) => {
    if (value === null || value === undefined) return '""';
    const stringValue = String(value).replace(/"/g, '""');
    return `"${stringValue}"`;
  };

  const rows = assignments.map((item) => [
    escapeCSV(item.id),
    escapeCSV(item.title),
    escapeCSV(item.subject),
    escapeCSV(item.deadline),
    escapeCSV(item.priority),
    escapeCSV(item.status),
    escapeCSV(item.estimatedHours ?? ''),
    escapeCSV(item.createdAt ?? ''),
    escapeCSV(item.completedAt ?? ''),
    escapeCSV(item.description ?? ''),
  ]);

  const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  triggerDownload(blob, filename);
}

/**
 * Helper to trigger a browser file download
 * @param {Blob} blob
 * @param {string} filename
 */
function triggerDownload(blob, filename) {
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}

/**
 * Validates and sanitizes imported JSON data
 * @param {*} rawData
 * @returns {{ isValid: boolean, error?: string, sanitizedData?: Array }}
 */
export function validateImportedAssignments(rawData) {
  if (!Array.isArray(rawData)) {
    return {
      isValid: false,
      error: 'Invalid file format. The file must contain a JSON array of assignments.',
    };
  }

  if (rawData.length === 0) {
    return {
      isValid: false,
      error: 'The imported file is empty. Please provide a file with at least one assignment.',
    };
  }

  const sanitized = [];

  for (let i = 0; i < rawData.length; i++) {
    const item = rawData[i];

    if (!item || typeof item !== 'object') {
      return {
        isValid: false,
        error: `Item at index ${i} is not a valid assignment object.`,
      };
    }

    if (!item.title || typeof item.title !== 'string' || !item.title.trim()) {
      return {
        isValid: false,
        error: `Assignment at index ${i} is missing a required "title" property.`,
      };
    }

    const validPriorities = ['low', 'medium', 'high'];
    const validStatuses = ['pending', 'in_progress', 'completed'];

    const priority = validPriorities.includes(String(item.priority).toLowerCase())
      ? String(item.priority).toLowerCase()
      : 'medium';

    const status = validStatuses.includes(String(item.status).toLowerCase())
      ? String(item.status).toLowerCase()
      : 'pending';

    const deadline =
      typeof item.deadline === 'string' && /^\d{4}-\d{2}-\d{2}/.test(item.deadline)
        ? item.deadline.substring(0, 10)
        : new Date().toISOString().split('T')[0];

    sanitized.push({
      id: item.id || `imported-${Date.now()}-${i}`,
      title: item.title.trim(),
      subject: (item.subject && typeof item.subject === 'string' ? item.subject.trim() : 'General'),
      description: (item.description && typeof item.description === 'string' ? item.description.trim() : ''),
      deadline,
      priority,
      status,
      estimatedHours: Number(item.estimatedHours) > 0 ? Number(item.estimatedHours) : 2,
      createdAt: item.createdAt || new Date().toISOString(),
      completedAt: status === 'completed' ? (item.completedAt || new Date().toISOString()) : null,
    });
  }

  return {
    isValid: true,
    sanitizedData: sanitized,
  };
}
