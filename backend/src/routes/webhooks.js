const express = require('express');
const router = express.Router();

router.post('/github', (req, res) => {
  console.log('Webhook received:', req.body);
  console.log('Event type:', req.headers['x-github-event']);

  res.status(200).send('Received');
});

module.exports = router;