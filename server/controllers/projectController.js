const Project = require('../models/Project');
const User = require('../models/User');

// Create new project
exports.createProject = async (req, res) => {
  try {
    const { title, description, techStack, githubLink, liveLink, lookingForCollaborators, image } = req.body;

    const project = new Project({
      title,
      description,
      techStack,
      githubLink,
      liveLink,
      lookingForCollaborators,
      image,
      owner: req.userId
    });

    await project.save();

    res.status(201).json({
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Create project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all projects
exports.getAllProjects = async (req, res) => {
  try {
    const projects = await Project.find()
      .populate('owner', 'username avatar githubUsername')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get user's projects
exports.getUserProjects = async (req, res) => {
  try {
    const projects = await Project.find({ owner: req.params.userId })
      .populate('owner', 'username avatar')
      .sort({ createdAt: -1 });
    res.json(projects);
  } catch (error) {
    console.error('Get user projects error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get single project
exports.getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId)
      .populate('owner', 'username email avatar githubUsername')
      .populate('collaborators', 'username avatar');

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.json(project);
  } catch (error) {
    console.error('Get project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update project
exports.updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the owner
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to update this project' });
    }

    const { title, description, techStack, githubLink, liveLink, lookingForCollaborators, image } = req.body;

    project.title = title || project.title;
    project.description = description || project.description;
    project.techStack = techStack || project.techStack;
    project.githubLink = githubLink !== undefined ? githubLink : project.githubLink;
    project.liveLink = liveLink !== undefined ? liveLink : project.liveLink;
    project.lookingForCollaborators = lookingForCollaborators !== undefined ? lookingForCollaborators : project.lookingForCollaborators;
    project.image = image || project.image;

    await project.save();

    res.json({
      message: 'Project updated successfully',
      project
    });
  } catch (error) {
    console.error('Update project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete project
exports.deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.projectId);

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // Check if user is the owner
    if (project.owner.toString() !== req.userId) {
      return res.status(403).json({ message: 'Not authorized to delete this project' });
    }

    await Project.findByIdAndDelete(req.params.projectId);

    res.json({ message: 'Project deleted successfully' });
  } catch (error) {
    console.error('Delete project error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};