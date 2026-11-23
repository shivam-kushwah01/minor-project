// Seed script: run from the backend folder with `npm run seed`
// Requires ATLASDB_URL and SEED_OWNER_ID (an existing user's _id) in backend/.env
require("dotenv").config({ path: require("path").join(__dirname, "..", ".env") });
const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const init = require("./data.js");

async function main() {
  await mongoose.connect(process.env.ATLASDB_URL);
  console.log("connected successfully");

  const data = init.data.map((obj) => ({ ...obj, owner: process.env.SEED_OWNER_ID }));
  await Listing.insertMany(data);
  console.log("data added successfully");
  await mongoose.disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
