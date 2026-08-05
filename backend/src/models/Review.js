const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  owner: { type: String, required: true },
  repo: { type: String, required: true },
  prNumber: { type: Number, required: true },
  prTitle: { type: String },

  reviewText: { type: String, required: true },

  aiProvider: { type: String, default: 'gemini' },

  status: {
    type: String,
    enum: ['posted', 'failed'],
    default: 'posted',
  },
}, { timestamps: true });

module.exports = mongoose.model('Review', reviewSchema);