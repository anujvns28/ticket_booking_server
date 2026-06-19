const express = require("express");
const router = express.Router();

const auth = require("../middleware/authmiddleware");

const {
  reserveSeats,
  confirmBooking,
} = require("../controllers/bookingcontroller");

router.post("/reserve", auth, reserveSeats);
router.post("/bookings", auth, confirmBooking);

module.exports = router;