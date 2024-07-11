const express = require('express');
const crypto = require('crypto');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const router = express.Router();

// Login Route
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).send('Invalid email or password.');

    const hashedPassword = crypto
      .createHash('sha256')
      .update(password)
      .digest('hex')
      .slice(0, 32);
    if (user.password_hash !== hashedPassword)
      return res.status(400).send('Invalid email or password.');

    const token = jwt.sign({ _id: user._id }, 'your_jwt_secret');
    user.updated_at = Date.now();
    await user.save();
    res.send({ token });
  } catch (error) {
    res.status(500).send('Internal Server Error');
  }
});

// Get current user route
router.get('/me', async (req, res) => {
  const token = req.headers.authorization.split(' ')[1];
  try {
    const decoded = jwt.verify(token, 'your_jwt_secret');
    const user = await User.findById(decoded._id);
    if (!user) return res.status(404).send('User not found');
    res.send(user);
  } catch (error) {
    res.status(401).send('Unauthorized');
  }
});

module.exports = router;
