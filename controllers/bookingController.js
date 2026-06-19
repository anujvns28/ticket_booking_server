const Seat = require("../models/Seat");
const Reservation = require("../models/Reservation");
const releaseExpiredReservations = require("../utils/releaseExpiredReservations");
const mongoose = require("mongoose");

exports.reserveSeats = async (req, res) => {
  try {
    await releaseExpiredReservations();

    const { eventId, seatNumbers } = req.body;

    if (
      !eventId ||
      !seatNumbers ||
      seatNumbers.length === 0
    ) {
      return res.status(400).json({
        success: false,
        message: "Please select seats",
      });
    }

    const result = await Seat.updateMany(
      {
        eventId,
        seatNumber: { $in: seatNumbers },
        status: "available",
      },
      {
        $set: {
          status: "reserved",
        },
      }
    );

    if (result.modifiedCount !== seatNumbers.length) {
      return res.status(400).json({
        success: false,
        message: "Some seats are no longer available",
      });
    }

    const expiresAt = new Date(
      Date.now() + 10 * 60 * 1000
    );

    const reservation = await Reservation.create({
      userId: req.user.id,
      eventId,
      seatNumbers,
      expiresAt,
    });

    return res.status(200).json({
      success: true,
      message: "Seats reserved successfully",
      reservation,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};


exports.confirmBooking = async (req, res) => {
  try {
    await releaseExpiredReservations();

    const { reservationId } = req.body;

    if (!reservationId) {
      return res.status(400).json({
        success: false,
        message: "Reservation ID is required",
      });
    }
    

    const reservation = await Reservation.findById(
      reservationId
    );

    if (!reservation) {
      return res.status(404).json({
        success: false,
        message:
          "Reservation expired or not found",
      });
    }

    if (
  reservation.userId.toString() !==
  req.user.id
) {
  return res.status(403).json({
    success: false,
    message: "Unauthorized",
  });
}

    if (
      reservation.expiresAt < new Date()
    ) {
      return res.status(400).json({
        success: false,
        message: "Reservation expired",
      });
    }

    const result = await Seat.updateMany(
      {
        eventId: reservation.eventId,
        seatNumber: {
          $in: reservation.seatNumbers,
        },
        status: "reserved",
      },
      {
        $set: {
          status: "booked",
        },
      }
    );

    if (
      result.modifiedCount !==
      reservation.seatNumbers.length
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Some seats are no longer available",
      });
    }

    await Reservation.findByIdAndDelete(
      reservation._id
    );

    res.status(200).json({
      success: true,
      message:
        "Booking confirmed successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};