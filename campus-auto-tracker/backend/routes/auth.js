const express = require('express');
const router = express.Router();
const { driverRegister, driverLogin } = require('../controllers/authController');

router.post('/driver/register', driverRegister);
router.post('/driver/login', driverLogin);

module.exports = router;
