const Booking = require("../models/Booking");
const mongoose = require("mongoose");

// POST /bookings - create a booking
exports.createBooking = async (req, res) => {
  try {
    const {
      userId,
      listingId,
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
    } = req.body;

    // Basic validation
    if (
      !userId ||
      !listingId ||
      !checkInDate ||
      !checkOutDate ||
      !numberOfGuests ||
      !totalPrice
    ) {
      return res
        .status(400)
        .json({ message: "Missing required booking information" });
    }

    // Validate userId and listingId as ObjectId
    if (
      !mongoose.Types.ObjectId.isValid(userId) ||
      !mongoose.Types.ObjectId.isValid(listingId)
    ) {
      return res.status(400).json({ message: "Invalid userId or listingId" });
    }

    // Validate dates
    const checkIn = new Date(checkInDate);
    const checkOut = new Date(checkOutDate);
    const today = new Date();

    if (checkIn < today) {
      return res
        .status(400)
        .json({ message: "Check-in date cannot be in the past" });
    }

    if (checkOut <= checkIn) {
      return res
        .status(400)
        .json({ message: "Check-out date must be after check-in date" });
    }

    // Create new booking in database
    const newBooking = new Booking({
      userId: new mongoose.Types.ObjectId(userId),
      listingId: new mongoose.Types.ObjectId(listingId),
      checkInDate,
      checkOutDate,
      numberOfGuests,
      totalPrice,
      status: "confirmed",
    });

    await newBooking.save();

    return res.status(201).json({
      message: "Booking created successfully",
      booking: newBooking,
    });
  } catch (error) {
    console.error("Error creating booking:", error);
    return res.status(500).json({ message: "Failed to create booking" });
  }
};

// GET /bookings/user/:id - get bookings for a user
exports.getBookingsByUser = async (req, res) => {
  try {
    const { id } = req.params;
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: "Invalid user id" });
    }
    const userBookings = await Booking.find({
      userId: new mongoose.Types.ObjectId(id),
    }).populate("listingId", "title location images");
    return res.json({ bookings: userBookings });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    return res.status(500).json({ message: "Failed to fetch bookings" });
  }
};
