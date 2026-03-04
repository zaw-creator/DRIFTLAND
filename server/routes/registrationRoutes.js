const express = require("express");
const router = express.Router();
const registrationController = require("../controllers/registrationController");
const { uploadFields, handleUploadError } = require("../middleware/upload");

// Create new registration (with file uploads)
router.post(
  "/",
  uploadFields,
  handleUploadError,
  registrationController.createRegistration,
);

// Update registration (requires magic token)
router.put(
  "/:id",
  uploadFields,
  handleUploadError,
  registrationController.updateRegistration,
);

// Lookup registration by registration number and email
// IMPORTANT: Must come BEFORE /:id route to avoid "lookup" being treated as an ID
router.get("/lookup", registrationController.lookupRegistration);

// Get registration by ID (requires magic token)
router.get("/:id", registrationController.getRegistration);

// Update registration (requires magic token)
router.put("/:id", registrationController.updateRegistration);

// Update registration status (admin endpoint - placeholder)
router.patch("/:id/status", registrationController.updateRegistrationStatus);

module.exports = router;
