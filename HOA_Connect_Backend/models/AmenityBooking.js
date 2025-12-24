const mongoose = require("mongoose");

const amenityBookingSchema = new mongoose.Schema({
  bookingDate: { type: Date },
  status: { type: String, enum: ['Pending', 'Approved', 'Rejected'], default: 'Pending' },
  amenity: { type: mongoose.Schema.Types.ObjectId, ref: "Amenity" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("AmenityBooking", amenityBookingSchema);