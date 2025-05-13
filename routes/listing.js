const express = require("express");
const router = express.Router();
const wrapAsync = require("../utils/wrapAsync.js");
const multer  = require('multer');
const path = require('path');
// const { storage } = require("../cloudConfig.js");
// const upload = multer("./uploads");

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, './uploads'); 
    },
    filename: function (req, file, cb) {
      const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
      cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
  });

// Add file filter to only accept images
const fileFilter = (req, file, cb) => {
    const filetypes = /jpeg|jpg|png|gif/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);
  
    if (mimetype && extname) {
      return cb(null, true);
    } else {
      cb('Error: Images only!');
    }
  };
  
  const upload = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 5 * 1024 * 1024 } // 5MB limit
  });

const listingController = require("../controller/listing.js");

router.route("/").get(wrapAsync(listingController.index))
.post( upload.single('imageUrl') ,wrapAsync(listingController.createListing));


router.get("/new" , listingController.newListing);

router.route("/:id").get(wrapAsync( listingController.show ) ).put(wrapAsync(listingController.editListing)).delete(wrapAsync(listingController.delete));

router.get("/:id/edit" , wrapAsync(listingController.edit));

module.exports = router ;