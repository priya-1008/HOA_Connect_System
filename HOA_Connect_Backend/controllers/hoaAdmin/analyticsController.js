const Complaint = require('../../models/Complaint');
const Payment = require('../../models/Payment');
const Amenity = require('../../models/Amenity');

exports.getAnalytics = async (req, res) => {
  try {
    const community = req.user.community;
    const complaints = await Complaint.countDocuments({ community });
    const payments = await Payment.find({ community });
    const totalCollected = payments.reduce((sum, p) => (p.status === 'completed' ? sum + p.amount : sum), 0);
    const availableAmenities = await Amenity.countDocuments({ community, status: 'available' });

    res.json({ complaints, totalCollected, availableAmenities });
  } catch (err) {
    res.status(500).json({ message: 'Error fetching analytics', error: err.message });
  }
};