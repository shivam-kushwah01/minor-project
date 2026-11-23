// One-time migration: upload every listing image that is still stored locally
// (backend/uploads/* or the seed images in frontend/public/images/*) to Cloudinary
// and point the listing at the Cloudinary URL.
//
//   npm run migrate:images -- --dry-run   # show what would happen
//   npm run migrate:images                # do it
//
// Each listing gets its own Cloudinary copy, so deleting one listing never
// deletes an image another listing still uses.
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const path = require("path");
const fs = require("fs");
const mongoose = require("mongoose");
const { cloudinary, useCloudinary, CLOUD_FOLDER } = require("../cloudConfig.js");
const Listing = require("../model/listing.js");

const DRY_RUN = process.argv.includes("--dry-run");
const UPLOADS_DIR = path.join(__dirname, "..", "uploads");
const SEED_IMAGES_DIR = path.join(__dirname, "..", "..", "frontend", "public", "images");

// Case-insensitive lookup (seed data has e.g. "narmadaretrev.jpeg" vs "narmadaRetrev.jpeg")
function findFile(dir, name) {
  if (!fs.existsSync(dir)) return null;
  const match = fs.readdirSync(dir).find((f) => f.toLowerCase() === name.toLowerCase());
  return match ? path.join(dir, match) : null;
}

function resolveLocalFile(url) {
  const clean = url.replace(/\\/g, "/");
  const name = path.posix.basename(clean);
  if (clean.includes("uploads/")) return findFile(UPLOADS_DIR, name);
  if (clean.includes("images/")) return findFile(SEED_IMAGES_DIR, name);
  return findFile(UPLOADS_DIR, name) || findFile(SEED_IMAGES_DIR, name);
}

async function main() {
  if (!useCloudinary) throw new Error("Set CLOUD_NAME, CLOUD_API_KEY and CLOUD_API_SECRET in backend/.env first");
  await mongoose.connect(process.env.ATLASDB_URL);

  const listings = await Listing.find({ "imageUrl.url": { $not: /res\.cloudinary\.com/ } });
  console.log(`${listings.length} listing(s) with local images${DRY_RUN ? " (dry run)" : ""}\n`);

  let migrated = 0;
  const missing = [];
  for (const listing of listings) {
    const url = listing.imageUrl?.url;
    const file = url && resolveLocalFile(url);
    if (!file) {
      missing.push(`${listing._id} "${listing.Title}" -> ${url || "(no image)"}`);
      continue;
    }
    console.log(`${listing.Title}: ${path.relative(path.join(__dirname, "..", ".."), file)}`);
    if (DRY_RUN) continue;

    const result = await cloudinary.uploader.upload(file, {
      folder: CLOUD_FOLDER,
      transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
    });
    listing.imageUrl = { url: result.secure_url, filename: result.public_id };
    await listing.save();
    migrated++;
  }

  console.log(`\n${DRY_RUN ? "Would migrate" : "Migrated"} ${DRY_RUN ? listings.length - missing.length : migrated} listing(s).`);
  if (missing.length) {
    console.log(`\nCould not find a local file for ${missing.length} listing(s):`);
    missing.forEach((m) => console.log("  " + m));
  }
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
