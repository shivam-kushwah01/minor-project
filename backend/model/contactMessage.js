const mongoose = require("mongoose");

// Messages sent from the Contact page. Read them in MongoDB Atlas
// (Browse Collections -> contactmessages).
const contactMessageSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true, maxlength: 100 },
  email: { type: String, required: true, trim: true, maxlength: 200 },
  topic: { type: String, trim: true, maxlength: 100 },
  message: { type: String, required: true, trim: true, minlength: 10, maxlength: 5000 },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("ContactMessage", contactMessageSchema);
