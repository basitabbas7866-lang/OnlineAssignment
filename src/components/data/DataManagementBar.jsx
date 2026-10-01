import { useState, useRef } from 'react';
import { Upload, FileJson, FileSpreadsheet, RotateCcw, CheckCircle, AlertCircle } from 'lucide-react';
import { Button } from '../ui';
import {
  exportToJSON,
  exportToCSV,
  validateImportedAssignments,
} from '../../utils/exportImportUtils.js';
import { ResetConfirmModal } from './ResetConfirmModal';
import './DataManagementBar.css';

export function DataManagementBar({
  assignments = [],
  onImportAssignments,
  onResetToDemo,
  className = '',
}) {
  const [feedback, setFeedback] = useState(null); // { type: 'success' | 'error', message: string }
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const fileInputRef = useRef(null);

  const showFeedback = (type, message) => {
    setFeedback({ type, message });
    setTimeout(() => {
      setFeedback(null);
    }, 4500);
  };

  const handleExportJSON = () => {
    try {
      exportToJSON(assignments, 'student-assignments.json');
      showFeedback('success', 'Successfully downloaded student-assignments.json');
    } catch {
      showFeedback('error', 'Failed to export JSON file.');
    }
  };

  const handleExportCSV = () => {
    try {
      exportToCSV(assignments, 'student-assignments.csv');
      showFeedback('success', 'Successfully downloaded student-assignments.csv');
    } catch {
      showFeedback('error', 'Failed to export CSV file.');
    }
  };

  const handleTriggerFileInput = () => {
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const text = event.target?.result;
        const parsed = JSON.parse(text);

        const validation = validateImportedAssignments(parsed);

        if (!validation.isValid) {
          showFeedback('error', validation.error || 'Import validation failed.');
          return;
        }

        onImportAssignments(validation.sanitizedData);
        showFeedback(
          'success',
          `Imported ${validation.sanitizedData.length} assignments successfully!`
        );
      } catch {
        showFeedback('error', 'Invalid JSON syntax. Please verify the file contents.');
      }
    };

    reader.onerror = () => {
      showFeedback('error', 'Failed to read the selected file.');
    };

    reader.readAsText(file);
  };

  return (
    <div className={`data-management-bar ${className}`}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        accept=".json,application/json"
        style={{ display: 'none' }}
        onChange={handleFileChange}
      />

      <div className="data-bar-left">
        <span className="data-bar-title">Data Backup & Persistence:</span>
        <span className="data-bar-autosave-tag">
          <span className="autosave-dot" /> Auto-saved to LocalStorage
        </span>
      </div>

      <div className="data-bar-buttons">
        {/* Export JSON */}
        <Button
          variant="outline"
          size="sm"
          icon={FileJson}
          onClick={handleExportJSON}
          title="Download all assignments as student-assignments.json"
        >
          Export JSON
        </Button>

        {/* Export CSV */}
        <Button
          variant="outline"
          size="sm"
          icon={FileSpreadsheet}
          onClick={handleExportCSV}
          title="Download all assignments as student-assignments.csv"
        >
          Export CSV
        </Button>

        {/* Import JSON */}
        <Button
          variant="secondary"
          size="sm"
          icon={Upload}
          onClick={handleTriggerFileInput}
          title="Import JSON array of assignments with validation"
        >
          Import Data
        </Button>

        {/* Reset */}
        <Button
          variant="ghost"
          size="sm"
          icon={RotateCcw}
          onClick={() => setIsResetModalOpen(true)}
          title="Reset to default academic course deliverables"
        >
          Reset Demo Data
        </Button>
      </div>

      {/* Dynamic Feedback Banner */}
      {feedback && (
        <div className={`data-feedback-pill feedback-${feedback.type}`}>
          {feedback.type === 'success' ? (
            <CheckCircle size={14} />
          ) : (
            <AlertCircle size={14} />
          )}
          <span>{feedback.message}</span>
        </div>
      )}

      {/* Reset Confirmation Modal */}
      <ResetConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={() => {
          onResetToDemo();
          showFeedback('success', 'Reset workspace back to original demo assignments.');
        }}
      />
    </div>
  );
}
