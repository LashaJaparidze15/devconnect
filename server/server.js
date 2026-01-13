const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const { Server } = require('socket.io');
require('dotenv').config();

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: ['http://localhost:5173', 'https://devconnect.vercel.app'],
    methods: ['GET', 'POST']
  }
});

// Middleware
app.use(cors({
  origin: [
    'http://localhost:5173',
    'devconnect-ashen.vercel.app'
  ],
  credentials: true
}));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('MongoDB connected successfully!'))
  .catch((err) => console.error('MongoDB connection error:', err));

// Socket.io connection
const users = new Map(); // Store connected users

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  // Register user
  socket.on('register', (userId) => {
    users.set(userId, socket.id);
    console.log(`User ${userId} registered with socket ${socket.id}`);
  });

  // Send message
  socket.on('sendMessage', (data) => {
    const { recipientId, message } = data;
    const recipientSocketId = users.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('receiveMessage', message);
    }
  });

  // Typing indicator
  socket.on('typing', (data) => {
    const { recipientId, isTyping } = data;
    const recipientSocketId = users.get(recipientId);
    
    if (recipientSocketId) {
      io.to(recipientSocketId).emit('userTyping', { 
        userId: data.senderId, 
        isTyping 
      });
    }
  });

  // Disconnect
  socket.on('disconnect', () => {
    // Remove user from map
    for (let [userId, socketId] of users.entries()) {
      if (socketId === socket.id) {
        users.delete(userId);
        console.log(`User ${userId} disconnected`);
        break;
      }
    }
  });
});

// Routes
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/profile', require('./routes/profileRoutes'));
app.use('/api/projects', require('./routes/projectRoutes'));
app.use('/api/users', require('./routes/userRoutes'));
app.use('/api/messages', require('./routes/messageRoutes'));

// Test route
app.get('/', (req, res) => {
  res.json({ message: 'DevConnect API is running!' });
});

const PORT = process.env.PORT || 5000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
