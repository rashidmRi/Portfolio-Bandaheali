const express = require('express');
const router = express.Router();
const Project = require('../models/Project');
const About = require('../models/About');
const Skill = require('../models/Skill');

router.get('/', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 }).limit(3);
    const about = await About.findOne();
    const skills = await Skill.find();
    
    res.render('index', {
      title: 'Home',
      projects,
      about,
      skills
    });
  } catch (error) {
    next(error); // Pass error to the error handling middleware
  }
});

router.get('/about', async (req, res, next) => {
  try {
    const about = await About.findOne();
    const skills = await Skill.find();
    
    res.render('about', {
      title: 'About',
      about,
      skills
    });
  } catch (error) {
    next(error);
  }
});

router.get('/projects', async (req, res, next) => {
  try {
    const projects = await Project.find().sort({ createdAt: -1 });
    
    res.render('projects', {
      title: 'Projects',
      projects
    });
  } catch (error) {
    next(error);
  }
});

router.get('/contact', (req, res) => {
  res.render('contact', { title: 'Contact' });
});

router.get('/message-sent', (req, res) => {
  res.render('message-sent', { title: 'Message Sent' });
});

module.exports = router;
