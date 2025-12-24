const User = require("../models/User");
const Payment = require("../models/Payment");
const Complaint = require("../models/Complaint");

exports.getAnalyticsForSuperAdmin = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalPayments = await Payment.countDocuments();
    const totalRevenue = await Payment.aggregate([
      { $match: { status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const monthlyData = await Payment.aggregate([
      { $match: { status: "Completed" } },
      {
        $group: {
          _id: { $month: "$transactionDate" },
          total: { $sum: "$amount" },
        },
      },
      { $sort: { "_id": 1 } },
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalUsers,
        totalPayments,
        totalRevenue: totalRevenue[0]?.total || 0,
        monthlyData,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

exports.getAnalyticsForAdmin = async (req, res) => {
  try {
    const totalComplaints = await Complaint.countDocuments({ community: req.user.community });
    const resolvedComplaints = await Complaint.countDocuments({ community: req.user.community, status: "Resolved" });

    const totalPayments = await Payment.countDocuments({ community: req.user.community });
    const paidPayments = await Payment.countDocuments({ community: req.user.community, status: "Paid" });

    res.json({
      complaints: { total: totalComplaints, resolved: resolvedComplaints },
      payments: { total: totalPayments, paid: paidPayments }
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};