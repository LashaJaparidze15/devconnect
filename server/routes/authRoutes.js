const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// Public routes
router.post('/register', authController.register);
router.post('/login', authController.login);

// GitHub OAuth
router.get('/github/callback', authController.githubCallback);
router.get('/github/repos/:username', authController.getGithubRepos);

// Protected route (requires authentication)
router.get('/me', authMiddleware, authController.getCurrentUser);

module.exports = router;