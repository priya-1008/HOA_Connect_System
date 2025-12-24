const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['superadmin','admin','resident'], 
    required: true 
  },
  phoneNo: { type: String },
  houseNumber: { type: String },
  community: { type: mongoose.Schema.Types.ObjectId, ref: 'Community'}, // Links to Community.communityId
  isResident: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);