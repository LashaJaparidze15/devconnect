const express = require('express');
const router = express.Router();
const projectController = require('../controllers/projectController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.get('/', projectController.getAllProjects);
router.get('/:projectId', projectController.getProject);
router.get('/user/:userId', projectController.getUserProjects);

// Protected routes
router.post('/create', authMiddleware, projectController.createProject);
router.put('/:projectId', authMiddleware, projectController.updateProject);
router.delete('/:projectId', authMiddleware, projectController.deleteProject);

module.exports = router;