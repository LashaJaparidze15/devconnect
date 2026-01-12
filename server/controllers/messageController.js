const Message = require('../models/Message');
const User = require('../models/User');

// Get conversations (list of users you've chatted with)
exports.getConversations = async (req, res) => {
  try {
    const userId = req.userId;

    // Get all messages where user is sender or recipient
    const messages = await Message.find({
      $or: [{ sender: userId }, { recipient: userId }]
    })
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar')
      .sort({ createdAt: -1 });

    // Extract unique conversation partners
    const conversationMap = new Map();
    
    messages.forEach(msg => {
      const partnerId = msg.sender._id.toString() === userId ? msg.recipient._id.toString() : msg.sender._id.toString();
      const partner = msg.sender._id.toString() === userId ? msg.recipient : msg.sender;
      
      if (!conversationMap.has(partnerId)) {
        conversationMap.set(partnerId, {
          user: partner,
          lastMessage: msg.content,
          lastMessageTime: msg.createdAt,
          unreadCount: 0
        });
      }
    });

    // Count unread messages for each conversation
    for (let [partnerId, conversation] of conversationMap) {
      const unreadCount = await Message.countDocuments({
        sender: partnerId,
        recipient: userId,
        read: false
      });
      conversation.unreadCount = unreadCount;
    }

    const conversations = Array.from(conversationMap.values());
    conversations.sort((a, b) => b.lastMessageTime - a.lastMessageTime);

    res.json(conversations);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get messages with a specific user
exports.getMessages = async (req, res) => {
  try {
    const userId = req.userId;
    const { otherUserId } = req.params;

    const messages = await Message.find({
      $or: [
        { sender: userId, recipient: otherUserId },
        { sender: otherUserId, recipient: userId }
      ]
    })
      .populate('sender', 'username avatar')
      .populate('recipient', 'username avatar')
      .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { sender: otherUserId, recipient: userId, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send a message
exports.sendMessage = async (req, res) => {
  try {
    const { recipientId, content } = req.body;
    const senderId = req.userId;

    // Check if recipient exists
    const recipient = await User.findById(recipientId);
    if (!recipient) {
      return res.status(404).json({ message: 'Recipient not found' });
    }

    const message = new Message({
      sender: senderId,
      recipient: recipientId,
      content
    });

    await message.save();
    await message.populate('sender', 'username avatar');
    await message.populate('recipient', 'username avatar');

    res.status(201).json(message);
  } catch (error) {
    console.error('Send message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a message
exports.deleteMessage = async (req, res) => {
  try {
    const { messageId } = req.params;
    const userId = req.userId;

    const message = await Message.findById(messageId);

    if (!message) {
      return res.status(404).json({ message: 'Message not found' });
    }

    // Only sender can delete their message
    if (message.sender.toString() !== userId) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await Message.findByIdAndDelete(messageId);

    res.json({ message: 'Message deleted' });
  } catch (error) {
    console.error('Delete message error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};