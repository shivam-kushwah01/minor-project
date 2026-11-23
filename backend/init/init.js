// Seed demo listings.  Run from the backend folder:
//
//   npm run seed              # add the demo listings
//   npm run seed -- --fresh   # DELETE all listings + reviews first, then add them
//
// Listings are owned by a demo user (default username "wonderlust").
// Set SEED_DEMO_PASSWORD in .env to choose its password; otherwise a random one
// is generated and printed the first time the user is created.
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const path = require("path");
const crypto = require("crypto");
const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const Review = require("../model/review.js");
const User = require("../model/user.js");
const { cloudinary, useCloudinary, CLOUD_FOLDER, deleteImage } = require("../cloudConfig.js");
const { data } = require("./data.js");

const FRESH = process.argv.includes("--fresh");
const DEMO_USERNAME = process.env.SEED_DEMO_USERNAME || "wonderlust";
const ROOT = path.join(__dirname, "..", "..");

function imageSource(image) {
  if (image.unsplash) return `https://images.unsplash.com/photo-${image.unsplash}?w=1600&q=80&fm=jpg`;
  if (image.local) return path.join(ROOT, image.local);
  throw new Error("Listing image needs `unsplash` or `local`");
}

async function getDemoOwner() {
  let user = await User.findOne({ username: DEMO_USERNAME });
  if (user) {
    console.log(`Using existing demo user "${DEMO_USERNAME}"`);
    return user;
  }
  const password = process.env.SEED_DEMO_PASSWORD || crypto.randomBytes(9).toString("base64url");
  user = await User.register(new User({ username: DEMO_USERNAME, email: "demo@example.com" }), password);
  console.log(`Created demo user  username: ${DEMO_USERNAME}  password: ${password}`);
  if (!process.env.SEED_DEMO_PASSWORD) console.log("  (save this password, it is not stored anywhere else)");
  return user;
}

async function main() {
  if (!useCloudinary) throw new Error("Set CLOUD_NAME, CLOUD_API_KEY and CLOUD_API_SECRET in backend/.env first");
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("Connected to", mongoose.connection.db.databaseName);

  if (FRESH) {
    const old = await Listing.find({}, "imageUrl").lean();
    await Promise.all(old.map((l) => deleteImage(l.imageUrl)));
    const { deletedCount: listings } = await Listing.deleteMany({});
    const { deletedCount: reviews } = await Review.deleteMany({});
    console.log(`Removed ${listings} listings and ${reviews} reviews`);
  }

  const owner = await getDemoOwner();

  let added = 0;
  for (const item of data) {
    const { image, ...fields } = item;
    const result = await cloudinary.uploader.upload(imageSource(image), {
      folder: CLOUD_FOLDER,
      transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
    });
    await Listing.create({
      ...fields,
      imageUrl: { url: result.secure_url, filename: result.public_id },
      owner: owner._id,
    });
    added++;
    console.log(`  + ${fields.Title}`);
  }
  console.log(`\nAdded ${added} listings`);
  await mongoose.disconnect();
}

main().catch(async (err) => {
  console.error(err);
  await mongoose.disconnect().catch(() => {});
  process.exit(1);
});
