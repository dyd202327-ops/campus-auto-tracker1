const express = require('express');
const router = express.Router();
const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');

// POST /api/drivers/register
router.post('/register', async (req, res) => {
  try {
    const { name, autoNumber, password, phone } = req.body;
    if (!name || !autoNumber || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await Driver.findOne({ autoNumber });
    if (existing) return res.status(400).json({ message: 'Driver already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newDriver = new Driver({ name, autoNumber, passwordHash, phone });
    await newDriver.save();

    res.status(201).json({ message: 'Driver registered successfully', driver: { id: newDriver._id, name: newDriver.name, autoNumber: newDriver.autoNumber } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
