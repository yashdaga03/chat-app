const Group = require('../models/groupModel');

exports.createGroup = async (req, res) => {
  try {
    const { name, members } = req.body;
    console.log("Logged in User ID: " + JSON.stringify(req.user.id));
    const group = new Group({ name, members });
    await group.save();
    res.status(201).json(group);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupsForUser = async (req, res) => {
  try {
    const { userId } = req.params;
    const groups = await Group.find({ members: userId });
    res.status(200).json(groups);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
