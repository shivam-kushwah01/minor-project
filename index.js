if(process.env.NODE_ENV != "production"){
    require('dotenv').config();
}

const express = require("express");
const app = express();
const mongoose = require("mongoose");
const path = require("path");
const methodOverride = require("method-override");
const ejsMate = require("ejs-mate");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./model/user.js");
const session = require('express-session');
const MongoStore = require('connect-mongo');
const userRouter = require("./routes/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const expressError = require("./utils/expressError.js");
const flash = require("connect-flash");
const Listing = require("./model/listing.js");

app.set("view engine" , "ejs");
app.set("views" , path.join(__dirname , "views"));
app.use(express.urlencoded({extended : true}));
app.use(methodOverride("_method"));
app.engine("ejs" , ejsMate);
app.use(express.static(path.join(__dirname , "/public")));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const port = 8080 ;
const dbUrl = process.env.ATLASDB_URL ;

const sessionOptions = {
    store: MongoStore.create({
        mongoUrl: dbUrl,
        crypto: {
            secret: process.env.SECRET,
        },
        touchAfter: 24 * 3600,
    }),
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: {
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
        maxAge: 7 * 24 * 60 * 60 * 1000,
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "lax"
    },
};


app.use(session(sessionOptions));
app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user ;
    next();
});

app.use("/", userRouter);
app.use("/listing" , listingRouter);
app.use("/listing" , reviewRouter);

main().then(() => {
    console.log("connected successfully");
})
.catch((err) => {
    console.log(err);
});

async function main(){
    await mongoose.connect(dbUrl);
}

app.get("/" , async (req , res) => {
    let allListings = await Listing.find();
    res.render("listings/index.ejs" , { allListings });
});


app.all("*" , (req , res , next) => {
   next(new expressError(404 , "page not found!"));
});

app.use((err ,  req , res , next) => {
    let {message = "Something Went Wrong!!"} = err;
    res.render("error.ejs" , { message });
});

app.listen(port , (req , res) => {
    console.log(`port is running at ${port}`);
});