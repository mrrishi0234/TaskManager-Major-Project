import React from 'react';

const statsMeta = [
  { key: 'total', label: 'All tasks', icon: 'A', note: 'everything on your plate' },
  { key: 'completed', label: 'Finished', icon: 'F', note: 'nice work' },
  { key: 'pending', label: 'In progress', icon: 'O', note: 'still on your radar' },
  { key: 'overdue', label: 'Overdue', icon: 'A', note: 'needs attention' }
];

const StatsCards = ({ stats }) => {
  const values = stats || {};

  return (
    <section className="stats-grid" aria-label="Task overview">
      {statsMeta.map(({ key, label, icon, note }) => (
        <article key={key} className={`stat-card ${key}`}>
          <div className="stat-topline">
            <span className="stat-icon">{icon}</span>
            <span className="stat-label">{label}</span>
          </div>
          <div className="stat-value">{values[key] || 0}</div>
          <div className="stat-note">{note}</div>
        </article>
      ))}
    </section>
  );
};

export default StatsCards;
