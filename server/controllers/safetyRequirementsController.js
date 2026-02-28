const SafetyRequirements = require("../models/SafetyRequirements");

// Get all safety requirements
exports.getAllSafetyRequirements = async (req, res) => {
  try {
    const requirements = await SafetyRequirements.find().sort({ category: 1 });

    // Format for easier consumption
    const formatted = {
      safetyWear:
        requirements.find((r) => r.category === "safety-wear") || null,
      carComponents:
        requirements.find((r) => r.category === "car-components") || null,
      termsConditions:
        requirements.find((r) => r.category === "terms-conditions") || null,
    };

    res.json({
      success: true,
      data: formatted,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching safety requirements",
    });
  }
};

// Get safety requirements by category
exports.getSafetyRequirementsByCategory = async (req, res) => {
  try {
    const { category } = req.params;

    const requirements = await SafetyRequirements.findOne({ category });

    if (!requirements) {
      return res.status(404).json({
        success: false,
        error: "Safety requirements category not found",
      });
    }

    res.json({
      success: true,
      data: requirements,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching safety requirements",
    });
  }
};
