const Meeting = require('../../models/Meeting');

exports.createMeeting = async (req, res) => {
  try {
    const { title, agenda, location, meetingDate } = req.body;
    const meeting = new Meeting({
      title,
      description: agenda,
      meetingDate,
      location,
      community: req.user.community,
      user: req.user._id
    });
    await meeting.save();
    res.json(meeting);
  } catch (err) {
    res.status(500).json({ message: 'Error creating meeting', error: err.message });
  }
};

exports.getMeetings = async (req, res) => {
  try {
    const meetings = await Meeting.find({ community: req.user.community }).sort({ startsAt: -1 });
    res.json(meetings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching meetings', error: err.message });
  }
};