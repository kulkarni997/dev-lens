const express = require('express');
const crypto = require('crypto');
const axios = require('axios');

const User = require('../models/user');
const { reviewQueue } = require('../queues/reviewQueue');

const router = express.Router();

function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];

  if (!signature || !process.env.GITHUB_WEBHOOK_SECRET || !req.rawBody) {
    return false;
  }

  const expectedSignature =
    'sha256=' +
    crypto
      .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
      .update(req.rawBody)
      .digest('hex');

  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(expectedSignature)
  );
}

function verifySignatureMiddleware(req, res, next) {
  if (!verifySignature(req)) {
    console.log('Signature mismatch — rejecting');
    return res.status(401).send('Invalid signature');
  }

  next();
}

router.post(
  '/github',
  verifySignatureMiddleware,
  async (req, res) => {
    try {
      const eventType = req.headers['x-github-event'];

      // Ignore push and other non-PR events.
      if (eventType !== 'pull_request') {
        console.log('Ignoring GitHub event:', eventType);
        return res.status(200).send('Event ignored');
      }

      const { action, pull_request, repository } = req.body;

      if (!pull_request || !repository) {
        return res.status(400).json({
          error: 'Invalid pull request webhook payload',
        });
      }

      // Only review newly opened or updated PRs.
      if (action !== 'opened' && action !== 'synchronize') {
        console.log('Ignoring pull request action:', action);
        return res.status(200).send('Action ignored');
      }

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

      // Confirm that GitHub can access the PR.
      await axios.get(
        `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
        {
          headers: {
            Authorization: `Bearer ${user.accessToken}`,
            Accept: 'application/vnd.github+json',
          },
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

      return res.status(200).send('Review queued');
    } catch (error) {
      console.error(
        'Webhook processing error:',
        error.response?.data || error.message
      );

      return res.status(500).json({
        error: 'Webhook processing failed',
      });
    }
  }
);

module.exports = router;