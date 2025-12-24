const mongoose = require('mongoose');

const CommunitySchema = new mongoose.Schema({
  name: { type: String, required: true },
  address: { type: String, required: true },
  amenities: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Amenity' }],
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User'}, // Admin who manages community
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

CommunitySchema.pre('save', function (next) {
  this.updatedAt = Date.now();
  next();
});

module.exports = mongoose.model('Community', CommunitySchema);