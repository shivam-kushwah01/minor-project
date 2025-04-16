const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");

const reviewController = require("../controller/review.js");

router.post("/:id/reviews" , wrapAsync(reviewController.newReview));

router.delete("/:id/reviews/:reviewId" , reviewController.deleteReview);

module.exports = router ;