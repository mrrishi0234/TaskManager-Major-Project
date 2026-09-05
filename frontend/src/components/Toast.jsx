import React from 'react';

const Toast = ({ toasts, removeToast }) => {
  if (!toasts || toasts.length === 0) return null;

  return (
    <div className="toast-container">
      {toasts.map((toast) => (
        <div key={toast.id} className={`toast toast-${toast.type || 'info'}`}>
          <span>{toast.message}</span>
          <button
            onClick={() => removeToast(toast.id)}
            style={{
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              marginLeft: '12px',
              fontWeight: 'bold',
              color: 'inherit',
              padding: '0 4px'
            }}
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
};

export default Toast;
