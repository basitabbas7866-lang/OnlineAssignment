import { INITIAL_DEMO_ASSIGNMENTS } from '../data/demoAssignments.js';

export const ASSIGNMENT_ACTIONS = {
  ADD_ASSIGNMENT: 'ADD_ASSIGNMENT',
  EDIT_ASSIGNMENT: 'EDIT_ASSIGNMENT',
  DELETE_ASSIGNMENT: 'DELETE_ASSIGNMENT',
  TOGGLE_STATUS: 'TOGGLE_STATUS',
  CYCLE_STATUS: 'CYCLE_STATUS',
  SET_STATUS: 'SET_STATUS',
  DUPLICATE_ASSIGNMENT: 'DUPLICATE_ASSIGNMENT',
  RESET_ASSIGNMENTS: 'RESET_ASSIGNMENTS',
  IMPORT_ASSIGNMENTS: 'IMPORT_ASSIGNMENTS',
};

function generateId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `asg-${Date.now()}-${Math.random().toString(36).substring(2, 9)}`;
}

/**
 * Assignment state reducer
 * @param {Array} state - Current array of assignment objects
 * @param {Object} action - Dispatched action with type and payload
 * @returns {Array} - New array of assignment objects
 */
export function assignmentReducer(state = [], action) {
  switch (action.type) {
    case ASSIGNMENT_ACTIONS.ADD_ASSIGNMENT: {
      const payload = action.payload || {};
      const newAssignment = {
        id: payload.id || generateId(),
        title: payload.title?.trim() || 'Untitled Assignment',
        subject: payload.subject?.trim() || 'General',
        description: payload.description?.trim() || '',
        deadline: payload.deadline || new Date().toISOString().split('T')[0],
        priority: payload.priority || 'medium',
        status: payload.status || 'pending',
        estimatedHours: Number(payload.estimatedHours) || 1,
        createdAt: payload.createdAt || new Date().toISOString(),
        completedAt: payload.status === 'completed' ? new Date().toISOString() : null,
      };
      return [newAssignment, ...state];
    }

    case ASSIGNMENT_ACTIONS.EDIT_ASSIGNMENT: {
      const updated = action.payload;
      if (!updated || !updated.id) return state;

      return state.map((item) => {
        if (item.id !== updated.id) return item;

        const isNowCompleted = updated.status === 'completed';
        const wasCompleted = item.status === 'completed';
        const completedAt = isNowCompleted
          ? (wasCompleted ? item.completedAt : new Date().toISOString())
          : null;

        return {
          ...item,
          ...updated,
          completedAt,
        };
      });
    }

    case ASSIGNMENT_ACTIONS.DELETE_ASSIGNMENT: {
      const idToDelete = action.payload;
      return state.filter((item) => item.id !== idToDelete);
    }

    case ASSIGNMENT_ACTIONS.TOGGLE_STATUS: {
      const idToToggle = action.payload;
      return state.map((item) => {
        if (item.id !== idToToggle) return item;

        const willBeCompleted = item.status !== 'completed';
        return {
          ...item,
          status: willBeCompleted ? 'completed' : 'pending',
          completedAt: willBeCompleted ? new Date().toISOString() : null,
        };
      });
    }

    case ASSIGNMENT_ACTIONS.CYCLE_STATUS: {
      const idToCycle = action.payload;
      const statusCycleMap = {
        pending: 'in_progress',
        in_progress: 'completed',
        completed: 'pending',
      };

      return state.map((item) => {
        if (item.id !== idToCycle) return item;

        const nextStatus = statusCycleMap[item.status] || 'pending';
        return {
          ...item,
          status: nextStatus,
          completedAt: nextStatus === 'completed' ? new Date().toISOString() : null,
        };
      });
    }

    case ASSIGNMENT_ACTIONS.SET_STATUS: {
      const { id, status } = action.payload || {};
      if (!id || !status) return state;

      return state.map((item) => {
        if (item.id !== id) return item;

        return {
          ...item,
          status,
          completedAt: status === 'completed' ? new Date().toISOString() : null,
        };
      });
    }

    case ASSIGNMENT_ACTIONS.DUPLICATE_ASSIGNMENT: {
      const idToDuplicate = action.payload;
      const targetIndex = state.findIndex((item) => item.id === idToDuplicate);
      if (targetIndex === -1) return state;

      const target = state[targetIndex];
      const duplicated = {
        ...target,
        id: generateId(),
        title: `${target.title} (Copy)`,
        createdAt: new Date().toISOString(),
        completedAt: null,
        status: 'pending',
      };

      const next = [...state];
      next.splice(targetIndex + 1, 0, duplicated);
      return next;
    }

    case ASSIGNMENT_ACTIONS.RESET_ASSIGNMENTS: {
      return INITIAL_DEMO_ASSIGNMENTS;
    }

    case ASSIGNMENT_ACTIONS.IMPORT_ASSIGNMENTS: {
      if (Array.isArray(action.payload)) {
        return action.payload;
      }
      return state;
    }

    default:
      return state;
  }
}
