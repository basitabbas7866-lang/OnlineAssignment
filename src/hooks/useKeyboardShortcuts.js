import { useEffect } from 'react';

/**
 * Custom hook to register global keyboard shortcuts
 * - '/' : Focus search input
 * - 'n' / 'N' : Open new assignment modal
 * - 'Escape' : Close active modal (handled in Modal component and globally)
 */
export function useKeyboardShortcuts({
  onNewAssignment,
  onFocusSearch,
  isModalOpen = false,
}) {
  useEffect(() => {
    const handleKeyDown = (e) => {
      // Don't trigger shortcuts if user is typing in an input, textarea, or select
      const activeElement = document.activeElement;
      const isInputFocused =
        activeElement &&
        (activeElement.tagName === 'INPUT' ||
          activeElement.tagName === 'TEXTAREA' ||
          activeElement.tagName === 'SELECT' ||
          activeElement.isContentEditable);

      // '/' shortcut to focus search
      if (e.key === '/' && !isInputFocused && !isModalOpen) {
        e.preventDefault();
        if (onFocusSearch) {
          onFocusSearch();
        }
      }

      // 'N' or 'n' shortcut for new assignment
      if ((e.key === 'n' || e.key === 'N') && !isInputFocused && !isModalOpen && !e.ctrlKey && !e.metaKey) {
        e.preventDefault();
        if (onNewAssignment) {
          onNewAssignment();
        }
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onNewAssignment, onFocusSearch, isModalOpen]);
}
