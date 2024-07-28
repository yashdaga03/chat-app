const mongoose = require('mongoose');
const crypto = require('crypto');
const ENC= 'bf3c199c2470cb477d907b1e0917c17b';
const IV = "5183666c72eec9e4";
const ALGO = "aes-256-cbc";

const messageSchema = new mongoose.Schema({
  sender: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  content: { type: String },
  mediaUrl: { type: String },
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  privateChat: { type: Boolean, default: false },
  receiver: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
}, { timestamps: true });

messageSchema.pre('save', function(next) {
  if (this.isModified('content')) {
    this.content = encrypt(this.content);
  }
  next();
});

function encrypt(text) {
  let cipher = crypto.createCipheriv(ALGO, ENC, IV);
  let encrypted = cipher.update(text, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  return encrypted;
}

messageSchema.methods.decryptContent = function() {
  return decrypt(this.content);
};

module.exports = mongoose.model('Message', messageSchema);
