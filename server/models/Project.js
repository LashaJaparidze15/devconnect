const mongoose = require('mongoose');

const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  techStack: [{
    type: String,
    trim: true
  }],
  githubLink: {
    type: String,
    trim: true
  },
  liveLink: {
    type: String,
    trim: true
  },
  lookingForCollaborators: {
    type: Boolean,
    default: false
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  collaborators: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  image: {
    type: String,
    default: 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?w=600&h=400&fit=crop'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('Project', projectSchema);