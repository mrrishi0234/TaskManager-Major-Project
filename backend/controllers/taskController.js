const Task = require('../models/Task');

// @desc    Get all tasks for logged in user with search, filter, and sort
// @route   GET /api/tasks
// @access  Private
const getTasks = async (req, res, next) => {
  try {
    const { status, search, sortBy } = req.query;

    // Base query: only tasks belonging to the authenticated user
    const query = { user: req.user._id };

    // Filter by status: 'completed' | 'pending' | 'all'
    if (status === 'completed') {
      query.completed = true;
    } else if (status === 'pending') {
      query.completed = false;
    }

    // Search by title or description
    if (search && search.trim() !== '') {
      query.$or = [
        { title: { $regex: search.trim(), $options: 'i' } },
        { description: { $regex: search.trim(), $options: 'i' } }
      ];
    }

    // Sort order definition
    let sortOptions = { createdAt: -1 }; // default: newest first

    if (sortBy === 'oldest') {
      sortOptions = { createdAt: 1 };
    } else if (sortBy === 'dueDate') {
      // Tasks with due dates first, nulls last
      sortOptions = { dueDate: 1, createdAt: -1 };
    } else if (sortBy === 'priority') {
      // In mongo, we can sort or we can map; let's sort by priority string or fetch and sort
      // To ensure 'High' > 'Medium' > 'Low', we can sort directly or handle it
      sortOptions = { priority: 1, createdAt: -1 };
    }

    let tasks = await Task.find(query).sort(sortOptions);

    // If sorting by priority, apply custom priority ranking (High > Medium > Low)
    if (sortBy === 'priority') {
      const priorityWeight = { High: 1, Medium: 2, Low: 3 };
      tasks = tasks.sort(
        (a, b) => (priorityWeight[a.priority] || 4) - (priorityWeight[b.priority] || 4)
      );
    }

    res.status(200).json({
      success: true,
      count: tasks.length,
      data: tasks
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get single task by ID
// @route   GET /api/tasks/:id
// @access  Private
const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Authorization check: only owner can access
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to view this task'
      });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Create a new task
// @route   POST /api/tasks
// @access  Private
const createTask = async (req, res, next) => {
  try {
    const { title, description, priority, dueDate, completed } = req.body;

    if (!title || title.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Title is required'
      });
    }

    const task = await Task.create({
      user: req.user._id,
      title: title.trim(),
      description: description ? description.trim() : '',
      priority: priority || 'Medium',
      dueDate: dueDate ? new Date(dueDate) : null,
      completed: Boolean(completed)
    });

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      data: task
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Update a task
// @route   PUT /api/tasks/:id
// @access  Private
const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Authorization check: only owner can update
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to update this task'
      });
    }

    const { title, description, priority, dueDate, completed } = req.body;

    if (title !== undefined) task.title = title.trim();
    if (description !== undefined) task.description = description.trim();
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate ? new Date(dueDate) : null;
    if (completed !== undefined) task.completed = Boolean(completed);

    const updatedTask = await task.save();

    res.status(200).json({
      success: true,
      message: 'Task updated successfully',
      data: updatedTask
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete a single task
// @route   DELETE /api/tasks/:id
// @access  Private
const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Authorization check: only owner can delete
    if (task.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Not authorized to delete this task'
      });
    }

    await task.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Task deleted successfully',
      data: { id: req.params.id }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Delete all completed tasks
// @route   DELETE /api/tasks/completed/all
// @access  Private
const deleteCompletedTasks = async (req, res, next) => {
  try {
    const result = await Task.deleteMany({
      user: req.user._id,
      completed: true
    });

    res.status(200).json({
      success: true,
      message: `Deleted ${result.deletedCount} completed tasks`,
      data: { deletedCount: result.deletedCount }
    });
  } catch (error) {
    next(error);
  }
};

// @desc    Get task statistics for dashboard
// @route   GET /api/tasks/stats
// @access  Private
const getTaskStats = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const now = new Date();

    const allTasks = await Task.find({ user: userId });

    const total = allTasks.length;
    let completed = 0;
    let pending = 0;
    let overdue = 0;

    allTasks.forEach((task) => {
      if (task.completed) {
        completed++;
      } else {
        pending++;
        if (task.dueDate && new Date(task.dueDate) < now) {
          overdue++;
        }
      }
    });

    res.status(200).json({
      success: true,
      data: {
        total,
        completed,
        pending,
        overdue
      }
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
  getTaskStats
};
