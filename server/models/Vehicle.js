const mongoose = require("mongoose");

const vehicleSchema = new mongoose.Schema({
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: [true, "Driver ID is required"],
  },
  make: {
    type: String,
    required: [true, "Vehicle make is required"],
    trim: true,
  },
  model: {
    type: String,
    required: [true, "Vehicle model is required"],
    trim: true,
  },
  year: {
    type: Number,
    required: [true, "Vehicle year is required"],
    min: [1990, "Vehicle year must be 1990 or later"],
    max: [new Date().getFullYear(), "Vehicle year cannot be in the future"],
  },
  registrationNumber: {
    type: String,
    required: [true, "Vehicle registration number is required"],
    uppercase: true,
    trim: true,
    match: [
      /^[0-9A-Z]{2}-[0-9]{4}$/,
      "Registration number must be in format AA-1234",
    ],
  },
  color: {
    type: String,
    trim: true,
  },
  engineSpec: {
    type: String,
    trim: true,
  },
  category: {
    type: String,
    enum: ["Sedan", "Coupe", "Hatchback", "SUV", "Truck", "Other"],
    default: "Other",
  },
  uploads: {
    vehicleRegistration: {
      type: String,
      required: [true, "Vehicle registration document is required"],
    },
    vehiclePhotos: {
      type: [String],
      required: [true, "At least one vehicle photo is required"],
      validate: {
        validator: function (photos) {
          return photos.length >= 1 && photos.length <= 3;
        },
        message: "Must provide 1-3 vehicle photos",
      },
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
});

// Update timestamp on save
vehicleSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Vehicle", vehicleSchema);
