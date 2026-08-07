const express = require('express');
const axios = require('axios');
const jwt = require('jsonwebtoken');
const router = express.Router();
const User = require('../models/User');

// Step 1: redirect user to GitHub's authorize page
router.get('/github', (req, res) => {
  const redirectUri = process.env.GITHUB_CALLBACK_URL;
  const clientId = process.env.GITHUB_CLIENT_ID;
  const scope = 'repo user:email';

  const githubAuthUrl = `https://github.com/login/oauth/authorize?client_id=${clientId}&redirect_uri=${redirectUri}&scope=${scope}`;

  res.redirect(githubAuthUrl);
});

// Step 2: handle GitHub's redirect back, exchange code for token
router.get('/github/callback', async (req, res) => {
  const code = req.query.code;

  try {
    const tokenResponse = await axios.post(
      'https://github.com/login/oauth/access_token',
      {
        client_id: process.env.GITHUB_CLIENT_ID,
        client_secret: process.env.GITHUB_CLIENT_SECRET,
        code: code
      },
      { headers: { Accept: 'application/json' } }
    );

    const accessToken = tokenResponse.data.access_token;

    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    const ghUser = userResponse.data;

    const user = await User.findOneAndUpdate(
      { githubId: ghUser.id },
      {
        githubId: ghUser.id,
        username: ghUser.login,
        accessToken: accessToken,
        email: ghUser.email
      },
      { upsert: true, returnDocument: 'after' }
    );

    console.log('User saved:', user);

    // Create the JWT "ID badge" — payload holds just the user's Mongo _id,
    // signed with JWT_SECRET so the server can verify it later without
    // needing to store the token anywhere itself.
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Hand the token to the frontend via redirect query param, since
    // frontend (5173) and backend (5000) are different origins.
    const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
    res.redirect(`${frontendUrl}/auth/callback?token=${token}`);
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth failed');
  }
});

module.exports = router;