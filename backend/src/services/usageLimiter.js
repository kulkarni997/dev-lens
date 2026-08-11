const UsageCounter = require('../models/UsageCounter');

const DAILY_LIMIT = Number(process.env.GEMINI_DAILY_LIMIT || 1400);

function todayKey() {
  return new Date().toISOString().slice(0, 10);
}

async function tryConsumeGeminiCall() {
  const date = todayKey();

  const updated = await UsageCounter.findOneAndUpdate(
    { key: 'gemini-calls', date, count: { $lt: DAILY_LIMIT } },
    { $inc: { count: 1 } },
    { returnDocument: 'after' }
  );

  if (updated) {
    return { allowed: true, count: updated.count, limit: DAILY_LIMIT };
  }

  const existing = await UsageCounter.findOne({ key: 'gemini-calls', date });
  if (existing) {
    return { allowed: false, count: existing.count, limit: DAILY_LIMIT };
  }

  const created = await UsageCounter.findOneAndUpdate(
    { key: 'gemini-calls', date },
    { $inc: { count: 1 } },
    { upsert: true, returnDocument: 'after' }
  );
  return { allowed: true, count: created.count, limit: DAILY_LIMIT };
}

module.exports = { tryConsumeGeminiCall, DAILY_LIMIT };