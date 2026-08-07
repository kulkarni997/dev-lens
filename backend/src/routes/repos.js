const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const Repo = require('../models/Repo');
const requireAuth = require('../middleware/requireAuth');
const router = express.Router();

// GET /repos — list the logged-in user's GitHub repos (for dashboard)
router.get('/', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send('User not found');

    const response = await axios.get('https://api.github.com/user/repos', {
      headers: { Authorization: `Bearer ${user.accessToken}` }
    });

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('Failed to fetch repos');
  }
});

// :userId removed from the URL — req.userId now comes from the verified JWT
router.post('/:owner/:repo/hooks', requireAuth, async (req, res) => {
  try {
    const user = await User.findById(req.userId);
    if (!user) return res.status(404).send('User not found');

    const webhookConfig = {
      name: 'web',
      active: true,
      events: ['pull_request'],
      config: {
        url: `${process.env.NGROK_URL}/webhooks/github`,
        content_type: 'json',
        secret: process.env.GITHUB_WEBHOOK_SECRET
      }
    };

    const response = await axios.post(
      `https://api.github.com/repos/${req.params.owner}/${req.params.repo}/hooks`,
      webhookConfig,
      { headers: { Authorization: `Bearer ${user.accessToken}` } }
    );

    res.json(response.data);
  } catch (err) {
    console.error(err.response?.data || err);
    res.status(500).send('Failed to register webhook');
  }
});

module.exports = router;