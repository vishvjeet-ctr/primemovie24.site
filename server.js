const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const methodOverride = require('method-override');
const session = require('express-session');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();

// Database connection
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('✅ MongoDB Connected'))
.catch(err => console.error('❌ MongoDB Connection Error:', err));

const User = require('./models/User');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // Use true for port 465, false for port 587
  auth: {
    user: "vk92636312@gmail.com",
    pass: "mbeq vbyl mvwz pdnw", // Gmail App Password (not regular password)
  },
});

const SendEmail = async (movie, suggestion, userIP, timestamp) => {
  try {
    const textBody = `New Movie Suggestion Received\n\n` +
      `Movie Name: ${movie || 'N/A'}\n` +
      `Message: ${suggestion || 'No additional message provided'}\n` +
      `Submitted At: ${timestamp}\n` +
      `User IP: ${userIP}\n\n` +
      `---\nThis is an automated message from PrimeMovie24 website.`;

    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f5f5f5;">
        <div style="background-color: #ffffff; padding: 30px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <h2 style="color: #e50914; margin-bottom: 20px; border-bottom: 2px solid #e50914; padding-bottom: 10px;">
            🎬 New Movie Suggestion
          </h2>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333; display: block; margin-bottom: 5px;">Movie Name:</strong>
            <span style="color: #666; font-size: 16px;">${movie || 'N/A'}</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333; display: block; margin-bottom: 5px;">Message:</strong>
            <span style="color: #666; white-space: pre-wrap;">${suggestion || 'No additional message provided'}</span>
          </div>
          <div style="margin-bottom: 15px;">
            <strong style="color: #333; display: block; margin-bottom: 5px;">Submitted At:</strong>
            <span style="color: #666;">${timestamp}</span>
          </div>
          <div style="margin-bottom: 20px;">
            <strong style="color: #333; display: block; margin-bottom: 5px;">User IP:</strong>
            <span style="color: #666; font-family: monospace;">${userIP}</span>
          </div>
          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e0e0e0; font-size: 12px; color: #999; text-align: center;">
            This is an automated message from PrimeMovie24 website.
          </div>
        </div>
      </div>
    `;

    const info = await transporter.sendMail({
      from: '"PrimeMovie24" <vk92636312@gmail.com>',
      to: "vk92636312@gmail.com",
      subject: `🎬 Movie Suggestion: ${movie || 'New Movie'}`,
      text: textBody,
      html: htmlBody,
    });

    console.log("✅ Suggestion email sent: %s", info.messageId);
    if (nodemailer.getTestMessageUrl) {
      console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
    }
  } catch (err) {
    console.error("❌ Error while sending suggestion email:", err);
    throw err;
  }
}
 


 

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(methodOverride('_method'));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key-change-this',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Login POST route
app.post('/admin', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const user = await User.findOne({ username });
    
    if (!user || user.password !== password || user.role !== 'admin') {
      return res.render('login.ejs', { 
        error: 'Invalid username or password' 
      });
    }
    
    req.session.admin = true;
    req.session.userId = user._id;
    res.redirect('/admin');
  } catch (error) {
    console.error('Login error:', error);
    res.render('login.ejs', { 
      error: 'Login failed. Please try again.' 
    });
  }
});
 
// Logout route
app.get('/admin/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      console.error('Logout error:', err);
    }
    res.redirect('/admin/login');
  });
});

app.post("/suggestion", async (req, res) => {
  try {
    const { movie, suggestion } = req.body;

    if (!movie || !movie.trim()) {
      return res.status(400).json({ error: "Movie name is required" });
    }

    // Get user IP address
    const userIP = req.ip || 
                   req.headers['x-forwarded-for']?.split(',')[0] || 
                   req.connection.remoteAddress || 
                   'Unknown';
    
    // Get current timestamp
    const timestamp = new Date().toLocaleString('en-US', {
      timeZone: 'UTC',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      second: '2-digit',
      hour12: true
    });

    await SendEmail(movie.trim(), suggestion ? suggestion.trim() : '', userIP, timestamp);

    res.json({ success: true });
  } catch (error) {
    console.error('Suggestion error:', error);
    res.status(500).json({ error: "Failed to send suggestion" });
  }
});


// Routes
app.use('/', require('./routes/frontend'));
app.use('/admin', require('./routes/admin'));

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).render('error', { error: err.message });
});

const PORT = process.env.PORT || 4001;
app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
}); 
            
  

        