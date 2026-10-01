import { useState, useRef } from 'react';
import { AppLayout } from './components/layout/AppLayout';
import {
  AssignmentList,
  AssignmentModal,
  DeleteConfirmModal,
} from './components/assignments';
import { DashboardView } from './components/dashboard';
import { FilterBar } from './components/filters';
import { ViewSwitcher } from './components/views/ViewSwitcher';
import { KanbanBoard } from './components/kanban';
import { CalendarView } from './components/calendar';
import { AnalyticsView } from './components/analytics';
import { SettingsView } from './components/settings';
import { DataManagementBar } from './components/data';
import { useAssignments } from './hooks/useAssignments';
import { useAssignmentFilters } from './hooks/useAssignmentFilters';
import { useKeyboardShortcuts } from './hooks/useKeyboardShortcuts';
import './App.css';

export default function App() {
  const [currentNav, setCurrentNav] = useState('dashboard');
  const [assignmentViewMode, setAssignmentViewMode] = useState('list'); // 'list' | 'kanban' | 'calendar'

  // Core Assignment State & Derived Metrics
  const {
    assignments,
    stats,
    addAssignment,
    editAssignment,
    deleteAssignment,
    duplicateAssignment,
    cycleStatus,
    setStatus,
    resetAssignments,
    importAssignments,
  } = useAssignments();

  // Multi-criteria Search, Filter & Sort Engine (Phase 5)
  const {
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
    totalCount,
    filteredCount,
    hasActiveFilters,
    resetFilters,
  } = useAssignmentFilters(assignments);

  // Modal States
  const [isAddEditModalOpen, setIsAddEditModalOpen] = useState(false);
  const [editingAssignment, setEditingAssignment] = useState(null);

  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [assignmentToDelete, setAssignmentToDelete] = useState(null);

  // Search input ref for keyboard shortcut focusing
  const searchInputRef = useRef(null);

  // Modal Triggers
  const handleOpenAddModal = (presetValues = {}) => {
    setEditingAssignment(
      Object.keys(presetValues).length > 0
        ? { title: '', subject: 'DBMS', priority: 'medium', ...presetValues }
        : null
    );
    setIsAddEditModalOpen(true);
  };

  // Phase 8: Keyboard Shortcuts ('/' to focus search, 'N' for new assignment)
  useKeyboardShortcuts({
    onNewAssignment: () => handleOpenAddModal(),
    onFocusSearch: () => {
      setCurrentNav('assignments');
      setAssignmentViewMode('list');
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 50);
    },
    isModalOpen: isAddEditModalOpen || isDeleteModalOpen,
  });

  const handleOpenEditModal = (assignment) => {
    setEditingAssignment(assignment);
    setIsAddEditModalOpen(true);
  };

  const handleSaveAssignment = (formData) => {
    if (editingAssignment?.id) {
      editAssignment(formData);
    } else {
      addAssignment(formData);
    }
  };

  const handlePromptDelete = (assignment) => {
    setAssignmentToDelete(assignment);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = () => {
    if (assignmentToDelete) {
      deleteAssignment(assignmentToDelete.id);
      setIsDeleteModalOpen(false);
      setAssignmentToDelete(null);
    }
  };

  const handleQuickComplete = (id) => {
    setStatus(id, 'completed');
  };

  return (
    <AppLayout
      currentNav={currentNav}
      onNavChange={setCurrentNav}
      pendingCount={stats.pending}
    >
      {/* 1. Dashboard View (Phase 4) */}
      {currentNav === 'dashboard' && (
        <DashboardView
          assignments={assignments}
          stats={stats}
          onAddNew={() => handleOpenAddModal()}
          onViewAssignment={handleOpenEditModal}
          onCompleteAssignment={handleQuickComplete}
          onNavigateToAssignments={() => setCurrentNav('assignments')}
        />
      )}

      {/* 2. Assignments Workspace View (Phase 5 & Phase 6 View Switcher / Kanban / Calendar) */}
      {currentNav === 'assignments' && (
        <div className="view-container">
          {/* Header Action & View Switcher Bar */}
          <div className="view-switcher-header-row">
            <div className="view-switcher-title-wrap">
              <h2 className="view-section-title">Assignments Workspace</h2>
              <span className="view-section-badge">
                {filteredCount} of {totalCount} active
              </span>
            </div>

            <div className="view-switcher-actions-wrap">
              {/* Part A: View Switcher [List] [Kanban] [Calendar] */}
              <ViewSwitcher
                currentView={assignmentViewMode}
                onViewChange={setAssignmentViewMode}
              />
            </div>
          </div>

          {/* Unified FilterBar (available for List & Kanban views) */}
          {assignmentViewMode !== 'calendar' && (
            <FilterBar
              searchTerm={searchTerm}
              onSearchChange={setSearchTerm}
              searchInputRef={searchInputRef}
              selectedSubject={selectedSubject}
              onSubjectChange={setSelectedSubject}
              selectedStatus={selectedStatus}
              onStatusChange={setSelectedStatus}
              selectedPriority={selectedPriority}
              onPriorityChange={setSelectedPriority}
              sortBy={sortBy}
              onSortChange={setSortBy}
              availableSubjects={availableSubjects}
              totalCount={totalCount}
              filteredCount={filteredCount}
              hasActiveFilters={hasActiveFilters}
              onResetFilters={resetFilters}
            />
          )}

          {/* Phase 7: Data Persistence, Export JSON/CSV, Import, and Reset */}
          <DataManagementBar
            assignments={assignments}
            onImportAssignments={importAssignments}
            onResetToDemo={resetAssignments}
          />

          {/* Part A/B/C View Switching */}
          {assignmentViewMode === 'list' && (
            <AssignmentList
              assignments={filteredAssignments}
              totalCount={totalCount}
              isFiltered={hasActiveFilters}
              onResetFilters={resetFilters}
              onAddNew={() => handleOpenAddModal()}
              onEdit={handleOpenEditModal}
              onDuplicate={duplicateAssignment}
              onDelete={handlePromptDelete}
              onCycleStatus={cycleStatus}
            />
          )}

          {assignmentViewMode === 'kanban' && (
            <KanbanBoard
              assignments={filteredAssignments}
              onEdit={handleOpenEditModal}
              onDelete={handlePromptDelete}
              onMoveStatus={setStatus}
              onAddNewWithStatus={(statusKey) => handleOpenAddModal({ status: statusKey })}
            />
          )}

          {assignmentViewMode === 'calendar' && (
            <CalendarView
              assignments={assignments}
              onSelectAssignment={handleOpenEditModal}
              onAddNewWithDate={(dateString) => handleOpenAddModal({ deadline: dateString })}
            />
          )}
        </div>
      )}

      {/* 3. Dedicated Calendar Tab from Sidebar (Phase 6 Part C) */}
      {currentNav === 'calendar' && (
        <div className="view-container">
          <CalendarView
            assignments={assignments}
            onSelectAssignment={handleOpenEditModal}
            onAddNewWithDate={(dateString) => handleOpenAddModal({ deadline: dateString })}
          />
        </div>
      )}

      {/* 4. Dedicated Analytics Tab from Sidebar (Phase 6 Part D) */}
      {currentNav === 'analytics' && (
        <div className="view-container">
          <AnalyticsView assignments={assignments} />
        </div>
      )}

      {/* 5. Dedicated Settings Tab from Sidebar (Final Architecture) */}
      {currentNav === 'settings' && (
        <div className="view-container">
          <SettingsView
            assignments={assignments}
            onImportAssignments={importAssignments}
            onResetToDemo={resetAssignments}
          />
        </div>
      )}

      {/* Add / Edit Assignment Modal */}
      <AssignmentModal
        isOpen={isAddEditModalOpen}
        onClose={() => setIsAddEditModalOpen(false)}
        initialData={editingAssignment}
        onSubmit={handleSaveAssignment}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setAssignmentToDelete(null);
        }}
        onConfirm={handleConfirmDelete}
        assignmentTitle={assignmentToDelete?.title}
      />
    </AppLayout>
  );
}
