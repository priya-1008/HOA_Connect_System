const mongoose = require('mongoose');

const ComplaintSchema = new mongoose.Schema({
  subject: { type: String, required: true, maxlength: 100 },
  description: { type: String, required: true, maxlength: 500 },
  status: {
    type: String,
    enum: ['Pending', 'In Progress', 'Resolved'],
    default: 'Pending'   
  },  
  community: { type: mongoose.Schema.Types.ObjectId, ref: "Community" }, // Links to Community.communityId
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdAt: { type: Date, default: Date.now},
  updatedAt: { type: Date, default: Date.now}
}, 
);

module.exports = mongoose.model('Complaint', ComplaintSchema);