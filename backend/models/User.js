const mongoose = require('mongoose');
const crypto = require('crypto');

const userSchema = new mongoose.Schema({
  _id: { type: mongoose.Schema.Types.ObjectId, auto: true },
  first_name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  last_name: {
    type: String,
    required: true,
    maxlength: 50,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    maxlength: 75,
  },
  password_hash: {
    type: String,
    required: true,
    maxlength: 32,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
  updated_at: {
    type: Date,
    default: Date.now,
  },
});

// Hash the password before saving the user
userSchema.pre('save', async function (next) {
  if (this.isModified('password_hash') || this.isNew) {
    try {
      const hash = crypto
        .createHash('sha256')
        .update(this._password)
        .digest('hex');
      this.password_hash = hash.slice(0, 32); // Ensure it's exactly 32 characters
      next();
    } catch (err) {
      next(err);
    }
  } else {
    next();
  }
});

userSchema.virtual('password').set(function (password) {
  this._password = password;
  this.password_hash = password;
});

// Method to compare password
userSchema.methods.comparePassword = function (candidatePassword) {
  const hash = crypto
    .createHash('sha256')
    .update(candidatePassword)
    .digest('hex')
    .slice(0, 32);
  return this.password_hash === hash;
};

module.exports = mongoose.model('User', userSchema);
