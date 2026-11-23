module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ error: "Please log in first" });
  }
  next();
};

module.exports.publicUser = (user) =>
  user ? { _id: user._id, username: user.username, email: user.email } : null;
