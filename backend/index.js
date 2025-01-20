

/* eslint-disable no-unused-vars */
const express = require('express');
const session = require('express-session');
const bodyParser = require('body-parser');
const passport = require('passport');
const mongoose = require('mongoose');  // Import mongoose
const path = require('path');
const cors = require('cors');

const port = 3000;

const app = express();

// MongoDB connection
const mongoURI = 'mongodb://localhost:27017/auth_example';  // Replace with your MongoDB URI
mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('MongoDB connected'))
  .catch((err) => console.log('MongoDB connection error:', err));

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, '/views'));

// CORS configuration
app.use(cors({
    origin: 'http://192.168.0.202:8081', // your frontend's URL
    credentials: true,  // Allows cookies to be sent
}));

// Middleware configuration
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Session middleware
const sessionMiddleware = session({
    secret: 'your-secret-key',
    resave: false,
    saveUninitialized: false,
    cookie: { 
        secure: false,
        httpOnly: true,
        maxAge: 3600000 // Session expires after 1 hour
    }
});
app.use(sessionMiddleware);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Routes - Correct the path here
app.use('/auth', require('./routes/userRoutes'));  // Fix the path to 'require' correctly

// Start server
app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
