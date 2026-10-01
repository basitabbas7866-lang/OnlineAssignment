import { useState, useMemo } from 'react';
import { isOverdue } from '../utils/dateUtils.js';

export const SORT_OPTIONS = [
  { value: 'deadline-asc', label: '📅 Deadline ↑ (Earliest)' },
  { value: 'deadline-desc', label: '📅 Deadline ↓ (Latest)' },
  { value: 'priority-desc', label: '🔴 Priority (High to Low)' },
  { value: 'subject-asc', label: '🔤 Subject (A-Z)' },
  { value: 'subject-desc', label: '🔤 Subject (Z-A)' },
];

export function useAssignmentFilters(assignments = []) {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedPriority, setSelectedPriority] = useState('all');
  const [sortBy, setSortBy] = useState('deadline-asc');

  // Dynamically extract unique subjects from assignments
  const availableSubjects = useMemo(() => {
    const subs = new Set();
    assignments.forEach((item) => {
      if (item.subject) subs.add(item.subject);
    });
    return Array.from(subs).sort();
  }, [assignments]);

  // Combined multi-criteria filter and sort
  const filteredAssignments = useMemo(() => {
    return assignments
      .filter((item) => {
        // 1. Text Search across Title, Subject, and Description
        if (searchTerm.trim()) {
          const query = searchTerm.toLowerCase().trim();
          const matchTitle = item.title?.toLowerCase().includes(query);
          const matchSubject = item.subject?.toLowerCase().includes(query);
          const matchDesc = item.description?.toLowerCase().includes(query);

          if (!matchTitle && !matchSubject && !matchDesc) {
            return false;
          }
        }

        // 2. Subject Filter
        if (selectedSubject !== 'all') {
          // Normalize matching (e.g. "DBMS", "Computer Networks", "CN")
          const itemSub = item.subject?.toLowerCase();
          const targetSub = selectedSubject.toLowerCase();
          if (itemSub !== targetSub) {
            // Also allow abbreviation matching like CN <-> Computer Networks, OS <-> Operating Systems
            const isCnMatch = (targetSub === 'cn' && itemSub === 'computer networks') || (targetSub === 'computer networks' && itemSub === 'cn');
            const isOsMatch = (targetSub === 'os' && itemSub === 'operating systems') || (targetSub === 'operating systems' && itemSub === 'os');
            if (!isCnMatch && !isOsMatch) {
              return false;
            }
          }
        }

        // 3. Status Filter (Pending, In Progress, Completed, or Overdue)
        if (selectedStatus !== 'all') {
          if (selectedStatus === 'overdue') {
            if (!isOverdue(item.deadline, item.status)) {
              return false;
            }
          } else if (item.status !== selectedStatus) {
            return false;
          }
        }

        // 4. Priority Filter (High, Medium, Low)
        if (selectedPriority !== 'all') {
          if (item.priority?.toLowerCase() !== selectedPriority.toLowerCase()) {
            return false;
          }
        }

        return true;
      })
      .sort((a, b) => {
        // 5. Sorting
        switch (sortBy) {
          case 'deadline-asc':
            return new Date(a.deadline) - new Date(b.deadline);

          case 'deadline-desc':
            return new Date(b.deadline) - new Date(a.deadline);

          case 'priority-desc': {
            const priorityWeight = { high: 3, medium: 2, low: 1 };
            const weightA = priorityWeight[a.priority?.toLowerCase()] || 0;
            const weightB = priorityWeight[b.priority?.toLowerCase()] || 0;
            if (weightB !== weightA) return weightB - weightA;
            // secondary sort by deadline
            return new Date(a.deadline) - new Date(b.deadline);
          }

          case 'subject-asc':
            return (a.subject || '').localeCompare(b.subject || '');

          case 'subject-desc':
            return (b.subject || '').localeCompare(a.subject || '');

          default:
            return 0;
        }
      });
  }, [
    assignments,
    searchTerm,
    selectedSubject,
    selectedStatus,
    selectedPriority,
    sortBy,
  ]);

  const hasActiveFilters =
    Boolean(searchTerm.trim()) ||
    selectedSubject !== 'all' ||
    selectedStatus !== 'all' ||
    selectedPriority !== 'all' ||
    sortBy !== 'deadline-asc';

  const resetFilters = () => {
    setSearchTerm('');
    setSelectedSubject('all');
    setSelectedStatus('all');
    setSelectedPriority('all');
    setSortBy('deadline-asc');
  };

  return {
    searchTerm,
    setSearchTerm,
    selectedSubject,
    setSelectedSubject,
    selectedStatus,
    setSelectedStatus,
    selectedPriority,
    setSelectedPriority,
    sortBy,
    setSortBy,
    availableSubjects,
    filteredAssignments,
    totalCount: assignments.length,
    filteredCount: filteredAssignments.length,
    hasActiveFilters,
    resetFilters,
  };
}
