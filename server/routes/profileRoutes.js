const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const authMiddleware = require('../middleware/authMiddleware');

// Protected routes
router.get('/:userId', profileController.getProfile);
router.put('/update', authMiddleware, profileController.updateProfile);

module.exports = router;