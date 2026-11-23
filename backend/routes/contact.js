const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const ExpressError = require("../utils/expressError.js");
const ContactMessage = require("../model/contactMessage.js");

// Simple in-memory limit against spam: max 5 messages per IP per hour.
const WINDOW_MS = 60 * 60 * 1000;
const MAX_PER_WINDOW = 5;
const hits = new Map();

function rateLimit(req, res, next) {
  const now = Date.now();
  const recent = (hits.get(req.ip) || []).filter((t) => now - t < WINDOW_MS);
  if (recent.length >= MAX_PER_WINDOW) {
    return next(new ExpressError(429, "Too many messages. Please try again later."));
  }
  recent.push(now);
  hits.set(req.ip, recent);
  if (hits.size > 10000) hits.clear(); // keep memory bounded
  next();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

router.post(
  "/",
  rateLimit,
  wrapAsync(async (req, res) => {
    const { name, email, topic, message } = req.body;
    if (!name || !email || !message) throw new ExpressError(400, "Name, email and message are required");
    if (!EMAIL_RE.test(String(email))) throw new ExpressError(400, "Please enter a valid email address");
    await ContactMessage.create({
      name: String(name),
      email: String(email),
      topic: topic ? String(topic) : undefined,
      message: String(message),
      user: req.user?._id,
    });
    res.status(201).json({ message: "Thanks! Your message has been sent. We'll get back to you soon." });
  })
);

module.exports = router;
