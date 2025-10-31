const express = require('express');
const router = express.Router();
const { driverAuth } = require('../middleware/authMiddleware');
const { startShift, endShift, postLocation } = require('../controllers/driverController');

router.post('/start', driverAuth, startShift);
router.post('/end', driverAuth, endShift);
router.post('/location', driverAuth, postLocation);

module.exports = router;
