const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const { isLoggedIn } = require("../utils/auth.js");
const { upload } = require("../cloudConfig.js");
const listingController = require("../controller/listing.js");

router
  .route("/")
  .get(wrapAsync(listingController.index))
  .post(isLoggedIn, upload.single("image"), wrapAsync(listingController.create));

router
  .route("/:id")
  .get(wrapAsync(listingController.show))
  .put(isLoggedIn, upload.single("image"), wrapAsync(listingController.update))
  .delete(isLoggedIn, wrapAsync(listingController.destroy));

module.exports = router;
