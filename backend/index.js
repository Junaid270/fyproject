/* eslint-disable no-unused-vars */
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose"); // Import mongoose
const path = require("path");
const cors = require("cors");
const Admin = require("./models/Admin");
const User = require("./models/User"); // Add this import

const port = 3000;

const app = express();

// MongoDB connection
const mongoURI = "mongodb://localhost:27017/auth_example"; // Replace with your MongoDB URI
mongoose
  .connect(mongoURI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("MongoDB connected");
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err);
  });

// Add this after your mongoose.connect()
mongoose.connection.once("open", async () => {
  try {
    // Drop the old indexes
    await mongoose.connection.collection("users").dropIndex("phone_1");
    console.log("Old indexes dropped successfully");
  } catch (error) {
    console.log("No old indexes to drop or already dropped");
  }
});

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "/views"));

// CORS configuration
app.use(
  cors({
    origin: [
      
      "http://localhost:3001",
      "http://192.168.0.202:8081",
      "exp://192.168.0.202:8081",
    ],
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Accept"],
  })
);

// Middleware configuration
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(express.static("public"));

// Session middleware
const sessionMiddleware = session({
  secret: "your-secret-key",
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: false,
    httpOnly: true,
    maxAge: 3600000, // Session expires after 1 hour
  },
});
app.use(sessionMiddleware);

// Passport initialization
app.use(passport.initialize());
app.use(passport.session());

// Update passport configuration
passport.serializeUser((user, done) => {
  done(null, {
    id: user._id,
    role: user.role,
    model: user.constructor.modelName, // Add model name to identify User vs Admin
  });
});

passport.deserializeUser(async (data, done) => {
  try {
    let user;
    if (data.model === "Admin") {
      user = await Admin.findById(data.id);
    } else {
      user = await User.findById(data.id);
    }
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Routes
app.use("/auth", require("./routes/userRoutes"));
app.use("/auth/posts", require("./routes/postRoutes"));
app.use("/auth/admin", require("./routes/adminRoutes")); // Changed from /admin to /auth/admin

// Add this after your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke!",
    error: err.message,
  });
});

// Handle 404 - Add more detailed error message
app.use((req, res) => {
  console.log("404 Not Found:", req.method, req.url); // Add logging
  res.status(404).json({
    message: "Route not found",
    path: req.url,
    method: req.method,
  });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
