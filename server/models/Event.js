const mongoose = require("mongoose");

const eventSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Event name is required"],
    trim: true,
  },
  description: {
    type: String,
    trim: true,
  },
  eventDate: {
    type: Date,
    required: [true, "Event date is required"],
  },
  location: {
    type: String,
    required: [true, "Event location is required"],
    trim: true,
  },
  capacity: {
    type: Number,
    required: [true, "Event capacity is required"],
    min: [1, "Capacity must be at least 1"],
    default: 100,
  },
  registeredCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  waitlistCount: {
    type: Number,
    default: 0,
    min: 0,
  },
  driveTypes: [
    {
      type: String,
      enum: ["Drift", "Time Attack"],
      required: true,
    },
  ],
  registrationDeadline: {
    type: Date,
    required: [true, "Registration deadline is required"],
  },
  editDeadlineHours: {
    type: Number,
    default: 24,
    min: [0, "Edit deadline hours cannot be negative"],
  },
  status: {
    type: String,
    enum: ["upcoming", "ongoing", "completed", "cancelled"],
    default: "upcoming",
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

// Check if event is full
eventSchema.virtual("isFull").get(function () {
  return this.registeredCount >= this.capacity;
});

// Check if registration is still open
eventSchema.virtual("isRegistrationOpen").get(function () {
  return (
    this.status === "upcoming" &&
    new Date() < this.registrationDeadline &&
    !this.isFull
  );
});

// Check if editing is allowed (based on hours before event)
eventSchema.methods.canEdit = function () {
  const hoursBeforeEvent = (this.eventDate - Date.now()) / (1000 * 60 * 60);
  return hoursBeforeEvent > this.editDeadlineHours;
};

// Update timestamp on save
eventSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

// Enable virtuals in JSON
eventSchema.set("toJSON", { virtuals: true });
eventSchema.set("toObject", { virtuals: true });

module.exports = mongoose.model("Event", eventSchema);
