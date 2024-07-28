const Message = require('../models/messageModel');
const crypto = require('crypto');
const ENC= 'bf3c199c2470cb477d907b1e0917c17b';
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-cbc";

const decrypt = (text) => {
  let decipher = crypto.createDecipheriv(ALGO, ENC, IV);
  let decrypted = decipher.update(text, 'base64', 'utf8');
  let finalDecryptedText = decrypted + decipher.final('utf8');
  return finalDecryptedText;
}

exports.getPrivateMessages = async (req, res) => {
  try {
    const { userId, otherUserId } = req.params;
    const messages = await Message.find({
      $or: [
        { sender: userId, receiver: otherUserId },
        { sender: otherUserId, receiver: userId }
      ]
    }).sort('createdAt');

    const decryptedMessages = messages.map(message => (
      message.content = decrypt(message.content)
    ));

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.getGroupMessages = async (req, res) => {
  try {
    const { groupId } = req.params;
    const messages = await Message.find({ groupId }).sort('createdAt');

    const decryptedMessages = messages.map(message => (
      message.content = decrypt(message.content)
    ));

    res.status(200).json(messages);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};
