const express = require("express");
const { getAnalyticsForSuperAdmin, getAnalyticsForAdmin } = require("../controllers/reportController");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/getanalytics", protect, authorizeRoles("superadmin"), getAnalyticsForSuperAdmin);
router.get("/getcommunityanalytics", protect, authorizeRoles("admin"), getAnalyticsForAdmin);

module.exports = router;