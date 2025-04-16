const Listing = require("../model/listing");
const review = require('../model/review.js');

module.exports.newReview = 
    async (req , res) => {
        if(!req.isAuthenticated()){
            req.flash("error" , "Please register before delete a listing");
            return res.redirect("/login");
        }
        let listing = await Listing.findById(req.params.id);
        let newReview = new review(req.body.review);
        newReview.author = req.user._id ;
        listing.review.push(newReview);
        await newReview.save();
        await listing.save();
        console.log(listing);
        res.redirect(`/listing/${listing._id}`);
    };


module.exports.deleteReview = async (req ,res) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "Please register before delete a listing");
        return res.redirect("/login");
    }
    let { id , reviewId} = req.params ;
    let currReview = await review.findById(reviewId);
    if(!currReview.author._id.equals(res.locals.currUser._id)){
        req.flash("error","You are not the author of this review");
        return res.redirect(`/listing/${id}`);
    }
    await Listing.findByIdAndUpdate(id , { $pull : { reviews : reviewId}});
    await review.findByIdAndDelete(reviewId);
    req.flash("success","review deleted successfully!!");
    res.redirect(`/listing/${id}`);
};    