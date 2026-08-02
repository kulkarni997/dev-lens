const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();
const axios = require('axios');
const { reviewQueue } = require('../queues/reviewQueue');

function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');

  return signature === expectedSignature;
}

router.post('/github', async (req, res) => {
  if (!verifySignature(req)) {
    console.log('Signature mismatch — rejecting');
    return res.status(401).send('Invalid signature');
  }

  const eventType = req.headers['x-github-event'];

  if (eventType === 'pull_request') {
    const action = req.body.action;
    const prNumber = req.body.number;
    const prTitle = req.body.pull_request.title;
    const [owner, repo] = req.body.repository.full_name.split('/');

    console.log('PR event:', action);
    console.log('PR number:', prNumber);
    console.log('PR title:', prTitle);
    console.log('Owner:', owner, '| Repo:', repo);

    const user = await User.findOne({ username: owner });
    if (!user) {
      console.log('No matching user found for', owner);
      return res.status(200).send('No matching user');
    }

    console.log('Found user, access token available');

    const diffResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `Bearer ${user.accessToken}`,
          Accept: 'application/vnd.github.v3.diff'
        }
      }
    );

    await reviewQueue.add('review-pr', {
  owner,
  repo,
  prNumber,
  accessToken: user.accessToken,
});

console.log('Job enqueued for PR', prNumber);
  }

  res.status(200).send('Received');
});

module.exports = router;