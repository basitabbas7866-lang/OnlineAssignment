import { useMemo, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { assignmentReducer, ASSIGNMENT_ACTIONS } from '../reducer/assignmentReducer';
import { INITIAL_DEMO_ASSIGNMENTS } from '../data/demoAssignments';
import { calculateAssignmentStats } from '../utils/assignmentUtils';

const STORAGE_KEY = 'student_assignments_data';

export function useAssignments() {
  const [assignments, setAssignments] = useLocalStorage(
    STORAGE_KEY,
    INITIAL_DEMO_ASSIGNMENTS
  );

  // Reducer dispatcher wrapper
  const dispatch = useCallback(
    (action) => {
      setAssignments((currentState) => {
        const nextState = assignmentReducer(currentState, action);
        // Console diagnostics for state architecture verification
        console.groupCollapsed(`[AssignmentReducer] Action: ${action.type}`);
        console.log('Action Payload:', action.payload);
        console.log('Previous State:', currentState);
        console.log('Next State:', nextState);
        console.groupEnd();
        return nextState;
      });
    },
    [setAssignments]
  );

  // Derived statistics (memoized)
  const stats = useMemo(() => {
    const calculated = calculateAssignmentStats(assignments);
    return calculated;
  }, [assignments]);

  // Convenience action creators
  const addAssignment = useCallback(
    (assignmentData) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.ADD_ASSIGNMENT, payload: assignmentData });
    },
    [dispatch]
  );

  const editAssignment = useCallback(
    (assignmentData) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.EDIT_ASSIGNMENT, payload: assignmentData });
    },
    [dispatch]
  );

  const deleteAssignment = useCallback(
    (id) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.DELETE_ASSIGNMENT, payload: id });
    },
    [dispatch]
  );

  const toggleStatus = useCallback(
    (id) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.TOGGLE_STATUS, payload: id });
    },
    [dispatch]
  );

  const cycleStatus = useCallback(
    (id) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.CYCLE_STATUS, payload: id });
    },
    [dispatch]
  );

  const setStatus = useCallback(
    (id, status) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.SET_STATUS, payload: { id, status } });
    },
    [dispatch]
  );

  const duplicateAssignment = useCallback(
    (id) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.DUPLICATE_ASSIGNMENT, payload: id });
    },
    [dispatch]
  );

  const resetAssignments = useCallback(() => {
    dispatch({ type: ASSIGNMENT_ACTIONS.RESET_ASSIGNMENTS });
  }, [dispatch]);

  const importAssignments = useCallback(
    (importedList) => {
      dispatch({ type: ASSIGNMENT_ACTIONS.IMPORT_ASSIGNMENTS, payload: importedList });
    },
    [dispatch]
  );

  return {
    assignments,
    stats,
    dispatch,
    addAssignment,
    editAssignment,
    deleteAssignment,
    toggleStatus,
    cycleStatus,
    setStatus,
    duplicateAssignment,
    resetAssignments,
    importAssignments,
  };
}
