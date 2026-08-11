const rateLimit = require('express-rate-limit');

// General API traffic — /repos, /reviews. Generous; this just stops scraping
// or a buggy frontend loop from hammering the backend.
const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 min
  max: 100,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many requests, slow down.' },
});

// Auth routes — stricter, since these kick off GitHub OAuth round-trips.
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  standardHeaders: true,
  legacyHeaders: false,
  message: { error: 'Too many sign-in attempts, try again in a few minutes.' },
});

module.exports = { apiLimiter, authLimiter };

// Deliberately NOT exporting a limiter for /webhooks/github — that route gets
// called by GitHub, not by a browser, and a burst of PR events (e.g. someone
// opening 10 PRs at once) is legitimate traffic you don't want to drop.