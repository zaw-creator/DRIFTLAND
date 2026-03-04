const express = require("express");
const router = express.Router();
const safetyRequirementsController = require("../controllers/safetyRequirementsController");

// Get all safety requirements
router.get("/", safetyRequirementsController.getAllSafetyRequirements);

// Get safety requirements by category
router.get(
  "/:category",
  safetyRequirementsController.getSafetyRequirementsByCategory,
);

module.exports = router;
