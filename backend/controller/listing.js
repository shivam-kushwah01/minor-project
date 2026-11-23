const mongoose = require("mongoose");
const Listing = require("../model/listing");
const ExpressError = require("../utils/expressError");
const { fileToImage, deleteImage } = require("../cloudConfig");

async function findOwnedListing(req) {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ExpressError(404, "Listing not found");
  const listing = await Listing.findById(id);
  if (!listing) throw new ExpressError(404, "Listing not found");
  if (!listing.owner || !listing.owner.equals(req.user._id)) {
    throw new ExpressError(403, "You don't have permission to do that");
  }
  return listing;
}

module.exports.index = async (req, res) => {
  const listings = await Listing.find().select("Title Price imageUrl Location").lean();
  res.json(listings);
};

module.exports.show = async (req, res) => {
  const { id } = req.params;
  if (!mongoose.isValidObjectId(id)) throw new ExpressError(404, "Listing not found");
  const listing = await Listing.findById(id)
    .populate({ path: "review", populate: { path: "author", select: "username" } })
    .populate("owner", "username")
    .lean();
  if (!listing) throw new ExpressError(404, "Listing not found");
  res.json(listing);
};

module.exports.create = async (req, res) => {
  if (!req.file) throw new ExpressError(400, "Please upload an image");
  const { title, description, price, location } = req.body;
  const listing = new Listing({
    Title: title,
    Description: description,
    Price: price,
    Location: location,
    imageUrl: fileToImage(req.file),
    owner: req.user._id,
  });
  try {
    await listing.save();
  } catch (err) {
    await deleteImage(listing.imageUrl); // don't leave an orphaned upload behind
    throw err;
  }
  res.status(201).json({ listing, message: "Place added successfully!" });
};

module.exports.update = async (req, res) => {
  let listing;
  try {
    listing = await findOwnedListing(req);
  } catch (err) {
    if (req.file) await deleteImage(fileToImage(req.file));
    throw err;
  }
  const { title, description, price, location } = req.body;
  if (title !== undefined) listing.Title = title;
  if (description !== undefined) listing.Description = description;
  if (price !== undefined) listing.Price = price;
  if (location !== undefined) listing.Location = location;

  const oldImage = listing.imageUrl ? listing.imageUrl.toObject() : null;
  if (req.file) listing.imageUrl = fileToImage(req.file);
  await listing.save();
  if (req.file) await deleteImage(oldImage);

  res.json({ listing, message: "Listing updated!" });
};

module.exports.destroy = async (req, res) => {
  const listing = await findOwnedListing(req);
  await Listing.findByIdAndDelete(listing._id);
  await deleteImage(listing.imageUrl);
  res.json({ message: "Listing deleted" });
};
