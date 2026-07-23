const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const Repo = require('../models/Repo');
const router = express.Router();

// List the logged-in user's GitHub repos
router.get('/list/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).send('User not found');

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err);
    res.status(500).send('Failed to fetch repos');
  }
});

module.exports = router;