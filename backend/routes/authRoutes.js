const express = require('express');
const router = express.Router();
const { registerUser, loginUser, registerDriver, loginDriver } = require('../controllers/authController');

router.post('/register', registerUser);
router.post('/login', loginUser);
router.post('/driver/register', registerDriver);
router.post('/driver/login', loginDriver);

module.exports = router;
