const express = require("express");
const router = express.Router();
const eventController = require("../controllers/eventController");

// Get all events
router.get("/", eventController.getAllEvents);

// Get single event by ID
router.get("/:id", eventController.getEventById);

// Create new event (admin only - placeholder)
router.post("/", eventController.createEvent);

module.exports = router;
