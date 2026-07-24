const express = require('express');
const axios = require('axios');
const User = require('../models/User');
const Repo = require('../models/Repo');
const router = express.Router();

router.post('/:userId/:owner/:repo/hooks', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
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