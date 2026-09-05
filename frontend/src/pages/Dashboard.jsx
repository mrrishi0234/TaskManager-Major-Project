import React, { useState, useEffect, useCallback } from 'react';
import { api } from '../services/api';
import StatsCards from '../components/StatsCards';
import FilterBar from '../components/FilterBar';
import TaskCard from '../components/TaskCard';
import TaskModal from '../components/TaskModal';

const Dashboard = ({ showToast }) => {
  const [tasks, setTasks] = useState([]);
  const [stats, setStats] = useState({ total: 0, completed: 0, pending: 0, overdue: 0 });
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [sortBy, setSortBy] = useState('newest');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);

  const loadTasks = useCallback(async () => {
    try {
      setLoading(true);
      const res = await api.getTasks({ status, search, sortBy });
      if (res.success && res.data) setTasks(res.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
      showToast('Couldn’t load your tasks', 'error');
    } finally {
      setLoading(false);
    }
  }, [status, search, sortBy, showToast]);

  const loadStats = useCallback(async () => {
    try {
      const res = await api.getStats();
      if (res.success && res.data) setStats(res.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  }, []);

  useEffect(() => {
    const delayTimer = setTimeout(loadTasks, 250);
    return () => clearTimeout(delayTimer);
  }, [loadTasks]);

  useEffect(() => {
    loadStats();
  }, [loadStats]);

  const handleOpenCreateModal = () => {
    setEditingTask(null);
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleSaveTask = async (taskData) => {
    try {
      if (editingTask) {
        await api.updateTask(editingTask._id, taskData);
        showToast('Task updated', 'success');
      } else {
        await api.createTask(taskData);
        showToast('Task added to your list', 'success');
      }
      setIsModalOpen(false);
      setEditingTask(null);
      loadTasks();
      loadStats();
    } catch (error) {
      showToast(error.message || 'Couldn’t save task', 'error');
    }
  };

  const handleToggleCompletion = async (task) => {
    try {
      const newStatus = !task.completed;
      await api.updateTask(task._id, { completed: newStatus });
      setTasks((prev) => prev.map((t) => (t._id === task._id ? { ...t, completed: newStatus } : t)));
      loadStats();
      showToast(newStatus ? 'Nice. One less thing to worry about.' : 'Task moved back to open', 'info');
    } catch (error) {
      showToast('Couldn’t update task status', 'error');
      loadTasks();
    }
  };

  const handleDeleteTask = async (id) => {
    if (!window.confirm('Delete this task? This cannot be undone.')) return;
    try {
      await api.deleteTask(id);
      showToast('Task removed', 'info');
      setTasks((prev) => prev.filter((t) => t._id !== id));
      loadStats();
    } catch (error) {
      showToast('Couldn’t delete task', 'error');
    }
  };

  const handleClearCompleted = async () => {
    if (!window.confirm('Delete all completed tasks? This cannot be undone.')) return;
    try {
      const res = await api.deleteCompletedTasks();
      showToast(res.message || 'Completed tasks cleared', 'info');
      loadTasks();
      loadStats();
    } catch (error) {
      showToast('Couldn’t clear completed tasks', 'error');
    }
  };

  const emptyFiltered = search || status !== 'all';

  return (
    <div className="dashboard-shell fade-in">
      <div className="container">
        <section className="dashboard-intro">
          <div>
            <p className="eyebrow">Personal command center</p>
            <h1>Make room for <em>what matters.</em></h1>
            <p className="intro-copy">A quieter place to capture the things you need to do — and actually get them done.</p>
          </div>
          <div className="today-note">
            <span className="today-dot"></span>
            <div><strong>Today</strong><small>Keep the list honest.</small></div>
          </div>
        </section>

        <StatsCards stats={stats} />
        <FilterBar
          search={search}
          setSearch={setSearch}
          status={status}
          setStatus={setStatus}
          sortBy={sortBy}
          setSortBy={setSortBy}
          onOpenCreateModal={handleOpenCreateModal}
          onClearCompleted={handleClearCompleted}
          completedCount={stats.completed}
        />

        <section className="task-list-section">
          <div className="list-header">
            <span>{loading ? 'Updating list' : `${tasks.length} ${tasks.length === 1 ? 'task' : 'tasks'}`}</span>
            {!loading && status !== 'all' && <span className="list-context">filtered view</span>}
          </div>

          {loading ? (
            <div className="loading-panel"><div className="spinner"></div><span>Bringing your list up to date…</span></div>
          ) : tasks.length === 0 ? (
            <div className="empty-state">
              <div className="empty-doodle" aria-hidden="true"><span className="empty-mark" aria-hidden="true"></span></div>
              <h3>{emptyFiltered ? 'Nothing matches that.' : 'Your list is beautifully empty.'}</h3>
              <p>{emptyFiltered ? 'Try another search or switch the filter.' : 'Add one small thing. Momentum usually follows.'}</p>
              {!emptyFiltered && <button onClick={handleOpenCreateModal} className="btn btn-primary">Create your first task</button>}
            </div>
          ) : (
            <div className="tasks-container">
              {tasks.map((task) => (
                <TaskCard key={task._id} task={task} onToggleCompletion={handleToggleCompletion} onEdit={handleOpenEditModal} onDelete={handleDeleteTask} />
              ))}
            </div>
          )}
        </section>
      </div>

      <TaskModal
        isOpen={isModalOpen}
        onClose={() => { setIsModalOpen(false); setEditingTask(null); }}
        onSubmit={handleSaveTask}
        initialData={editingTask}
      />
    </div>
  );
};

export default Dashboard;
