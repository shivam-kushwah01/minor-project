const mongoose = require("mongoose");
const review = require("./review.js");

// Keep in sync with frontend/src/categories.js
const CATEGORIES = ["trending", "rooms", "castles", "pools", "camping", "ghats"];

const listingSchema = new mongoose.Schema({
  Title: {
    type: String,
  },
  Description: String,
  imageUrl: {
    url: String,
    filename: String,
  },
  Price: {
    type: Number,
    required: true,
    min: 0,
  },
  Location: String,
  category: [
    {
      type: String,
      enum: CATEGORIES,
    },
  ],
  review: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "review",
    },
  ],
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
});

listingSchema.post("findOneAndDelete", async (listing) => {
  if (listing) {
    try {
      await review.deleteMany({ _id: { $in: listing.review } });
    } catch (err) {
      console.error("Error deleting reviews:", err);
    }
  }
});

const Listing = mongoose.model("listing", listingSchema);

module.exports = Listing;
module.exports.CATEGORIES = CATEGORIES;
