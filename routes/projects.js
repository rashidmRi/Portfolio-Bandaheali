const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const { protect } = require('../middleware/auth');
const { body, validationResult } = require('express-validator');

// Frontend routes - Get all projects
router.get('/', async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      data: projects
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching projects'
    });
  }
});

// Frontend routes - Get single project
router.get('/:id', async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }
    
    res.json({
      success: true,
      data: project
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Error fetching project'
    });
  }
});

// Admin routes - Get all projects (protected)
router.get('/admin/all', protect, async (req, res) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    res.render('admin/projects', {
      title: 'Manage Projects',
      projects,
      success: req.query.success,
      error: req.query.error
    });
  } catch (error) {
    res.status(500).render('admin/projects', {
      title: 'Manage Projects',
      error: 'Error loading projects'
    });
  }
});

// Admin routes - Show create project form (protected)
router.get('/admin/create', protect, (req, res) => {
  res.render('admin/project-form', {
    title: 'Create Project',
    project: null
  });
});

// Admin routes - Show edit project form (protected)
router.get('/admin/edit/:id', protect, async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) {
      return res.redirect('/admin/projects?error=Project not found');
    }
    
    res.render('admin/project-form', {
      title: 'Edit Project',
      project
    });
  } catch (error) {
    res.redirect('/admin/projects?error=Error loading project');
  }
});

// Admin routes - Create project (protected)
router.post('/admin/create', protect, [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/project-form', {
        title: 'Create Project',
        project: req.body,
        error: errors.array()[0].msg
      });
    }
    
    const { title, description, technologies, projectUrl, githubUrl, featured } = req.body;
    
    const project = new Project({
      title,
      description,
      technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
      projectUrl: projectUrl || '',
      githubUrl: githubUrl || '',
      featured: featured === 'on'
    });
    
    await project.save();
    
    res.redirect('/admin/projects?success=Project created successfully');
  } catch (error) {
    res.render('admin/project-form', {
      title: 'Create Project',
      project: req.body,
      error: 'Error creating project'
    });
  }
});

// Admin routes - Update project (protected)
router.post('/admin/update/:id', protect, [
  body('title')
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 3 })
    .withMessage('Title must be at least 3 characters long'),
  body('description')
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters long')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.render('admin/project-form', {
        title: 'Edit Project',
        project: { ...req.body, _id: req.params.id },
        error: errors.array()[0].msg
      });
    }
    
    const { title, description, technologies, projectUrl, githubUrl, featured } = req.body;
    
    const project = await Project.findByIdAndUpdate(
      req.params.id,
      {
        title,
        description,
        technologies: technologies ? technologies.split(',').map(tech => tech.trim()) : [],
        projectUrl: projectUrl || '',
        githubUrl: githubUrl || '',
        featured: featured === 'on',
        updatedAt: Date.now()
      },
      { new: true, runValidators: true }
    );
    
    if (!project) {
      return res.redirect('/admin/projects?error=Project not found');
    }
    
    res.redirect('/admin/projects?success=Project updated successfully');
  } catch (error) {
    res.render('admin/project-form', {
      title: 'Edit Project',
      project: { ...req.body, _id: req.params.id },
      error: 'Error updating project'
    });
  }
});

// Admin routes - Delete project (protected)
router.post('/admin/delete/:id', protect, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    if (!project) {
      return res.redirect('/admin/projects?error=Project not found');
    }
    
    res.redirect('/admin/projects?success=Project deleted successfully');
  } catch (error) {
    res.redirect('/admin/projects?error=Error deleting project');
  }
});

module.exports = router;
