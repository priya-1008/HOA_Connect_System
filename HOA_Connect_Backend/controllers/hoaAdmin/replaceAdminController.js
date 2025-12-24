const User = require('../../models/User');
const Community = require('../../models/Community');

exports.replaceAdmin = async (req, res) => {
  try {
    const { newUser } = req.body;
    const community = req.user.community;

    const newAdmin = await User.findOne({ _id: newUser, community });
    if (!newAdmin) return res.status(404).json({ message: 'New admin must be from same community' });

    const currentAdmin = await User.findById(req.user._id);
    currentAdmin.role = 'admin';
    await currentAdmin.save();

    newAdmin.role = 'admin';
    await newAdmin.save();

    await Community.findByIdAndUpdate(community, { admin: newAdmin._id });

    res.json({ message: 'Admin replaced successfully', newAdmin });
  } catch (err) {
    res.status(500).json({ message: 'Error replacing admin', error: err.message });
  }
};