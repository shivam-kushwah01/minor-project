const passport = require("passport");
const User = require("../model/user");
const { publicUser } = require("../utils/auth");

module.exports.me = (req, res) => {
  res.json({ user: publicUser(req.user) });
};

module.exports.signup = async (req, res, next) => {
  try {
    const { username, password, email } = req.body;
    if (!username || !password || !email) {
      return res.status(400).json({ error: "Username, email and password are required" });
    }
    if (!/^[A-Za-z0-9_]{3,15}$/.test(username)) {
      return res.status(400).json({ error: "Username must be 3-15 letters, numbers or underscores" });
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      return res.status(400).json({ error: "Please enter a valid email address" });
    }
    if (String(password).length < 6) {
      return res.status(400).json({ error: "Password must be at least 6 characters long" });
    }
    const registeredUser = await User.register(new User({ email, username }), password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      res.status(201).json({
        user: publicUser(registeredUser),
        message: `Hello ${username}, Welcome to Wonderlust!`,
      });
    });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

module.exports.login = (req, res, next) => {
  passport.authenticate("local", (err, user, info) => {
    if (err) return next(err);
    if (!user) {
      return res.status(401).json({ error: info?.message || "Invalid username or password" });
    }
    req.login(user, (err) => {
      if (err) return next(err);
      res.json({ user: publicUser(user), message: "Logged in successfully!" });
    });
  })(req, res, next);
};

module.exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.json({ message: "You are logged out" });
  });
};
