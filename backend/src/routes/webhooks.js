const express = require('express');
const crypto = require('crypto');
const User = require('../models/User');
const router = express.Router();
const axios = require('axios');
const { reviewQueue } = require('../queues/reviewQueue');
const { validate } = require('../middleware/validate');
const { pullRequestWebhookSchema } = require('../schemas/webhookSchemas');

function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');

  return signature === expectedSignature;
}

function verifySignatureMiddleware(req, res, next) {
  if (!verifySignature(req)) {
    console.log('Signature mismatch — rejecting');
    return res.status(401).send('Invalid signature');
  }
  next();
}

router.post('/github', verifySignatureMiddleware, validate(pullRequestWebhookSchema), async (req, res) => {
  const { action, pull_request, repository } = req.validated.body;
  const eventType = req.headers['x-github-event'];

  if (eventType === 'pull_request' && (action === 'opened' || action === 'synchronize')) {
    const prNumber = pull_request.number;
    const prTitle = pull_request.title;
    const owner = repository.owner.login;
    const repo = repository.name;

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
      prTitle,
      accessToken: user.accessToken,
      userId: user._id,
    });

    console.log('Job enqueued for PR', prNumber);
  }

  res.status(200).send('Received');
});

module.exports = router;