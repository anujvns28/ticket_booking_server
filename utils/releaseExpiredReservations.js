const Reservation = require("../models/Reservation");
const Seat = require("../models/Seat");

const releaseExpiredReservations = async () => {
  try {
    const expiredReservations =
      await Reservation.find({
        expiresAt: {
          $lt: new Date(),
        },
      });

    for (const reservation of expiredReservations) {
      await Seat.updateMany(
        {
          eventId: reservation.eventId,
          seatNumber: {
            $in: reservation.seatNumbers,
          },
        },
        {
          status: "available",
        }
      );

      await Reservation.findByIdAndDelete(
        reservation._id
      );
    }
  } catch (error) {
    console.log(
      "Release Reservation Error:",
      error.message
    );
  }
};

module.exports = releaseExpiredReservations;