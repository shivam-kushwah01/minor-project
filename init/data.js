const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const init = require("./init.js");

main().then(() => {
    console.log("connected successfully");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect('mongodb://127.0.0.1:27017/house');
}

const initDB = async () => {
    await Listing.deleteMany({});
    init.data = init.data.map((obj) => ({ ...obj , owner : "67c167d96353dfeb0c9e14be"}));
    await Listing.insertMany(init.data);
    console.log("data added successfully");
};


initDB();