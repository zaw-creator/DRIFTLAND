const Driver = require("../models/Driver");
const Vehicle = require("../models/Vehicle");
const Registration = require("../models/Registration");
const Event = require("../models/Event");
const emailService = require("../services/emailService");
const qrcodeService = require("../services/qrcodeService");

// Create new registration
exports.createRegistration = async (req, res) => {
  try {
    console.log("=== Registration Request Received ===");
    console.log("Body keys:", Object.keys(req.body));
    console.log("Files:", req.files ? Object.keys(req.files) : "No files");

    // Parse JSON strings from FormData
    let driverData, vehicleData, registrationData;

    try {
      driverData =
        typeof req.body.driver === "string"
          ? JSON.parse(req.body.driver)
          : req.body.driver;
      vehicleData =
        typeof req.body.vehicle === "string"
          ? JSON.parse(req.body.vehicle)
          : req.body.vehicle;
      registrationData =
        typeof req.body.registration === "string"
          ? JSON.parse(req.body.registration)
          : req.body.registration;

      console.log("Parsed driver data:", driverData);
      console.log("Parsed vehicle data:", vehicleData);
      console.log("Parsed registration data:", registrationData);
    } catch (parseError) {
      console.error("Parse error:", parseError);
      return res.status(400).json({
        success: false,
        message: "Invalid data format",
        error: parseError.message,
      });
    }

    const safetyAcknowledged =
      req.body.safetyAcknowledged === "true" ||
      req.body.safetyAcknowledged === true;
    const termsAccepted =
      req.body.termsAccepted === "true" || req.body.termsAccepted === true;

    // Validate required data
    if (!driverData || !vehicleData || !registrationData) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required data: driver, vehicle, or registration information",
      });
    }

    // Validate files were uploaded
    if (!req.files || !req.files["driverLicense"]) {
      return res.status(400).json({
        success: false,
        message: "Required file not uploaded: Driver License is required",
      });
    }

    if (!req.files["vehicleRegistration"]) {
      return res.status(400).json({
        success: false,
        message: "Required file not uploaded: Vehicle Registration is required",
      });
    }

    // Check event exists and is open for registration
    const event = await Event.findById(registrationData.eventId);
    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    if (!event.isRegistrationOpen) {
      return res.status(400).json({
        success: false,
        message: "Event registration is closed or event is full",
      });
    }

    // Validate drive type is available for this event
    if (!event.driveTypes.includes(registrationData.driveType)) {
      return res.status(400).json({
        success: false,
        message: `Drive type ${registrationData.driveType} not available for this event`,
      });
    }

    // Create driver with uploads
    const driver = await Driver.create({
      ...driverData,
      uploads: {
        driverLicense: req.files["driverLicense"]
          ? req.files["driverLicense"][0].path
          : null,
        profilePhoto: req.files["profilePhoto"]
          ? req.files["profilePhoto"][0].path
          : null,
      },
    });

    // Create vehicle with uploads
    const vehiclePhotos = req.files["vehiclePhotos"]
      ? req.files["vehiclePhotos"].map((file) => file.path)
      : [];

    const vehicle = await Vehicle.create({
      make: vehicleData.make,
      model: vehicleData.model,
      year: vehicleData.year,
      registrationNumber: vehicleData.registrationNumber,
      engineSpec: vehicleData.engineSpec,
      color: vehicleData.color,
      driverId: driver._id,
      uploads: {
        vehicleRegistration: req.files["vehicleRegistration"]
          ? req.files["vehicleRegistration"][0].path
          : null,
        vehiclePhotos: vehiclePhotos,
      },
    });

    // Generate registration number
    const registrationNumber = await Registration.generateRegistrationNumber();

    // Create registration
    const registration = new Registration({
      registrationNumber,
      driverId: driver._id,
      vehicleId: vehicle._id,
      eventId: registrationData.eventId,
      driveType: registrationData.driveType,
      previousExperience: registrationData.hasExperience || false,
      specialRequirements: registrationData.specialRequirements || "",
      safetyAcknowledged,
      termsAccepted,
      status: "pending",
    });

    // Generate magic token for secure access
    const magicToken = registration.generateMagicToken();
    await registration.save();

    // Update event registered count
    event.registeredCount += 1;
    await event.save();

    // Generate magic link
    const magicLink = `${process.env.CLIENT_URL}/registration/${registration._id}?token=${magicToken}`;

    // Send email
    try {
      await emailService.sendRegistrationPendingEmail({
        driver,
        registration,
        event,
        magicLink,
      });
      registration.emailSent = true;
      await registration.save();
    } catch (emailError) {
      console.error("Email sending failed:", emailError);
      // Don't fail registration if email fails
    }

    res.status(201).json({
      success: true,
      data: {
        registrationNumber: registration.registrationNumber,
        registrationId: registration._id,
        magicLink,
        status: registration.status,
        message:
          "Registration created successfully. Check your email for details.",
      },
    });
  } catch (error) {
    console.error("Registration creation error:", error);

    // Handle Mongoose validation errors
    if (error.name === "ValidationError") {
      const errors = {};
      Object.keys(error.errors).forEach((key) => {
        errors[key] = error.errors[key].message;
      });
      return res.status(400).json({
        success: false,
        message: "Validation failed",
        errors: errors,
      });
    }

    res.status(500).json({
      success: false,
      message: error.message || "Error creating registration",
    });
  }
};

// Get registration by ID (with magic token verification)
exports.getRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;

    const registration = await Registration.findById(id)
      .populate("driverId")
      .populate("vehicleId")
      .populate("eventId");

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: "Registration not found",
      });
    }

    // Verify magic token
    if (!registration.verifyMagicToken(token)) {
      return res.status(401).json({
        success: false,
        error: "Invalid or expired access token",
      });
    }

    // Reshape response for cleaner frontend access
    const response = {
      _id: registration._id,
      registrationNumber: registration.registrationNumber,
      status: registration.status,
      driveType: registration.driveType,
      previousExperience: registration.previousExperience,
      specialRequirements: registration.specialRequirements,
      registrationDate: registration.registrationDate,
      qrCode: registration.qrCode,
      driver: registration.driverId,
      vehicle: registration.vehicleId,
      event: {
        ...registration.eventId.toObject(),
        canEdit: registration.eventId.canEdit(),
      },
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error fetching registration",
    });
  }
};

// Lookup registration by registration number and email
exports.lookupRegistration = async (req, res) => {
  try {
    const { registrationNumber, email } = req.query;

    if (!registrationNumber || !email) {
      return res.status(400).json({
        success: false,
        error: "Registration number and email are required",
      });
    }

    const registration = await Registration.findOne({ registrationNumber })
      .populate("driverId")
      .populate("vehicleId")
      .populate("eventId");

    if (!registration) {
      return res.status(404).json({
        success: false,
        error: "Registration not found",
      });
    }

    // Verify email matches
    if (registration.driverId.email.toLowerCase() !== email.toLowerCase()) {
      return res.status(401).json({
        success: false,
        error: "Email does not match registration",
      });
    }

    // Generate new magic token
    const magicToken = registration.generateMagicToken();
    await registration.save();

    const magicLink = `${process.env.CLIENT_URL}/registration/${registration._id}?token=${magicToken}`;

    // Reshape response for cleaner frontend access
    const reshapedRegistration = {
      _id: registration._id,
      registrationNumber: registration.registrationNumber,
      status: registration.status,
      driveType: registration.driveType,
      previousExperience: registration.previousExperience,
      specialRequirements: registration.specialRequirements,
      registrationDate: registration.registrationDate,
      qrCode: registration.qrCode,
      driver: registration.driverId,
      vehicle: registration.vehicleId,
      event: {
        ...registration.eventId.toObject(),
        canEdit: registration.eventId.canEdit(),
      },
    };

    res.json({
      success: true,
      data: {
        registration: reshapedRegistration,
        magicLink,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      error: error.message || "Error looking up registration",
    });
  }
};


// Update registration
exports.updateRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { token } = req.query;
    const updates = req.body;

    const registration = await Registration.findById(id).populate("eventId");

    if (!registration) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    if (!registration.verifyMagicToken(token)) {
      return res.status(401).json({ success: false, error: "Invalid or expired access token" });
    }

    if (!registration.eventId.canEdit()) {
      return res.status(403).json({ success: false, error: `Registration cannot be edited within ${registration.eventId.editDeadlineHours} hours of the event` });
    }

    // Update driver info if provided
    if (updates.driver) {
      const driverUpdate = typeof updates.driver === 'string'
        ? JSON.parse(updates.driver)
        : updates.driver;

      if (req.files) {
        if (req.files['driverLicense']) {
          driverUpdate['uploads.driverLicense'] = req.files['driverLicense'][0].path;
        }
        if (req.files['profilePhoto']) {
          driverUpdate['uploads.profilePhoto'] = req.files['profilePhoto'][0].path;
        }
      }

      await Driver.findByIdAndUpdate(registration.driverId, driverUpdate, { runValidators: true });
    }

    // Update vehicle info if provided
    if (updates.vehicle) {
      const vehicleUpdate = typeof updates.vehicle === 'string'
        ? JSON.parse(updates.vehicle)
        : updates.vehicle;

      if (req.files) {
        if (req.files['vehicleRegistration']) {
          vehicleUpdate['uploads.vehicleRegistration'] = req.files['vehicleRegistration'][0].path;
        }
        if (req.files['vehiclePhotos']) {
          vehicleUpdate['uploads.vehiclePhotos'] = req.files['vehiclePhotos'].map(f => f.path);
        }
      }

      await Vehicle.findByIdAndUpdate(registration.vehicleId, vehicleUpdate, { runValidators: true });
    }

    // Update registration info
    if (updates.registration) {
      const regUpdate = typeof updates.registration === 'string'
        ? JSON.parse(updates.registration)
        : updates.registration;
      Object.assign(registration, regUpdate);
      await registration.save();
    }

    res.json({ success: true, message: "Registration updated successfully", data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Error updating registration" });
  }
};

// Admin: Update registration status (trigger notifications)
exports.updateRegistrationStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body;

    const registration = await Registration.findById(id)
      .populate("driverId")
      .populate("vehicleId")
      .populate("eventId");

    if (!registration) {
      return res.status(404).json({ success: false, error: "Registration not found" });
    }

    const oldStatus = registration.status;
    registration.status = status;

    if (status === "verified" && oldStatus !== "verified") {
      const qrResult = await qrcodeService.generateRegistrationQRCode(
        registration.registrationNumber,
        registration.driverId.fullName,
      );

      if (qrResult.success) {
        registration.qrCode = qrResult.qrCode;
      }

      await registration.save();

      try {
        await emailService.sendRegistrationVerifiedEmail({
          driver: registration.driverId,
          registration,
          event: registration.eventId,
          qrCode: registration.qrCode,
        });
      } catch (emailError) {
        console.error("Email sending failed:", emailError);
      }
    } else {
      await registration.save();
    }

    res.json({ success: true, message: "Registration status updated successfully", data: registration });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message || "Error updating registration status" });
  }
};