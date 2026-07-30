const express = require('express');
const crypto = require('crypto');
const router = express.Router();

function verifySignature(req) {
  const signature = req.headers['x-hub-signature-256'];
  const expectedSignature = 'sha256=' + crypto
    .createHmac('sha256', process.env.GITHUB_WEBHOOK_SECRET)
    .update(req.rawBody)
    .digest('hex');

  return signature === expectedSignature;
}

router.post('/github', (req, res) => {
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
  }

  res.status(200).send('Received');
});

module.exports = router;