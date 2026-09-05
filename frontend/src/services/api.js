// Centralized API client for communicating with backend

// const API_BASE = '/api';
const API_BASE = import.meta.env.VITE_API_URL || '/api';

// Helper function to build headers
const getHeaders = () => {
  const token = localStorage.getItem('token');
  const headers = {
    'Content-Type': 'application/json'
  };
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }
  return headers;
};

// Generic request wrapper
const request = async (endpoint, options = {}) => {
  const url = `${API_BASE}${endpoint}`;
  const response = await fetch(url, {
    ...options,
    headers: {
      ...getHeaders(),
      ...(options.headers || {})
    }
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || 'Something went wrong with the request');
  }

  return data;
};

export const api = {
  // Authentication
  register: (userData) =>
    request('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData)
    }),

  login: (credentials) =>
    request('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials)
    }),

  getProfile: () => request('/auth/me'),

  // Tasks CRUD
  getTasks: (params = {}) => {
    const query = new URLSearchParams();
    if (params.status && params.status !== 'all') query.append('status', params.status);
    if (params.search && params.search.trim()) query.append('search', params.search.trim());
    if (params.sortBy) query.append('sortBy', params.sortBy);

    const qs = query.toString() ? `?${query.toString()}` : '';
    return request(`/tasks${qs}`);
  },

  getTaskById: (id) => request(`/tasks/${id}`),

  createTask: (taskData) =>
    request('/tasks', {
      method: 'POST',
      body: JSON.stringify(taskData)
    }),

  updateTask: (id, taskData) =>
    request(`/tasks/${id}`, {
      method: 'PUT',
      body: JSON.stringify(taskData)
    }),

  deleteTask: (id) =>
    request(`/tasks/${id}`, {
      method: 'DELETE'
    }),

  deleteCompletedTasks: () =>
    request('/tasks/completed/all', {
      method: 'DELETE'
    }),

  // Dashboard Stats
  getStats: () => request('/tasks/stats')
};
