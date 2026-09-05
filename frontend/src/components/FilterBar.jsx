import React from 'react';

const FilterBar = ({
  search,
  setSearch,
  status,
  setStatus,
  sortBy,
  setSortBy,
  onOpenCreateModal,
  onClearCompleted,
  completedCount
}) => {
  return (
    <section className="toolbar">
      <div className="toolbar-heading">
        <div>
          <span className="eyebrow">Workspace</span>
          <h2>Your tasks</h2>
        </div>
        <button onClick={onOpenCreateModal} className="btn btn-primary add-task-btn">
          <span className="plus-icon">+</span>
          New task
        </button>
      </div>

      <div className="toolbar-controls">
        <div className="search-input-wrapper">
          <span className="search-icon" aria-hidden="true"></span>
          <input
            type="text"
            aria-label="Search tasks"
            placeholder="Search your tasks..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && <button className="clear-search" onClick={() => setSearch('')} aria-label="Clear search">×</button>}
        </div>

        <div className="filter-group" aria-label="Filter tasks">
          {[
            ['all', 'Everything'],
            ['pending', 'Open'],
            ['completed', 'Done']
          ].map(([value, label]) => (
            <button
              key={value}
              type="button"
              className={`filter-btn ${status === value ? 'active' : ''}`}
              onClick={() => setStatus(value)}
            >
              {label}
            </button>
          ))}
        </div>

        <div className="toolbar-right">
          <label htmlFor="sort-by">Sort</label>
          <select id="sort-by" className="sort-select" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
            <option value="newest">Newest</option>
            <option value="oldest">Oldest</option>
            <option value="priority">Priority</option>
            <option value="dueDate">Due date</option>
          </select>
          {completedCount > 0 && (
            <button onClick={onClearCompleted} className="clear-completed" title="Delete all finished tasks">
              Clear finished ({completedCount})
            </button>
          )}
        </div>
      </div>
    </section>
  );
};

export default FilterBar;
