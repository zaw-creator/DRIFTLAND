const multer = require("multer");
const path = require("path");
const fs = require("fs");

// Ensure upload directories exist
const uploadDirs = [
  "uploads/drivers/licenses",
  "uploads/drivers/profiles",
  "uploads/vehicles/registrations",
  "uploads/vehicles/photos",
];

uploadDirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
});

// Storage configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let uploadPath = "uploads/";

    // Determine destination based on field name
    if (file.fieldname === "driverLicense") {
      uploadPath += "drivers/licenses";
    } else if (file.fieldname === "profilePhoto") {
      uploadPath += "drivers/profiles";
    } else if (file.fieldname === "vehicleRegistration") {
      uploadPath += "vehicles/registrations";
    } else if (file.fieldname === "vehiclePhotos") {
      uploadPath += "vehicles/photos";
    }

    cb(null, uploadPath);
  },
  filename: function (req, file, cb) {
    // Sanitize filename
    const sanitizedName = file.originalname.replace(/[^a-zA-Z0-9.-]/g, "_");
    const timestamp = Date.now();
    const ext = path.extname(sanitizedName);
    const nameWithoutExt = path.basename(sanitizedName, ext);

    cb(null, `${nameWithoutExt}-${timestamp}${ext}`);
  },
});

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
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
    fileSize: parseInt(process.env.MAX_FILE_SIZE) || 5 * 1024 * 1024, // 5MB default
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
