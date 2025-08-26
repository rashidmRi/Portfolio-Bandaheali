const mongoose = require('mongoose');

const aboutSchema = new mongoose.Schema({
  bio: {
    type: String,
    required: true
  },
  image: {
    type: String,
    default: 'profile.jpg'
  },
  resumeUrl: {
    type: String
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

aboutSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('About', aboutSchema);
