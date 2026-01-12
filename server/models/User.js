const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  password: {
    type: String,
    required: true,
    minlength: 6
  },
  bio: {
    type: String,
    maxlength: 500,
    default: ''
  },
  skills: [{
    type: String,
    trim: true
  }],
  githubUsername: {
    type: String,
    default: ''
  },
  lookingFor: {
    type: String,
    enum: ['collaborators', 'mentors', 'projects', 'none'],
    default: 'none'
  },
  avatar: {
    type: String,
    default: 'https://ui-avatars.com/api/?name=User&background=3b82f6&color=fff&size=200'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);