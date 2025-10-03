const mongoose = require("mongoose");
const Listing = require("../model/listing.js");
const init = require("./init.js");


async function main(){
    await mongoose.connect("mongodb+srv://shivam:uAIMutdFFaPeP1Xc@cluster0.vwpdrid.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0");
}

main().then(() => {
    console.log("connected successfully");
})
.catch((err) => {
    console.log(err);
});

const initDB = async () => {
    init.data = init.data.map((obj) => ({ ...obj , owner : "68df832ab939605179a28900"}));
    await Listing.insertMany(init.data);
    console.log("data added successfully");
};

initDB();