const express = require('express');
const { createGroup, getGroupsForUser } = require('../controllers/groupController');
const { authMiddleware } = require('../utils/middleware');
const router = express.Router();

router.post('/', authMiddleware, createGroup);
router.get('/:userId', authMiddleware, getGroupsForUser);

module.exports = router;
