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

app.set('trust proxy', 1); 


app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,          // Don't resave unchanged sessions
  saveUninitialized: false, // Don't create sessions for unauthenticated users
  store: MongoStore.create({
    mongoUrl: dbUrl,
    ttl: 14 * 24 * 60 * 60 // Session TTL (optional)
  }),
  cookie: {
  secure: process.env.NODE_ENV === 'production', // Only true in production
  httpOnly: true,
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: 604800000
}
}));

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

// ... (keep your existing requires and setup)

// Session configuration
// app.use(session({
//   secret: process.env.SESSION_SECRET,
//   resave: false,
//   saveUninitialized: false,
//   store: MongoStore.create({
//     mongoUrl: dbUrl,
//     ttl: 14 * 24 * 60 * 60
//   }),
//   cookie: {
//     secure: process.env.NODE_ENV === 'production',
//     httpOnly: true,
//     sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
//     maxAge: 604800000
//   }
// }));

// app.use(flash());

// // Passport setup
// app.use(passport.initialize());
// app.use(passport.session());
// passport.use(new LocalStrategy(User.authenticate()));

// passport.serializeUser((user, done) => {
//   done(null, user._id);
// });

// passport.deserializeUser(async (id, done) => {
//   try {
//     const user = await User.findById(id);
//     done(null, user);
//   } catch (err) {
//     done(err);
//   }
// });

// // Make user available to all templates
// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user; // This will be undefined if not logged in
//   next();
// });

// // Debugging middleware (temporary)
// app.use((req, res, next) => {
//   console.log("Is authenticated?", req.isAuthenticated());
//   console.log("User:", req.user);
//   next();
// });

// // ... (rest of your routes and setup)

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