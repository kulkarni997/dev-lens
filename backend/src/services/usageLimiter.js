const UsageCounter = require('../models/UsageCounter');

// Gemini Flash's free tier caps requests per day. Default here is deliberately
// under the actual cap to leave headroom — check your current limit at
// https://ai.google.dev/gemini-api/docs/rate-limits and adjust GEMINI_DAILY_LIMIT
// in .env if needed.
const DAILY_LIMIT = Number(process.env.GEMINI_DAILY_LIMIT || 1400);

function todayKey() {
  return new Date().toISOString().slice(0, 10); // 'YYYY-MM-DD' in UTC
}

/**
 * Atomically checks-and-increments today's counter. Returns
 * { allowed: boolean, count: number, limit: number }.
 *
 * Call this right before the Gemini call in reviewWorker.js — if allowed is
 * false, skip the call entirely rather than letting it hit Gemini and fail
 * with a 429 (that just burns another second and still counts against you).
 */
async function tryConsumeGeminiCall() {
  const date = todayKey();

  // Fast path: today's row exists and is under the limit — increment atomically.
  const updated = await UsageCounter.findOneAndUpdate(
    { key: 'gemini-calls', date, count: { $lt: DAILY_LIMIT } },
    { $inc: { count: 1 } },
    { new: true }
  );

  if (updated) {
    return { allowed: true, count: updated.count, limit: DAILY_LIMIT };
  }

  // Either today's row doesn't exist yet, or it's already at the limit.
  const existing = await UsageCounter.findOne({ key: 'gemini-calls', date });
  if (existing) {
    return { allowed: false, count: existing.count, limit: DAILY_LIMIT };
  }

  // First call of the day — create the row. Upsert handles the race where two
  // workers hit this at the exact same moment on day rollover.
  const created = await UsageCounter.findOneAndUpdate(
    { key: 'gemini-calls', date },
    { $inc: { count: 1 } },
    { upsert: true, new: true }
  );
  return { allowed: true, count: created.count, limit: DAILY_LIMIT };
}

module.exports = { tryConsumeGeminiCall, DAILY_LIMIT };