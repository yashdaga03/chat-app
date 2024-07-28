const express = require('express');
const { getPrivateMessages, getGroupMessages } = require('../controllers/chatController');
const { authMiddleware } = require('../utils/middleware');
const router = express.Router();

router.get('/private/:userId/:otherUserId', authMiddleware, getPrivateMessages);
router.get('/group/:groupId', authMiddleware, getGroupMessages);

module.exports = router;
