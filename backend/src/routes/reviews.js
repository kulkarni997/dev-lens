const express = require('express');
const router = express.Router();
const Review = require('../models/Review');

router.get('/:userId', async (req, res) => {
  try {
    const reviews = await Review.find({ user: req.params.userId })
      .sort({ createdAt: -1 }); // newest first

    res.json(reviews);
  } catch (err) {
    console.error('Error fetching reviews:', err.message);
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

module.exports = router;