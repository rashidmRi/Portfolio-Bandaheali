const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const {
  getDashboard,
  getAbout,
  updateAbout
} = require('../controllers/adminController');

// All admin routes are protected
router.use(protect);

router.get('/dashboard', getDashboard);
router.get('/about', getAbout);
router.post('/about', updateAbout);

// Additional admin routes for projects, skills, and messages would be added here

module.exports = router;
