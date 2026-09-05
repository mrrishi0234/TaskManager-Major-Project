import React from 'react';

const TaskCard = ({ task, onToggleCompletion, onEdit, onDelete }) => {
  const isOverdue =
    !task.completed &&
    task.dueDate &&
    new Date(task.dueDate).setHours(0, 0, 0, 0) < new Date().setHours(0, 0, 0, 0);

  const formatDate = (dateString) => {
    if (!dateString) return null;
    return new Date(dateString).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  const priorityClass = {
    High: 'badge-high',
    Medium: 'badge-medium',
    Low: 'badge-low'
  }[task.priority] || 'badge-medium';

  return (
    <article className={`task-card ${task.completed ? 'is-completed' : ''} priority-${String(task.priority || 'medium').toLowerCase()}`}>
      <div className="task-accent" aria-hidden="true"></div>
      <div className="task-left">
        <button
          type="button"
          className={`task-checkbox ${task.completed ? 'checked' : ''}`}
          onClick={() => onToggleCompletion(task)}
          aria-label={task.completed ? 'Mark task as pending' : 'Mark task as completed'}
          title={task.completed ? 'Mark as pending' : 'Mark as complete'}
        >
          {task.completed ? <span className="check-mark" aria-hidden="true"></span> : ''}
        </button>

        <div className="task-details">
          <div className="task-title-row">
            <h3 className={`task-title ${task.completed ? 'completed-text' : ''}`}>{task.title}</h3>
            <span className={`badge ${priorityClass}`}>{task.priority}</span>
          </div>

          {task.description && <p className="task-desc">{task.description}</p>}

          <div className="task-meta">
            {task.dueDate && (
              <span className={isOverdue ? 'meta-due overdue-text' : 'meta-due'}>
                <span className="meta-label">{isOverdue ? 'Overdue' : 'Due'}</span> {formatDate(task.dueDate)}
              </span>
            )}
            {task.completed && <span className="status-closed">Closed</span>}
            {isOverdue && <span className="badge badge-overdue">Needs attention</span>}
          </div>
        </div>
      </div>

      <div className="task-actions">
        <button onClick={() => onEdit(task)} className="icon-btn" title="Edit this task" aria-label="Edit task"><span className="edit-glyph" aria-hidden="true"></span></button>
        <button onClick={() => onDelete(task._id)} className="icon-btn danger" title="Delete this task" aria-label="Delete task"><span className="delete-glyph" aria-hidden="true"></span></button>
      </div>
    </article>
  );
};

export default TaskCard;
