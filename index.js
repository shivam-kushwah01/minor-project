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

// Add this BEFORE session middleware
app.set('trust proxy', 1); 

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,          // Don't resave unchanged sessions
  saveUninitialized: false, // Don't create sessions for unauthenticated users
  store: MongoStore.create({
    mongoUrl: process.env.MONGODB_URI,
    ttl: 14 * 24 * 60 * 60 // Session TTL (optional)
  }),
  cookie: {
    secure: true,         // Required for HTTPS
    httpOnly: true,
    sameSite: 'none',     // Required for cross-site cookies
    maxAge: 604800000     // 1 week
  }
}));

const sessionStore = MongoStore.create({
  mongoUrl: process.env.MONGODB_URI,
  autoRemove: 'interval',
  autoRemoveInterval: 60 // Minutes
});

sessionStore.on('create', (sessionId) => {
  console.log('Session created:', sessionId);
});

sessionStore.on('destroy', (sessionId) => {
  console.log('Session destroyed:', sessionId);
});

app.use(flash());


app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser((user, done) => {
  console.log('Serializing user ID:', user._id); // Check if this logs
  done(null, user._id);
});

// Add to deserializeUser
passport.deserializeUser(async (id, done) => {
  console.log('Deserializing ID:', id); // Should match the serialized _id
  try {
    const user = await User.findById(id);
    console.log('Found user:', user); // Should show user data
    done(null, user);
  } catch (err) {
    console.error('Deserialize error:', err);
    done(err);
  }
});


app.use((req, res, next) => {
    res.locals.success = req.flash("success");
    res.locals.error = req.flash("error");
    res.locals.currUser = req.user || null;
    next();
});

app.use((req, res, next) => {
  console.log("Session:", req.session);
  console.log("User:", req.user);
  console.log(req.isAuthenticated()); 
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