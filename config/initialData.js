const About = require('../models/About');
const Skill = require('../models/Skill');

const initializeData = async () => {
  try {
    // Check if About data exists
    const aboutCount = await About.countDocuments();
    if (aboutCount === 0) {
      await About.create({
        bio: "I'm a passionate developer with experience in building web applications. I love learning new technologies and solving complex problems.",
        image: "profile.jpg",
        resumeUrl: "/resume.pdf"
      });
      console.log('Default about data created');
    }

    // Check if Skills data exists
    const skillsCount = await Skill.countDocuments();
    if (skillsCount === 0) {
      await Skill.insertMany([
        { name: 'JavaScript', category: 'frontend', proficiency: 85 },
        { name: 'Node.js', category: 'backend', proficiency: 80 },
        { name: 'React', category: 'frontend', proficiency: 75 },
        { name: 'Express.js', category: 'backend', proficiency: 85 },
        { name: 'MongoDB', category: 'backend', proficiency: 70 },
        { name: 'HTML/CSS', category: 'frontend', proficiency: 90 },
        { name: 'Git', category: 'tools', proficiency: 80 }
      ]);
      console.log('Default skills data created');
    }
  } catch (error) {
    console.error('Error initializing data:', error);
  }
};

module.exports = initializeData;
