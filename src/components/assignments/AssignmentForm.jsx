import { useState } from 'react';
import { Calendar, Clock } from 'lucide-react';
import { Button, Input, Select } from '../ui';
import './AssignmentForm.css';

const COMMON_SUBJECTS = [
  'DBMS',
  'Computer Networks',
  'Java',
  'AI',
  'Operating Systems',
  'Software Engineering',
  'Algorithms',
  'Web Development',
];

const PRIORITY_OPTIONS = [
  { value: 'low', label: '🟢 Low Priority' },
  { value: 'medium', label: '🟡 Medium Priority' },
  { value: 'high', label: '🔴 High Priority' },
];

const STATUS_OPTIONS = [
  { value: 'pending', label: '⏳ Pending' },
  { value: 'in_progress', label: '⚡ In Progress' },
  { value: 'completed', label: '✅ Completed' },
];

export function AssignmentForm({
  initialData = null,
  onSubmit,
  onCancel,
  isSubmitting = false,
}) {
  const isCommon = initialData ? COMMON_SUBJECTS.includes(initialData.subject) : true;

  const [title, setTitle] = useState(() => initialData?.title || '');
  const [subject, setSubject] = useState(() => {
    if (!initialData) return 'DBMS';
    return isCommon ? initialData.subject : 'other';
  });
  const [customSubject, setCustomSubject] = useState(() => {
    if (!initialData) return '';
    return isCommon ? '' : (initialData.subject || '');
  });
  const [description, setDescription] = useState(() => initialData?.description || '');
  const [deadline, setDeadline] = useState(() => {
    if (initialData?.deadline) return initialData.deadline;
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 2);
    const y = targetDate.getFullYear();
    const m = String(targetDate.getMonth() + 1).padStart(2, '0');
    const d = String(targetDate.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  });
  const [priority, setPriority] = useState(() => initialData?.priority || 'medium');
  const [status, setStatus] = useState(() => initialData?.status || 'pending');
  const [estimatedHours, setEstimatedHours] = useState(() => initialData?.estimatedHours ?? 3);
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    if (!title.trim()) {
      newErrors.title = 'Assignment title is required';
    }
    if (subject === 'other' && !customSubject.trim()) {
      newErrors.customSubject = 'Please enter a subject name';
    }
    if (!deadline) {
      newErrors.deadline = 'Please choose a deadline date';
    }
    if (estimatedHours < 0 || isNaN(estimatedHours)) {
      newErrors.estimatedHours = 'Please provide a valid hour estimate';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    const finalSubject = subject === 'other' ? customSubject.trim() : subject;

    const payload = {
      ...(initialData?.id ? { id: initialData.id } : {}),
      title: title.trim(),
      subject: finalSubject,
      description: description.trim(),
      deadline,
      priority,
      status,
      estimatedHours: Number(estimatedHours) || 1,
    };

    onSubmit(payload);
  };

  return (
    <form className="assignment-form" onSubmit={handleSubmit} noValidate>
      {/* Title */}
      <Input
        label="Assignment Title *"
        placeholder="e.g. SQL Lab 3 - Joins & Indexing"
        value={title}
        onChange={(e) => {
          setTitle(e.target.value);
          if (errors.title) setErrors((prev) => ({ ...prev, title: null }));
        }}
        error={errors.title}
        autoFocus
      />

      {/* Subject Selection */}
      <div className="form-row-two-col">
        <Select
          label="Subject *"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
        >
          {COMMON_SUBJECTS.map((sub) => (
            <option key={sub} value={sub}>
              {sub}
            </option>
          ))}
          <option value="other">+ Other (Custom Subject)</option>
        </Select>

        {subject === 'other' && (
          <Input
            label="Custom Subject Name *"
            placeholder="e.g. Computer Graphics"
            value={customSubject}
            onChange={(e) => {
              setCustomSubject(e.target.value);
              if (errors.customSubject) setErrors((prev) => ({ ...prev, customSubject: null }));
            }}
            error={errors.customSubject}
          />
        )}
      </div>

      {/* Deadline and Estimated Hours */}
      <div className="form-row-two-col">
        <Input
          type="date"
          label="Deadline Date *"
          icon={Calendar}
          value={deadline}
          onChange={(e) => {
            setDeadline(e.target.value);
            if (errors.deadline) setErrors((prev) => ({ ...prev, deadline: null }));
          }}
          error={errors.deadline}
        />

        <Input
          type="number"
          step="0.5"
          min="0.5"
          max="100"
          label="Estimated Hours"
          icon={Clock}
          value={estimatedHours}
          onChange={(e) => setEstimatedHours(e.target.value)}
          error={errors.estimatedHours}
        />
      </div>

      {/* Priority and Status */}
      <div className="form-row-two-col">
        <Select
          label="Priority"
          options={PRIORITY_OPTIONS}
          value={priority}
          onChange={(e) => setPriority(e.target.value)}
        />

        <Select
          label="Status"
          options={STATUS_OPTIONS}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        />
      </div>

      {/* Description / Instructions */}
      <div className="form-textarea-group">
        <label htmlFor="assignment-desc" className="form-textarea-label">
          Description / Instructions
        </label>
        <textarea
          id="assignment-desc"
          className="form-textarea"
          rows={3}
          placeholder="Add assignment details, submission requirements, or rubric notes..."
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
      </div>

      {/* Form Action Buttons */}
      <div className="form-actions">
        <Button
          type="button"
          variant="ghost"
          onClick={onCancel}
          disabled={isSubmitting}
        >
          Cancel
        </Button>
        <Button
          type="submit"
          variant="primary"
          disabled={isSubmitting}
        >
          {initialData ? 'Save Changes' : 'Create Assignment'}
        </Button>
      </div>
    </form>
  );
}
