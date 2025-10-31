require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const Driver = require('./models/Driver');

const MONGO = process.env.MONGO_URI || 'mongodb://localhost:27017/campus_autos';

async function run() {
  await mongoose.connect(MONGO);
  const autoNumber = 'AUTO-01';
  let driver = await Driver.findOne({ autoNumber });
  if (!driver) {
    const hash = await bcrypt.hash('password123', 10);
    driver = await Driver.create({ autoNumber, name: 'Driver One', passwordHash: hash });
    console.log('Created driver', driver.autoNumber);
  } else {
    console.log('Driver exists', driver.autoNumber);
  }
  mongoose.disconnect();
}
run().catch(console.error);
