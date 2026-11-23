const mongoose = require("mongoose");
const Listing = require("../model/listing");
const Review = require("../model/review");
const ExpressError = require("../utils/expressError");

module.exports.create = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ExpressError(404, "Listing not found");
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");

  const { rating, comment } = req.body;
  if (!comment) throw new ExpressError(400, "Please enter a comment");

  const review = new Review({ rating, comment, author: req.user._id });
  listing.review.push(review);
  await review.save();
  await listing.save();
  await review.populate("author", "username");
  res.status(201).json({ review, message: "Review added!" });
};

module.exports.destroy = async (req, res) => {
  const { id, reviewId } = req.params;
  if (!mongoose.isValidObjectId(reviewId)) throw new ExpressError(404, "Review not found");
  const review = await Review.findById(reviewId);
  if (!review) throw new ExpressError(404, "Review not found");

  const listing = await Listing.findById(id);
  const isAuthor = review.author && review.author.equals(req.user._id);
  const isListingOwner = listing && listing.owner && listing.owner.equals(req.user._id);
  if (!isAuthor && !isListingOwner) {
    throw new ExpressError(403, "You can't delete this review");
  }

  await Listing.findByIdAndUpdate(id, { $pull: { review: reviewId } });
  await Review.findByIdAndDelete(reviewId);
  res.json({ message: "Review deleted successfully!" });
};
