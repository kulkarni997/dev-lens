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

  console.log('Webhook received:', req.body);
  console.log('Event type:', req.headers['x-github-event']);

  res.status(200).send('Received');
});

module.exports = router;