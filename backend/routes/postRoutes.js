const express = require("express");
const router = express.Router();
const Post = require("../models/Post");
const { ensureAuthenticated } = require("../middleware/auth");

// Create a new post
router.post("/", ensureAuthenticated, async (req, res) => {
  try {
    console.log("Received post data:", req.body);

    const { title, description, image, location, tags } = req.body;

    // Validate required fields
    if (!title || !description || !image || !location) {
      return res.status(400).json({
        message: "Missing required fields",
      });
    }

    const newPost = new Post({
      title,
      description,
      image,
      location,
      tags,
      author: req.user._id,
    });

    await newPost.save();
    console.log("Post saved successfully:", newPost._id);
    res.status(201).json(newPost);
  } catch (error) {
    console.error("Error in post creation:", error);
    res.status(500).json({
      message: error.message || "Error creating post",
    });
  }
});

// Get all posts
router.get("/", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username")
      .sort({ createdAt: -1 });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Get user's posts
router.get("/user", ensureAuthenticated, async (req, res) => {
  try {
    const posts = await Post.find({ author: req.user._id }).sort({
      createdAt: -1,
    });
    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update a post
router.put("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findOne({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    Object.assign(post, req.body);
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Delete a post
router.delete("/:id", ensureAuthenticated, async (req, res) => {
  try {
    const post = await Post.findOneAndDelete({
      _id: req.params.id,
      author: req.user._id,
    });

    if (!post) {
      return res
        .status(404)
        .json({ message: "Post not found or unauthorized" });
    }

    res.json({ message: "Post deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
