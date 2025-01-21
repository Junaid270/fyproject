const passport = require("passport");
const LocalStrategy = require("passport-local").Strategy;
const User = require("../models/User");

passport.use(
  new LocalStrategy(
    {
      usernameField: "email",
      passwordField: "password",
    },
    async (email, password, done) => {
      try {
        // Find user by email
        const user = await User.findOne({ email });

        // If user not found
        if (!user) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // Check password
        const isValid = await user.isValidPassword(password);
        if (!isValid) {
          return done(null, false, { message: "Invalid credentials" });
        }

        // If everything is OK, return user
        return done(null, user);
      } catch (error) {
        return done(error);
      }
    }
  )
);

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id);
    done(null, user);
  } catch (error) {
    done(error);
  }
});

module.exports = passport;
