const express = require('express');
const router = express.Router();
const Student = require('../models/Student');
const bcrypt = require('bcryptjs');

// POST /api/students/register
router.post('/register', async (req, res) => {
  try {
    const { name, universityId, email, password } = req.body;
    if (!name || !universityId || !email || !password) return res.status(400).json({ message: 'Missing fields' });

    const existing = await Student.findOne({ $or: [{ email }, { universityId }] });
    if (existing) return res.status(400).json({ message: 'Student already exists' });

    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    const newStudent = new Student({ name, universityId, email, passwordHash });
    await newStudent.save();

    res.status(201).json({ message: 'Student registered successfully', student: { id: newStudent._id, name: newStudent.name, email: newStudent.email } });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;
