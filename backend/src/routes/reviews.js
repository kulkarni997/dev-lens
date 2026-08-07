const express = require('express');
const router = express.Router();
const Review = require('../models/Review');
const requireAuth = require('../middleware/requireAuth');

// GET /reviews — no more :userId in the URL, it comes from the verified token
router.get('/', requireAuth, async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.userId })
      .sort({ createdAt: -1 });

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;