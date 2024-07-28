const User = require('../models/userModel');
const jwt = require('jsonwebtoken');
const logger = require('../utils/logger');
const axios = require('axios');
const communicationServiceBaseUrl = process.env.COMMUNICATION_BASE_URL;


async function sendRegistrationEmail(user) {
  try {
    const response = await axios.post(communicationServiceBaseUrl + "api/v1/send-email", {
        to: user.email,
        subject: "Account Registered",
        templateName: "notifyRegisteredUser",
        templateData: {
            "title": "Your Account is now registered!",
            "username": user.username
        }
    });
  } catch(error) {
      throw new Error(`Failed to send Email ${error.response ? error.response.data : error.message}`);
  }
}


exports.register = async (req, res) => {
  logger.info('[EVENT][CONTROLLER] Register User called: ' + req.body.email);
  try {
    const { username, email, password } = req.body;
    const user = new User({ username, email, password });
    // await sendRegistrationEmail(user);
    await user.save();
    res.status(201).json({ 'success': true, 'message': 'User registered successfully', 'user': user });
  } catch (error) {
    logger.error(error);
    res.status(400).json({ 'success': false, 'message': error.message });
  }
};


exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};


exports.getById = async (req, res) => {
  try {
    const id = req.params.id;
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).json({'success': false, 'message': "No User Found!"});
    }
    return res.status(200).json({'success': true, 'user': user});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}


exports.updateUser = async (req, res) => {
  try {
    const id = req.params.id;
    const { username, email, password } = req.body;
    const user = await User.findById(id);
    if(!user) {
      return res.status(404).json({'success': false, 'message': "No User Found!"});
    }
    user.username = username || user.username;
    await user.save();
    return res.status(200).json({'success': true, 'user': user});
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
}