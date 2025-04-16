const mongoose = require("mongoose");
const review = require('./review.js');

const listingSchema = new mongoose.Schema({
    Title : {
        type : String,
    } ,
    Description : String ,
    imageUrl : {
        url : String,
        filename : String,
    },
    Price : {
        type : Number ,
        require : true 
    },
    Location : String ,
    review : [
        {
            type : mongoose.Schema.Types.ObjectId ,
            ref : "review",
        },
    ],
    owner : {
        type : mongoose.Schema.Types.ObjectId ,
        ref : "User",
    },
});

listingSchema.post("findOneAndDelete" , async(listing) => {
        if (listing) {
            try {
                await review.deleteMany({ _id: { $in: listing.review } });
            } catch (err) {
                console.error("Error deleting reviews:", err);
            }
        }
});

let Listing = mongoose.model("listing" , listingSchema);

module.exports = Listing;