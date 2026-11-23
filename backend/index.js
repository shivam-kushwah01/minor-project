if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}

const express = require("express");
const mongoose = require("mongoose");
const path = require("path");
const cors = require("cors");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const session = require("express-session");
const MongoStore = require("connect-mongo");
const multer = require("multer");
const { useCloudinary } = require("./cloudConfig.js");

const User = require("./model/user.js");
const authRouter = require("./routes/user.js");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const ExpressError = require("./utils/expressError.js");

const app = express();
const port = process.env.PORT || 8080;
const dbUrl = process.env.ATLASDB_URL;
const isProd = process.env.NODE_ENV === "production";

// Comma-separated list of allowed frontend origins, e.g.
// FRONTEND_URL=https://wonderlust.vercel.app,http://localhost:5173
const allowedOrigins = (process.env.FRONTEND_URL || "http://localhost:5173")
  .split(",")
  .map((o) => o.trim().replace(/\/$/, ""))
  .filter(Boolean);

app.set("trust proxy", 1);

app.use(
  cors({
    origin(origin, cb) {
      // Allow same-origin / server-to-server requests (no Origin header)
      if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
      console.warn(
        `CORS: blocked request from ${origin}. Add it to FRONTEND_URL (currently: ${allowedOrigins.join(", ")})`
      );
      cb(null, false);
    },
    credentials: true,
  })
);

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// Lightweight endpoint for the frontend warm-up ping and uptime monitors.
// Registered before the session middleware so it never touches MongoDB.
app.get(["/", "/api/health"], (req, res) => {
  res.json({
    status: "ok",
    db: mongoose.connection.readyState === 1,
    imageStorage: useCloudinary ? "cloudinary" : "local-disk (images will be lost on restart!)",
  });
});

app.use(
  session({
    secret: process.env.SECRET,
    resave: false,
    saveUninitialized: false,
    store: MongoStore.create({
      mongoUrl: dbUrl,
      ttl: 14 * 24 * 60 * 60,
    }),
    cookie: {
      secure: isProd,
      httpOnly: true,
      // "none" is required when the frontend and backend are on different domains
      sameSite: isProd ? "none" : "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    },
  })
);

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/api/auth", authRouter);
app.use("/api/listings", listingRouter);
app.use("/api/listings/:id/reviews", reviewRouter);

app.all("*", (req, res, next) => {
  next(new ExpressError(404, "Not found"));
});

app.use((err, req, res, next) => {
  let status = err.statusCode || err.status || err.http_code || 500;
  let message = typeof err === "string" ? err : err.message || "Something went wrong";
  if (err.name === "ValidationError" || err.name === "CastError") status = 400;
  if (err instanceof multer.MulterError) {
    status = 400;
    if (err.code === "LIMIT_FILE_SIZE") message = "Image must be smaller than 5MB";
  }
  if (status >= 500) console.error(err);
  res.status(status).json({ error: message });
});

mongoose
  .connect(dbUrl)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

app.listen(port, () => {
  console.log(`API listening on port ${port}`);
});
