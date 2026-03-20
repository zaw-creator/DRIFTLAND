const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const apiKeyMiddleware = require('../middleware/apiKey');

// Get all events
router.get("/", eventController.getAllEvents);

// Get single event by ID
router.get("/:id", eventController.getEventById);

// Create new event (admin only - placeholder)
router.post("/", eventController.createEvent);

// register-server/routes/events.js — add these 3 routes


// Main site pulls approved drivers for a given event
router.get('/:id/approved-drivers', apiKeyMiddleware, async (req, res) => {
  const registrations = await Registration.find({
    eventId:       req.params.id,
    status:        'approved',
    paymentStatus: 'paid',
  }).populate('driverId', 'fullName licenseNumber');

  const drivers = registrations.map(r => ({
    driverId:      r.driverId._id.toString(),
    driverName:    r.driverId.fullName,
    licenseNumber: r.driverId.licenseNumber,
    driveType:     r.driveType,
    class:         r.class,
  }));

  res.json(drivers);
});

// Main site fetches full leaderboard for display
router.get('/:id/leaderboard', async (req, res) => {
  const registrations = await Registration.find({
    eventId: req.params.id,
    status:  'approved',
  }).populate('driverId', 'fullName licenseNumber').sort({ qualifyRank: 1 });

  const leaderboard = registrations.map(r => ({
    driverId:      r.driverId._id,
    driverName:    r.driverId.fullName,
    licenseNumber: r.driverId.licenseNumber,
    driveType:     r.driveType,
    class:         r.class,
    qualifyScore:  r.qualifyScore || 0,
    qualifyRank:   r.qualifyRank  || 0,
    wins:          r.wins         || 0,
    losses:        r.losses       || 0,
    eliminated:    r.eliminated   || false,
  }));

  res.json(leaderboard);
});

// Main site pushes results when event ends
router.post('/:id/results', apiKeyMiddleware, async (req, res) => {
  const { scores, bracket, safetyRules, top5, endedAt } = req.body;

  // Merge scores onto existing registrations
  for (const score of scores) {
    await Registration.findOneAndUpdate(
      { eventId: req.params.id, driverId: score.driverId },
      {
        $set: {
          qualifyScore: score.qualifyScore,
          qualifyRank:  score.qualifyRank,
          wins:         score.wins,
          losses:       score.losses,
          eliminated:   score.eliminated,
          finalResult:  score.eliminated ? 'eliminated' : 'active',
        },
      }
    );
  }

  // Store bracket + meta on the event
  await Event.findByIdAndUpdate(req.params.id, {
    $set: {
      finalBracket:    bracket,
      safetyRules:     safetyRules,
      top5:            top5,
      endedAt:         endedAt,
      resultsPushedAt: new Date(),
    },
  });

  res.json({ success: true });
});

module.exports = router;
