const mongoose = require("mongoose");

const meetingAttendeeSchema = new mongoose.Schema({
  status: {
    type: String,
    enum: ["confirmed", "declined", "pending"],
    default: "pending"
  },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  meetingId: { type: mongoose.Schema.Types.ObjectId, ref: "Meeting" }
});

module.exports = mongoose.model("MeetingAttendee", meetingAttendeeSchema);