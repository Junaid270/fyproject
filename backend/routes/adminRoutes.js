const express = require("express");
const router = express.Router();
const Admin = require("../models/Admin");
const { ensureAdmin } = require("../middleware/auth");
const Post = require("../models/Post");
const User = require("../models/User");

// Admin check route
router.get("/check", async (req, res) => {
  try {
    console.log("Admin check route hit");
    console.log("Session:", req.session);
    console.log("Session user:", req.session.user);
    console.log("Session ID:", req.sessionID);

    if (!req.session.user) {
      console.log("No user in session");
      return res.status(401).json({ message: "Not authenticated" });
    }

    console.log("User role:", req.session.user.role);
    // For admin routes, we always expect role to be admin
    if (req.session.user.role !== "admin") {
      console.log("User is not admin:", req.session.user.role);
      return res.status(403).json({ message: "Not authorized" });
    }

    console.log("Admin check successful");
    // Return the admin user data
    res.json({
      user: {
        id: req.session.user.id,
        username: req.session.user.username,
        email: req.session.user.email,
        role: req.session.user.role,
      },
    });
  } catch (error) {
    console.error("Auth check error:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin login
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Login attempt for:", email);

    // Find admin user from Admin model
    const admin = await Admin.findOne({ email });
    console.log("Admin found:", admin ? "Yes" : "No");

    if (!admin) {
      console.log("No admin found with email:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Verify password
    const isValidPassword = await admin.isValidPassword(password);
    console.log("Password valid:", isValidPassword ? "Yes" : "No");

    if (!isValidPassword) {
      console.log("Invalid password for:", email);
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Set admin in session
    req.session.user = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
      role: "admin",
    };

    // Save session before responding
    req.session.save((err) => {
      if (err) {
        console.error("Session save error:", err);
        return res.status(500).json({ message: "Error saving session" });
      }

      console.log("Login successful for:", admin.email);
      console.log("Session after login:", req.session);
      return res.json({
        user: {
          id: admin._id,
          username: admin.username,
          email: admin.email,
          role: "admin",
        },
      });
    });
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({ message: "Login failed" });
  }
});

// Admin logout
router.post("/logout", (req, res) => {
  req.logout((err) => {
    if (err) {
      return res.status(500).json({ message: "Error logging out" });
    }
    res.json({ message: "Logged out successfully" });
  });
});

// Get all reported posts (5+ reports)
router.get("/reported-posts",  async (req, res) => {
  try {
    const reportedPosts = await Post.find({ reportCount: { $gte: 5 } })
      .populate("userId", "username")
      .sort({ reportCount: -1 })
      .lean(); // Convert to plain JavaScript objects

    // Ensure we always return an array
    const posts = Array.isArray(reportedPosts) ? reportedPosts : [];

    console.log("Found reported posts:", posts.length);

    res.json({
      posts: posts,
      total: posts.length,
    });
  } catch (error) {
    console.error("Error fetching reported posts:", error);
    res.status(500).json({ message: "Error fetching reported posts" });
  }
});

// Delete a post
router.delete("/posts/:postId",  async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }
    res.json({ message: "Post deleted successfully" });
  } catch (error) {
    console.error("Error deleting post:", error);
    res.status(500).json({ message: "Error deleting post" });
  }
});

// Clear reports for a post
router.post("/posts/:postId/clear-reports",  async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.postId,
      {
        $set: { reports: [], reportCount: 0 },
      },
      { new: true }
    );

    if (!post) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json({ message: "Reports cleared successfully", post });
  } catch (error) {
    console.error("Error clearing reports:", error);
    res.status(500).json({ message: "Error clearing reports" });
  }
});

// Get admin stats
router.get("/stats",  async (req, res) => {
  try {
    const [totalPosts, totalUsers] = await Promise.all([
      Post.countDocuments(),
      User.countDocuments(),
    ]);

    res.json({
      totalPosts,
      totalUsers,
    });
  } catch (error) {
    console.error("Error fetching stats:", error);
    res.status(500).json({ message: "Error fetching stats" });
  }
});

module.exports = router;
