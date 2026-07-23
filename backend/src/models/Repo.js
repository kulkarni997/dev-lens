const mongoose = require('mongoose');

const repoSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  repoFullName: { type: String, required: true },
  webhookId: { type: Number },
  active: { type: Boolean, default: true },
  connectedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Repo', repoSchema);