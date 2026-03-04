const mongoose = require("mongoose");
const crypto = require("crypto");

const registrationSchema = new mongoose.Schema({
  registrationNumber: {
    type: String,
    unique: true,
    required: true,
    // Format: DR-YYYY-#### (e.g., DR-2026-0001)
  },
  driverId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Driver",
    required: [true, "Driver ID is required"],
  },
  vehicleId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Vehicle",
    required: [true, "Vehicle ID is required"],
  },
  eventId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Event",
    required: [true, "Event ID is required"],
  },
  driveType: {
    type: String,
    enum: ["Drift", "Time Attack","Both"],
    required: [true, "Drive type is required"],
  },
  competitionClass: {
    type: String,
    default: "pending",
  },
  previousExperience: {
    type: Boolean,
    default: false,
  },
  specialRequirements: {
    type: String,
    maxlength: [500, "Special requirements cannot exceed 500 characters"],
    trim: true,
  },
  safetyAcknowledged: {
    type: Boolean,
    required: [true, "Safety requirements must be acknowledged"],
    validate: {
      validator: function (v) {
        return v === true;
      },
      message: "Safety requirements must be acknowledged",
    },
  },
  termsAccepted: {
    type: Boolean,
    required: [true, "Terms and conditions must be accepted"],
    validate: {
      validator: function (v) {
        return v === true;
      },
      message: "Terms and conditions must be accepted",
    },
  },
  status: {
    type: String,
    enum: ["pending", "verified", "rejected", "cancelled"],
    default: "pending",
  },
  qrCode: {
    type: String,
  },
  magicToken: {
    type: String,
    unique: true,
    sparse: true,
  },
  magicTokenExpiry: {
    type: Date,
  },
  registrationDate: {
    type: Date,
    default: Date.now,
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
  emailSent: {
    type: Boolean,
    default: false,
  },
  smsSent: {
    type: Boolean,
    default: false,
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

// Generate registration number (DR-YYYY-####)
registrationSchema.statics.generateRegistrationNumber = async function () {
  const year = new Date().getFullYear();
  const prefix = `DR-${year}-`;

  // Find the last registration number for this year
  const lastRegistration = await this.findOne({
    registrationNumber: new RegExp(`^${prefix}`),
  }).sort({ registrationNumber: -1 });

  let nextNumber = 1;
  if (lastRegistration) {
    const lastNumber = parseInt(
      lastRegistration.registrationNumber.split("-")[2],
    );
    nextNumber = lastNumber + 1;
  }

  // Pad with zeros (0001, 0002, etc.)
  return `${prefix}${String(nextNumber).padStart(4, "0")}`;
};

// Generate magic token
registrationSchema.methods.generateMagicToken = function () {
  const token = crypto.randomBytes(32).toString("hex");
  this.magicToken = token;

  const expiryDays = parseInt(process.env.MAGIC_TOKEN_EXPIRY_DAYS) || 7;
  this.magicTokenExpiry = new Date(
    Date.now() + expiryDays * 24 * 60 * 60 * 1000,
  );

  return token;
};

// Verify magic token
registrationSchema.methods.verifyMagicToken = function (token) {
  return this.magicToken === token && this.magicTokenExpiry > new Date();
};

// Update timestamp on save
registrationSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  this.lastModified = Date.now();
  next();
});

// Create indexes (registrationNumber and magicToken already indexed via unique: true)
registrationSchema.index({ driverId: 1 });
registrationSchema.index({ eventId: 1 });
registrationSchema.index({ status: 1 });

module.exports = mongoose.model("Registration", registrationSchema);
