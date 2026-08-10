const mongoose = require('mongoose');

const usageCounterSchema = new mongoose.Schema({
  key: { type: String, required: true }, // e.g. 'gemini-calls'
  date: { type: String, required: true }, // 'YYYY-MM-DD', UTC
  count: { type: Number, default: 0 },
});

usageCounterSchema.index({ key: 1, date: 1 }, { unique: true });

module.exports = mongoose.model('UsageCounter', usageCounterSchema);