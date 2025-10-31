const Driver = require('../models/Driver');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'change-this';

async function driverRegister(req, res) {
  try {
    const { autoNumber, password, name } = req.body;
    if (!autoNumber || !password) return res.status(400).json({ error: 'Missing fields' });
    const existing = await Driver.findOne({ autoNumber });
    if (existing) return res.status(400).json({ error: 'Auto number exists' });
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);
    const driver = await Driver.create({ autoNumber, passwordHash, name });
    res.json({ ok: true, driverId: driver._id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

async function driverLogin(req, res) {
  try {
    const { autoNumber, password } = req.body;
    const driver = await Driver.findOne({ autoNumber });
    if (!driver) return res.status(401).json({ error: 'Invalid credentials' });
    const match = await bcrypt.compare(password, driver.passwordHash);
    if (!match) return res.status(401).json({ error: 'Invalid credentials' });
    const token = jwt.sign({ id: driver._id, role: 'driver' }, JWT_SECRET, { expiresIn: '7d' });
    res.json({ token, driver: { id: driver._id, autoNumber: driver.autoNumber, name: driver.name } });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
}

module.exports = { driverRegister, driverLogin };
