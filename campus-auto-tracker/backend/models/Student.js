const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const studentSchema = new mongoose.Schema({
  name: { type: String, required: true },
  universityId: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  passwordHash: { type: String, required: true }
}, { timestamps: true });

studentSchema.methods.comparePassword = async function(password) {
  return bcrypt.compare(password, this.passwordHash);
};

studentSchema.pre('save', async function(next) {
  if (!this.isModified('passwordHash')) return next();
  // if passwordHash is already a hash, skip — keep as is
  next();
});

module.exports = mongoose.model('Student', studentSchema);
