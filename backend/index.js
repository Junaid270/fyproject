/* eslint-disable no-unused-vars */
const express = require("express");
const session = require("express-session");
const bodyParser = require("body-parser");
const passport = require("passport");
const mongoose = require("mongoose"); // Import mongoose
const path = require("path");
const cors = require("cors");

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
    origin: "http://192.168.0.202:8081", // your frontend's URL
    credentials: true, // Allows cookies to be sent
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

// Routes - Correct the path here
app.use("/auth", require("./routes/userRoutes")); // Fix the path to 'require' correctly
app.use("/auth/posts", require("./routes/postRoutes")); // Add this line

// Add this after your routes
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    message: "Something broke!",
    error: err.message,
  });
});

// Handle 404
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
