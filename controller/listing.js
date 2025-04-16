const Listing = require("../model/listing");


module.exports.index = async (req , res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs" , { allListings });
};

module.exports.newListing = (req , res) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "Please register before create a listing");
        return res.redirect("/login");
    }
    res.render("listings/new.ejs");
};

module.exports.show = async (req , res) => {
    let { id } = req.params ;
    let list = await Listing.findById(id).populate({ path : "review" , populate : { path : "author"}}).populate("owner");
    res.render("listings/show.ejs" , { list });
};

module.exports.createListing = async (req , res , next) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "Please register before create a listing");
        return res.redirect("/login");
    }
    let url = req.file.path ;
    let filename = req.file.filename ;
    console.log(url + "  " + filename);
    let { title , description , price , imageUrl , location } = req.body ;
    let listing = new Listing({
    Title : title ,
    Description : description ,
    Price : price ,
    imageUrl: { url, filename },
    Location : location ,
    });
    listing.owner = req.user._id ;
    await listing.save();
    req.flash("success" , "Place Added Successfully !!");
    res.redirect("/listing");  
};


module.exports.edit = async(req , res) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "Please register before create a listing");
        return res.redirect("/login");
    }
    let { id } = req.params ;
    let listing = await Listing.findById( id );
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listing/${id}`);
    }
    res.render("listings/edit.ejs" , { listing });
};

module.exports.editListing = async(req , res) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "Please register before edit a listing");
        return res.redirect("/login");
    }
    let { id } = req.params ;
    let listing = await Listing.findById( id );
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to edit");
        return res.redirect(`/listing/${id}`);
    }
    let { Title , Description , Price , imageUrl , Location } = req.body ;
    let updatedListing = await Listing.findByIdAndUpdate(
        id,
        { Title, Description , Price , imageUrl, Location}, 
        { new: true, runValidators: true }
    );
    res.redirect("/listing");
};

module.exports.delete = async (req , res) => {
    if(!req.isAuthenticated()){
        req.flash("error" , "Please register before delete a listing");
        return res.redirect("/login");
    }
    let { id } = req.params ;
    let listing = await Listing.findById( id );
    if(!listing.owner._id.equals(res.locals.currUser._id)){
        req.flash("error","You don't have permission to delete");
        return res.redirect(`/listing/${id}`);
    }
    let deleteListing = await Listing.findByIdAndDelete(id);
    console.log(deleteListing);
    res.redirect("/listing");
};