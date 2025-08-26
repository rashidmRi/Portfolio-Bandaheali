const Message = require('../models/Message');
const axios = require('axios');

exports.sendMessage = async (req, res) => {
  try {
    const { name, email, message } = req.body;
    
    // Save to database
    const newMessage = new Message({ name, email, message });
    await newMessage.save();
    
    // Send to Telegram
    const telegramMessage = `
New message from portfolio contact form:
    
Name: ${name}
Email: ${email}
Message: ${message}
    `;
    
    try {
      await axios.post(`https://api.telegram.org/bot${process.env.TELEGRAM_BOT_TOKEN}/sendMessage`, {
        chat_id: process.env.TELEGRAM_CHAT_ID,
        text: telegramMessage
      });
    } catch (telegramError) {
      console.error('Telegram error:', telegramError.message);
      // Continue even if Telegram fails
    }
    
    res.redirect('/message-sent');
  } catch (error) {
    res.status(500).render('contact', {
      title: 'Contact',
      error: 'There was an error sending your message. Please try again.'
    });
  }
};
