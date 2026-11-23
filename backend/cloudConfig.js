const path = require("path");
const fs = require("fs");
const multer = require("multer");

// Images are stored on Cloudinary when credentials are configured (required in
// production: the disk on free hosting tiers is wiped on every restart).
// Without credentials (e.g. quick local dev) they fall back to ./uploads.
const CLOUD_FOLDER = process.env.CLOUD_FOLDER || "wonderlust";
const useCloudinary = Boolean(
  process.env.CLOUD_NAME && process.env.CLOUD_API_KEY && process.env.CLOUD_API_SECRET
);

let cloudinary = null;
let storage;

if (useCloudinary) {
  cloudinary = require("cloudinary").v2;
  const { CloudinaryStorage } = require("multer-storage-cloudinary");

  cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
    secure: true,
  });

  storage = new CloudinaryStorage({
    cloudinary,
    params: {
      folder: CLOUD_FOLDER,
      allowed_formats: ["png", "jpg", "jpeg", "webp", "gif"],
      // Shrink huge phone photos on upload; the original is not kept
      transformation: [{ width: 1600, height: 1600, crop: "limit", quality: "auto" }],
    },
  });
  console.log(`Image storage: Cloudinary (folder "${CLOUD_FOLDER}")`);
} else {
  const uploadDir = path.join(__dirname, "uploads");
  fs.mkdirSync(uploadDir, { recursive: true });
  storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
      const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1e9);
      cb(null, file.fieldname + "-" + uniqueSuffix + path.extname(file.originalname));
    },
  });
  const msg = "Image storage: local ./uploads (set CLOUD_NAME, CLOUD_API_KEY, CLOUD_API_SECRET to use Cloudinary)";
  if (process.env.NODE_ENV === "production") {
    console.warn(`WARNING: ${msg}. Uploaded images will be lost when the server restarts!`);
  } else {
    console.log(msg);
  }
}

const fileFilter = (req, file, cb) => {
  const filetypes = /jpeg|jpg|png|gif|webp/;
  const extOk = filetypes.test(path.extname(file.originalname).toLowerCase());
  const mimeOk = filetypes.test(file.mimetype);
  if (extOk && mimeOk) return cb(null, true);
  const err = new Error("Only image files (jpg, png, webp, gif) are allowed");
  err.statusCode = 400;
  cb(err);
};

const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB
});

// Cloudinary: file.path is the https URL and file.filename is the public_id.
// Disk: expose the file under /uploads.
const fileToImage = (file) => ({
  url: /^https?:\/\//.test(file.path) ? file.path : `/uploads/${file.filename}`,
  filename: file.filename,
});

const isCloudinaryImage = (image) =>
  Boolean(image && image.url && image.filename && image.url.includes("res.cloudinary.com"));

// Best-effort removal of an image that is no longer referenced.
async function deleteImage(image) {
  try {
    if (isCloudinaryImage(image) && cloudinary) {
      await cloudinary.uploader.destroy(image.filename);
    } else if (image && image.url && image.url.startsWith("/uploads/")) {
      await fs.promises.unlink(path.join(__dirname, "uploads", path.basename(image.url)));
    }
  } catch (err) {
    console.error("Failed to delete image:", image && image.filename, err.message || err);
  }
}

module.exports = { cloudinary, useCloudinary, CLOUD_FOLDER, upload, fileToImage, deleteImage };
