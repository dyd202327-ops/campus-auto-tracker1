const express = require('express');
const router = express.Router();
const { getLiveDrivers, getUsageStats } = require('../controllers/adminController');

router.get('/live-drivers', getLiveDrivers);
router.get('/usage-stats', getUsageStats);

module.exports = router;
