const express = require('express');
const { register, login, getById, updateUser } = require('../controllers/authController');
const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.get('/:id', getById);
router.patch('/:id', updateUser);

module.exports = router;
