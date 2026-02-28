const mongoose = require("mongoose");

const safetyRequirementsSchema = new mongoose.Schema({
  category: {
    type: String,
    enum: ["safety-wear", "car-components", "terms-conditions"],
    required: true,
    unique: true,
  },
  title: {
    type: String,
    required: true,
  },
  items: [
    {
      title: {
        type: String,
        required: true,
      },
      description: {
        type: String,
      },
      required: {
        type: Boolean,
        default: true,
      },
      order: {
        type: Number,
        required: true,
      },
    },
  ],
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  updatedBy: {
    type: String,
    default: "system",
  },
});

// Update timestamp on save
safetyRequirementsSchema.pre("save", function (next) {
  this.lastUpdated = Date.now();
  next();
});

module.exports = mongoose.model("SafetyRequirements", safetyRequirementsSchema);
