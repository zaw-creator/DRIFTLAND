const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");
const Registration = require("../models/Registration");
const Event = require("../models/Event");

// ── API key middleware ─────────────────────────────────────────────────────────
function apiKeyMiddleware(req, res, next) {
  const key = req.headers['x-api-key'];
  if (!key || key !== process.env.MAIN_API_KEY) {
    return res.status(401).json({ success: false, error: 'Unauthorized' });
  }
  next();
}

// ── existing routes ───────────────────────────────────────────────────────────
router.get("/", eventController.getAllEvents);
router.get("/:id", eventController.getEventById);
router.post("/", eventController.createEvent);

// ── approved drivers for main site ───────────────────────────────────────────
router.get('/:id/approved-drivers', apiKeyMiddleware, async (req, res) => {
  try {
    const registrations = await Registration.find({
      eventId: req.params.id,
      status:  'verified',
    })
    .populate('driverId', 'fullName licenseNumber')
    .populate('vehicleId', 'make model year engineSpec');

    const drivers = [];

    registrations
      .filter(r => r.driverId)
      .forEach(r => {
        const base = {
          driverId:      r.driverId._id.toString(),
          driverName:    r.driverId.fullName,
          licenseNumber: r.driverId.licenseNumber,
          car:           r.vehicleId
            ? `${r.vehicleId.make} ${r.vehicleId.model} ${r.vehicleId.year}`
            : '—',
          stickerNumber: r.stickerNumber || '—',
          qualifyScore:  r.qualifyScore  || 0,
          qualifyRank:   r.qualifyRank   || 0,
          wins:          r.wins          || 0,
          losses:        r.losses        || 0,
          eliminated:    r.eliminated    || false,
        };

        const rawCategory = r.category || '';
        const driveType   = r.driveType;

        if (driveType === 'Both') {
          // Format: "Drift: Class A, Class B | Time Attack: Class AWD, Class RWD"
          const sections = rawCategory.split('|').map(s => s.trim());

          sections.forEach(section => {
            if (section.startsWith('Drift:')) {
              const classes = section
                .replace('Drift:', '')
                .split(',')
                .map(c => c.trim())
                .filter(Boolean);
              classes.forEach(cls => {
                drivers.push({ ...base, driveType: 'Drift', class: cls });
              });
            } else if (section.startsWith('Time Attack:')) {
              const classes = section
                .replace('Time Attack:', '')
                .split(',')
                .map(c => c.trim())
                .filter(Boolean);
              classes.forEach(cls => {
                drivers.push({ ...base, driveType: 'Time Attack', class: cls });
              });
            }
          });

        } else if (driveType === 'Drift') {
          // Format: "Class A, Class B"
          const classes = rawCategory
            .split(',')
            .map(c => c.trim())
            .filter(Boolean);

          if (classes.length > 0) {
            classes.forEach(cls => {
              drivers.push({ ...base, driveType: 'Drift', class: cls });
            });
          } else {
            drivers.push({ ...base, driveType: 'Drift', class: 'Unassigned' });
          }

        } else if (driveType === 'Time Attack') {
          // Format: "Class FWD" or "Class AWD, Class RWD"
          const classes = rawCategory
            .split(',')
            .map(c => c.trim())
            .filter(Boolean);

          if (classes.length > 0) {
            classes.forEach(cls => {
              drivers.push({ ...base, driveType: 'Time Attack', class: cls });
            });
          } else {
            drivers.push({ ...base, driveType: 'Time Attack', class: 'Unassigned' });
          }
        }
      });

    res.json({ success: true, data: drivers });
  } catch (err) {
    console.error('approved-drivers error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── full leaderboard for main site display ────────────────────────────────────
router.get('/:id/leaderboard', async (req, res) => {
  try {
    const registrations = await Registration.find({
      eventId: req.params.id,
      status:  'verified',
    })
    .populate('driverId', 'fullName licenseNumber')
    .populate('vehicleId', 'make model year')
    .sort({ qualifyRank: 1 });

    const leaderboard = registrations
      .filter(r => r.driverId)
      .map(r => ({
        driverId:      r.driverId._id.toString(),
        driverName:    r.driverId.fullName,
        licenseNumber: r.driverId.licenseNumber,
        driveType:     r.driveType,
        class:         r.category,
        car:           r.vehicleId
          ? `${r.vehicleId.make} ${r.vehicleId.model} ${r.vehicleId.year}`
          : '—',
        stickerNumber: r.stickerNumber || '—',
        qualifyScore:  r.qualifyScore  || 0,
        qualifyRank:   r.qualifyRank   || 0,
        wins:          r.wins          || 0,
        losses:        r.losses        || 0,
        eliminated:    r.eliminated    || false,
      }));

    res.json({ success: true, data: leaderboard });
  } catch (err) {
    console.error('leaderboard error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

// ── receive results push from main site when event ends ───────────────────────
router.post('/:id/results', apiKeyMiddleware, async (req, res) => {
  try {
    const { scores, bracket, safetyRules, top5, endedAt } = req.body;

    // Merge scores onto existing registrations
    if (scores?.length) {
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
    }

    // Store bracket + meta on the event
    await Event.findByIdAndUpdate(req.params.id, {
      $set: {
        finalBracket:    bracket     ?? [],
        safetyRules:     safetyRules ?? [],
        top5:            top5        ?? [],
        endedAt:         endedAt,
        resultsPushedAt: new Date(),
      },
    });

    res.json({ success: true });
  } catch (err) {
    console.error('results push error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;