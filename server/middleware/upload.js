const multer = require("multer");
const path = require("path");
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// Cloudinary storage configuration
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: (req, file) => {
    const folderMap = {
      driverLicense:       "driftland/drivers/licenses",
      profilePhoto:        "driftland/drivers/profiles",
      vehicleRegistration: "driftland/vehicles/registrations",
      vehiclePhotos:       "driftland/vehicles/photos",
    };

    const sanitizedName = file.originalname
      .replace(/[^a-zA-Z0-9.-]/g, "_")
      .replace(/\.[^/.]+$/, ""); // strip extension — Cloudinary manages it

    return {
      folder:        folderMap[file.fieldname] || "driftland/misc",
      public_id:     `${sanitizedName}-${Date.now()}`,
      resource_type: "auto", // handles both images and PDFs
    };
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(
    path.extname(file.originalname).toLowerCase(),
  );
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    return cb(null, true);
  } else {
    cb(new Error("Only .jpg, .jpeg, .png, and .pdf files are allowed"));
  }
};

// Multer configuration
const upload = multer({
  storage: storage,
  limits: {
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 10 * 1024 * 1024, // 5MB default
  },
  fileFilter: fileFilter,
});

// Multiple file upload configuration
const uploadFields = upload.fields([
  { name: "driverLicense", maxCount: 1 },
  { name: "profilePhoto", maxCount: 1 },
  { name: "vehicleRegistration", maxCount: 1 },
  { name: "vehiclePhotos", maxCount: 3 },
]);

// Error handling middleware
const handleUploadError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        success: false,
        error: "File size too large. Maximum size is 5MB",
      });
    }
    if (err.code === "LIMIT_FILE_COUNT") {
      return res.status(400).json({
        success: false,
        error: "Too many files uploaded",
      });
    }
  } else if (err) {
    return res.status(400).json({
      success: false,
      error: err.message,
    });
  }
  next();
};

module.exports = { upload, uploadFields, handleUploadError };
