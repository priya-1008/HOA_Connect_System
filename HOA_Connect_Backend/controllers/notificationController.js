// const Notification = require("../models/Notification");
// const User = require("../models/User");

// exports.sendNotificationBySuperAdmin = async (req, res) => {
//   try {
//     const { title, message } = req.body;
//     const users = await User.find({}, "_id");
//     const notification = await Notification.create({
//       title,
//       message,
//       recipients: users.map(u => u._id),
//       createdBy: req.user.id,
//     });
//     res.status(201).json({ 
//       success: true, 
//       data: {
//         id: notification._id,
//         title: notification.title,
//         message: notification.message,
//         recipients: notification.recipients,
//         createdBy: req.user.name || req.user.email,
//         createdAt: notification.createdAt,
//     }, });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.getAllNotificationsBySuperAdmin = async (req, res) => {
//   try {
//     const notifications = await Notification.find().sort({ createdAt: -1 });
//     res.status(200).json({ success: true, data: notifications });
//   } catch (error) {
//     res.status(500).json({ success: false, message: error.message });
//   }
// };

// exports.sendNotificationByAdmin = async (req, res) => {
//   try {
//     const { title, message } = req.body;

//     const notification = await Notification.create({
//       title,
//       message,
//       communityId: req.user.communityId,
//       sender: req.user._id
//     });

//     res.status(201).json({
//       success: true,
//       message: "Notification sent successfully",
//       data: {
//         id: notification._id,
//         title: notification.title,
//         message: notification.message,
//         communityId: notification.communityId,
//         createdBy: req.user.name || req.user.email,
//         createdAt: notification.createdAt,
//       }, 
//   });
//   } catch (err) {
//     res.status(400).json({ message: err.message });
//   }
// };

// exports.getNotificationsByAdmin = async (req, res) => {
//   try {
//     const notifications = await Notification.find({ communityId: req.user.communityId });
//     res.json(notifications);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };

const Notification = require('../models/Notification');
const User = require('../models/User');
const { sendEmail, sendSMS, sendWhatsApp } = require('../services/notificationService');

exports.sendNotification = async (req, res) => {
  try {
    const { title, message, channels } = req.body;
    const createdBy = req.user.id; // Super Admin ID from JWT

    if (!channels || channels.length === 0) {
      return res.status(400).json({ message: "Please select at least one channel (email, sms, whatsapp)" });
    }

    // Get all HOA Admins across all communities
    const admins = await User.find({ role: 'admin' });

    if (!admins.length) {
      return res.status(404).json({ message: "No HOA Admins found" });
    }

    // Create notification record in DB
    const notification = await Notification.create({
      title,
      message,
      recipients: admins.map(a => a._id),
      createdBy,
      channels
    });

    // Send notifications to each admin
    for (const admin of admins) {
      if (channels.includes('email') && admin.email) {
        await sendEmail(admin.email, title, message);
      }
      if (channels.includes('sms') && admin.phoneNo) {
        await sendSMS(`+91${admin.phoneNo}`, `${title}: ${message}`);
      }
      if (channels.includes('whatsapp') && admin.phoneNo) {
        await sendWhatsApp(`+91${admin.phoneNo}`, `${title}: ${message}`);
      }
    }

    res.status(200).json({
      message: `Notification broadcasted to ${admins.length} HOA Admins via ${channels.join(', ')}`,
      notification
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error broadcasting notification", error: error.message });
  }
};