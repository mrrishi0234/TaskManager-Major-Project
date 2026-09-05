const express = require('express');
const router = express.Router();
const {
  getTasks,
  getTaskById,
  createTask,
  updateTask,
  deleteTask,
  deleteCompletedTasks,
  getTaskStats
} = require('../controllers/taskController');
const { protect } = require('../middleware/authMiddleware');

// All task routes require authentication
router.use(protect);

// Specific routes before param :id routes
router.get('/stats', getTaskStats);
router.delete('/completed/all', deleteCompletedTasks);

// Root task routes
router.route('/')
  .get(getTasks)
  .post(createTask);

// By ID routes
router.route('/:id')
  .get(getTaskById)
  .put(updateTask)
  .delete(deleteTask);

module.exports = router;
