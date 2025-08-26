const About = require('../models/About');
const Project = require('../models/Project');
const Skill = require('../models/Skill');
const Message = require('../models/Message');

exports.getDashboard = async (req, res) => {
  try {
    const projectsCount = await Project.countDocuments();
    const messagesCount = await Message.countDocuments();
    const skillsCount = await Skill.countDocuments();
    
    res.render('admin/dashboard', {
      title: 'Dashboard',
      projectsCount,
      messagesCount,
      skillsCount
    });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading dashboard' });
  }
};

exports.getAbout = async (req, res) => {
  try {
    const about = await About.findOne() || new About();
    res.render('admin/about', { title: 'Manage About', about });
  } catch (error) {
    res.status(500).render('error', { message: 'Error loading about page' });
  }
};

exports.updateAbout = async (req, res) => {
  try {
    let about = await About.findOne();
    
    if (!about) {
      about = new About(req.body);
    } else {
      Object.assign(about, req.body);
    }
    
    if (req.file) {
      about.image = req.file.filename;
    }
    
    await about.save();
    res.redirect('/admin/about?success=About section updated successfully');
  } catch (error) {
    res.status(500).render('admin/about', {
      title: 'Manage About',
      error: 'Error updating about section'
    });
  }
};

// Similar CRUD operations for projects, skills, and messages would be implemented here
