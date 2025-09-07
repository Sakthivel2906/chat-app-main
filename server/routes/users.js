// routes/users.js
const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const User = require('../models/User');

// Get all users
router.get('/', auth, async (req, res) => {
  try {
    const users = await User.find().select('-password').sort('username');

    res.json({ users });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Get single user
router.get('/:userId', auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    res.json({ user });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
