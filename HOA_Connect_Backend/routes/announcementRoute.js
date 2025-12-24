const express = require("express");
const { protect, authorizeRoles } = require("../middleware/authMiddleware");
const { createAnnouncement, getAnnouncements, getAnnouncementsByCommunity } = require("../controllers/announcementController");
const router = express.Router();

router.post("/addannouncement", protect, authorizeRoles("admin"), createAnnouncement);
router.get("/getannouncements", protect, authorizeRoles("admin"), getAnnouncements);
router.get("/getannouncementsbycommunity/:communityId", getAnnouncementsByCommunity);

module.exports = router;