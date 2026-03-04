const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const adminAuth = require('../middleware/adminAuth');
const Registration = require('../models/Registration');

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
    const registration = await Registration.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true }
    );
    if (!registration) {
      return res.status(404).json({ message: 'Registration not found' });
    }
    res.json(registration);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;