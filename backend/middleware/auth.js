const Admin = require("../models/Admin");

// Middleware to check if user is authenticated
const ensureAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  res.status(401).json({ message: "Not authenticated" });
};

// Middleware to check if user is admin
const ensureAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === "admin") {
    return next();
  }
  res.status(401).json({ message: "Not authorized" });
};

module.exports = {
  ensureAuthenticated,
  ensureAdmin,
};
