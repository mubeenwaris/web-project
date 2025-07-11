const express = require('express');
const router = express.Router();
const Review = require('../Models/Review');

// Get all reviews for a product
router.get('/:productId', async (req, res) => {
  try {
    const reviews = await Review.find({ productId: req.params.productId }).sort({ date: -1 });
    res.json(reviews);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch reviews' });
  }
});

// Add a review for a product
router.post('/:productId', async (req, res) => {
  const { userName, rating, text } = req.body;
  if (!userName || !rating || !text) {
    return res.status(400).json({ error: 'All fields are required' });
  }
  try {
    const review = new Review({
      productId: req.params.productId,
      userName,
      rating,
      text
    });
    await review.save();
    res.status(201).json(review);
  } catch (err) {
    res.status(500).json({ error: 'Failed to add review' });
  }
});

module.exports = router; 