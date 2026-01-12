const express = require('express');
const router = express.Router();
const messageController = require('../controllers/messageController');
const authMiddleware = require('../middleware/authMiddleware');

// All routes are protected
router.get('/conversations', authMiddleware, messageController.getConversations);
router.get('/:otherUserId', authMiddleware, messageController.getMessages);
router.post('/send', authMiddleware, messageController.sendMessage);
router.delete('/:messageId', authMiddleware, messageController.deleteMessage);

module.exports = router;