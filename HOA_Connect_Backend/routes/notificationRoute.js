// const express = require("express");
// const {
//   sendNotificationBySuperAdmin,
//   getAllNotificationsBySuperAdmin,
//   sendNotificationByAdmin,
//   getNotificationsByAdmin
// } = require("../controllers/notificationController");
// const { protect, authorizeRoles } = require("../middleware/authMiddleware");

// const router = express.Router();

// router.post("/sendnotificationbysuperadmin", protect, authorizeRoles("superadmin"), sendNotificationBySuperAdmin);
// router.get("/getnotificationbysuperadmin", protect, authorizeRoles("superadmin"), getAllNotificationsBySuperAdmin);
// router.post("/sendnotificationbyadmin", protect, authorizeRoles("admin"), sendNotificationByAdmin);
// router.get("/getnotificationsbyadmin", protect, authorizeRoles("admin"), getNotificationsByAdmin);

// module.exports = router;

const express = require('express');
const router = express.Router();
const { sendNotification } = require('../controllers/notificationController');
// const verifyToken = require('../middleware/authMiddleware');
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

router.use(protect);

router.post('/send', authorizeRoles("superadmin"), sendNotification);

module.exports = router;