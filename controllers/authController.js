const User = require('../models/User');
const jwt = require('jsonwebtoken');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN
  });
};

exports.login = async (req, res) => {
  try {
    const { username, password } = req.body;
    
    // 1) Check if username and password exist
    if (!username || !password) {
      return res.status(400).render('admin/login', {
        error: 'Please provide username and password!'
      });
    }
    
    // 2) Check if user exists && password is correct
    const user = await User.findOne({ username });
    
    if (!user || !(await user.correctPassword(password, user.password))) {
      return res.status(401).render('admin/login', {
        error: 'Incorrect username or password'
      });
    }
    
    // 3) If everything ok, send token to client
    const token = signToken(user._id);
    
    res.cookie('jwt', token, {
      expires: new Date(
        Date.now() + process.env.JWT_COOKIE_EXPIRES_IN * 24 * 60 * 60 * 1000
      ),
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production'
    });
    
    res.status(200).redirect('/admin/dashboard');
  } catch (err) {
    res.status(500).render('admin/login', {
      error: 'An error occurred during login'
    });
  }
};

exports.logout = (req, res) => {
  res.cookie('jwt', 'loggedout', {
    expires: new Date(Date.now() + 10 * 1000),
    httpOnly: true
  });
  res.status(200).redirect('/');
};
