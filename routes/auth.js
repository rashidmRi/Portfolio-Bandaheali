const express = require('express');
const router = express.Router();
const { login, logout } = require('../controllers/authController');

router.get('/login', (req, res) => {
  res.render('admin/login', { title: 'Admin Login' });
});

router.post('/login', login);
router.get('/logout', logout);

module.exports = router;
