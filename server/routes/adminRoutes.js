const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const Registration = require('../models/Registration');
const emailService = require('../services/emailService');
const qrcodeService = require('../services/qrcodeService');
const Driver = require('../models/Driver');
const Event = require('../models/Event');

// Login
router.post('/login', (req, res) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    password !== process.env.ADMIN_PASSWORD
  ) {
    return res.status(401).json({ message: 'Invalid credentials' });
  }

  const token = jwt.sign(
    { username, isAdmin: true },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );

  res.json({ token });
});


// Get all registrations
router.get('/registrations', adminAuth, async (req, res) => {
  try {
    const registrations = await Registration.find()
      .populate('eventId', 'name eventDate')
      .populate('driverId', 'fullName email phone')
      .sort({ createdAt: -1 });
    res.json(registrations);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get registration by ID
// Get single registration
router.get('/registrations/:id', adminAuth, async (req, res) => {
  try {
    const registration = await Registration.findById(req.params.id)
      .populate('eventId', 'name eventDate location')
      .populate('driverId')
      .populate('vehicleId');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update registration status
router.patch('/registrations/:id/status', adminAuth, async (req, res) => {
  try {
    const { status } = req.body;

    const validStatuses = ['pending', 'verified', 'rejected', 'cancelled'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const registration = await Registration.findById(req.params.id)
      .populate('driverId')
      .populate('vehicleId')
      .populate('eventId');

    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }

    const oldStatus = registration.status;
    registration.status = status;

    // If status changed to verified, generate QR and send email
    if (status === 'verified' && oldStatus !== 'verified') {
      console.log('=== Generating QR code and sending verification email...');
      
      try {
        const qrResult = await qrcodeService.generateRegistrationQRCode(
          registration.registrationNumber,
          registration.driverId.fullName,
        );

        if (qrResult.success) {
          registration.qrCode = qrResult.qrCode;
        }
      } catch (qrError) {
        console.error('QR generation failed:', qrError);
      }

      await registration.save();

     emailService.sendRegistrationVerifiedEmail({
  driver: registration.driverId,
  registration,
  event: registration.eventId,
  qrCode: registration.qrCode,
}).then(() => {
  console.log('=== Verification email sent!');
}).catch((emailError) => {
  console.error('=== Verification email failed:', emailError);
});
    } else {
      await registration.save();
    }

    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;