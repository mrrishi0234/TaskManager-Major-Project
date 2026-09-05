import React, { useState, useEffect } from 'react';

const TaskModal = ({ isOpen, onClose, onSubmit, initialData }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [dueDate, setDueDate] = useState('');
  const [completed, setCompleted] = useState(false);
  const [error, setError] = useState('');
  const isEditing = Boolean(initialData && initialData._id);

  useEffect(() => {
    if (initialData) {
      setTitle(initialData.title || '');
      setDescription(initialData.description || '');
      setPriority(initialData.priority || 'Medium');
      setDueDate(initialData.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '');
      setCompleted(Boolean(initialData.completed));
    } else {
      setTitle(''); setDescription(''); setPriority('Medium'); setDueDate(''); setCompleted(false);
    }
    setError('');
  }, [initialData, isOpen]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) { setError('Give this task a title first.'); return; }
    onSubmit({ title: title.trim(), description: description.trim(), priority, dueDate: dueDate || null, completed });
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="eyebrow">{isEditing ? 'Refine it' : 'Put it somewhere safe'}</span>
            <h3 className="modal-title">{isEditing ? 'Edit task' : 'New task'}</h3>
          </div>
          <button className="modal-close-btn" onClick={onClose} type="button" aria-label="Close">×</button>
        </div>

        <form onSubmit={handleSubmit}>
          {error && <div className="alert-error">{error}</div>}

          <div className="form-group">
            <label htmlFor="task-title">What needs doing?</label>
            <input id="task-title" type="text" placeholder="e.g. Finish DBMS lab assignment" value={title} onChange={(e) => { setTitle(e.target.value); if (error) setError(''); }} autoFocus />
          </div>

          <div className="form-group">
            <label htmlFor="task-description">A little context <span>(optional)</span></label>
            <textarea id="task-description" rows="4" placeholder="Anything future-you will be glad to remember…" value={description} onChange={(e) => setDescription(e.target.value)} />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label htmlFor="task-priority">Priority</label>
              <select id="task-priority" value={priority} onChange={(e) => setPriority(e.target.value)}>
                <option value="Low">Low</option><option value="Medium">Medium</option><option value="High">High</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="task-duedate">Due date</label>
              <input id="task-duedate" type="date" value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
            </div>
          </div>

          {isEditing && (
            <label className="completion-toggle">
              <input id="task-completed-checkbox" type="checkbox" checked={completed} onChange={(e) => setCompleted(e.target.checked)} />
              <span>{completed ? 'This one is done.' : 'Mark as completed'}</span>
            </label>
          )}

          <div className="modal-actions">
            <button type="button" onClick={onClose} className="btn btn-secondary">Cancel</button>
            <button type="submit" className="btn btn-primary">{isEditing ? 'Save task' : 'Add task'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default TaskModal;
