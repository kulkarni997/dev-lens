const express = require('express');
const axios = require('axios');
const router = express.Router();

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

    // fetch the user's GitHub profile using that token
    const userResponse = await axios.get('https://api.github.com/user', {
      headers: { Authorization: `Bearer ${accessToken}` }
    });

    console.log(userResponse.data); // just log for now — Mongo save comes next

    res.send('OAuth flow worked! Check your backend logs.');
  } catch (err) {
    console.error(err);
    res.status(500).send('OAuth failed');
  }
});

module.exports = router;