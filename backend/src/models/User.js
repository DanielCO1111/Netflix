const mongoose = require('mongoose');
const crypto = require('crypto');

// Updated User schema
const UserSchema = new mongoose.Schema({
  first_name: { type: String, required: true },
  last_name: { type: String, required: true },
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true }, // Hashed password
  role: { type: String, default: 'User', enum: ['User', 'Admin'] }, // Add role field with default
  profileImage: { type: String, default: null }, // Add profileImage field
});

// Method to hash the password
UserSchema.methods.hashPassword = function (password) {
  return crypto.createHmac('sha256', 'your_secret_key').update(password).digest('hex');
};

// Method to validate the password
UserSchema.methods.validatePassword = function (password) {
  return this.password === this.hashPassword(password);
};

// Middleware to hash the password before saving
UserSchema.pre('save', function (next) {
  if (!this.isModified('password')) return next();
  this.password = this.hashPassword(this.password); // Hash the password directly
  next();
});

module.exports = mongoose.model('User', UserSchema);