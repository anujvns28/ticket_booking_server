const express = require("express");

const {
  getAllEvents,
  getSingleEvent,
  createEvent,
} = require("../controllers/eventController");

const router = express.Router();

router.get("/", getAllEvents);

router.get("/:id", getSingleEvent);

router.post("/", createEvent);

module.exports = router;