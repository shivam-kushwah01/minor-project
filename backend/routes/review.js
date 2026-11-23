const express = require("express");
const router = express.Router({ mergeParams: true });
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../utils/auth.js");
const reviewController = require("../controller/review.js");

router.post("/", isLoggedIn, wrapAsync(reviewController.create));
router.delete("/:reviewId", isLoggedIn, wrapAsync(reviewController.destroy));

module.exports = router;
