const mongoose = require("mongoose");

const driverSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "Full name is required"],
    trim: true,
    minlength: [2, "Name must be at least 2 characters long"],
  },
  email: {
    type: String,
    required: [true, "Email is required"],
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, "Please provide a valid email"],
  },
  phone: {
    type: String,
    required: [true, "Phone number is required"],
    match: [/^\+?[1-9]\d{1,14}$/, "Please provide a valid phone number"],
  },
  dateOfBirth: {
    type: Date,
    required: [true, "Date of birth is required"],
  },
  licenseNumber: {
    type: String,
    required: [true, "License number is required"],
    uppercase: true,
    trim: true,
  },
  licenseExpiry: {
    type: Date,
    required: [true, "License expiry date is required"],
    validate: {
      validator: function (date) {
        return date > new Date();
      },
      message: "Driver license has expired",
    },
  },
  address: {
    type: String,
    required: [true, "Address is required"],
    trim: true,
  },
  emergencyContact: {
    name: {
      type: String,
      required: [true, "Emergency contact name is required"],
    },
    phone: {
      type: String,
      required: [true, "Emergency contact phone is required"],
    },
  },
  medicalInfo: {
    bloodType: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-", "Unknown"],
      default: "Unknown",
    },
    allergies: {
      type: String,
      trim: true,
    },
    otherConditions: {
      type: String,
      trim: true,
    },
  },
  uploads: {
    driverLicense: {
      type: String,
      required: [true, "Driver license photo is required"],
    },
    profilePhoto: String,
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

// Calculate age from date of birth
driverSchema.virtual("age").get(function () {
  return Math.floor((Date.now() - this.dateOfBirth.getTime()) / 31557600000);
});

// Update timestamp on save
driverSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model("Driver", driverSchema);
