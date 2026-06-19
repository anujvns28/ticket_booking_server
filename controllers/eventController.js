const Event = require("../models/Event");
const Seat = require("../models/Seat");
const releaseExpiredReservations = require("../utils/releaseExpiredReservations");

exports.getAllEvents = async (req, res) => {
  try {
    const events = await Event.find();

    res.status(200).json({
      success: true,
      events,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.getSingleEvent = async (req, res) => {
  try {

    await releaseExpiredReservations();

    
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({
        success: false,
        message: "Event not found",
      });
    }

    const seats = await Seat.find({
      eventId: event._id,
    });

    res.status(200).json({
      success: true,
      event,
      seats,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};

exports.createEvent = async (req, res) => {
  try {
    const {
      name,
      venue,
      date,
      totalSeats,
    } = req.body;

    if (
      !name ||
      !venue ||
      !date ||
      !totalSeats
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const event = await Event.create({
      name,
      venue,
      date,
      totalSeats,
    });

    const seats = [];

    for (let i = 1; i <= totalSeats; i++) {
      seats.push({
        eventId: event._id,
        seatNumber: `A${i}`,
        status: "available",
      });
    }

    await Seat.insertMany(seats);

    res.status(201).json({
      success: true,
      message: "Event created successfully",
      event,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
};