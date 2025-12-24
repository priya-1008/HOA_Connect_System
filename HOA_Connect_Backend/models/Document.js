const mongoose = require("mongoose");

const documentSchema = new mongoose.Schema({
  title: { type: String, maxlength: 100 },
  description: { type: String, },
  filePath: { type: String, required: true },
  fileType: { type: String },
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" },
  user: { type: mongoose.Schema.Types.ObjectId, ref: "User" }
}, { timestamps: { createdAt: true, updatedAt: false } });

module.exports = mongoose.model("Document", documentSchema);