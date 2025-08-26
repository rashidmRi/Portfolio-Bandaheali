const jwt = require('jsonwebtoken');
const User = require('../models/User');

exports.protect = async (req, res, next) => {
  try {
    let token;
    
    if (req.cookies.jwt) {
      token = req.cookies.jwt;
    }
    
    if (!token) {
      return res.status(401).redirect('/admin/login');
    }
    
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    const currentUser = await User.findById(decoded.id);
    
    if (!currentUser) {
      return res.status(401).redirect('/admin/login');
    }
    
    req.user = currentUser;
    next();
  } catch (error) {
    res.status(401).redirect('/admin/login');
  }
};
