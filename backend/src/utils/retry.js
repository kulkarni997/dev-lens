/**
 * Wraps an async function, retrying on transient failures with exponential
 * backoff + jitter. Built for the Gemini call in aiReview.js, but generic
 * enough to reuse anywhere else you hit a flaky external API.
 */

function isRetryableError(err) {
  const status = err?.response?.status ?? err?.status;

  if (status === 429) return true; // rate limited
  if (status >= 500 && status < 600) return true; // upstream server error

  // Network-level failures (tunnel hiccup, DNS blip, connection reset)
  if (['ECONNRESET', 'ETIMEDOUT', 'ENOTFOUND', 'ECONNREFUSED'].includes(err?.code)) {
    return true;
  }

  return false; // 4xx other than 429 = your request was wrong, retrying won't help
}

async function withRetry(fn, { retries = 3, baseDelayMs = 1000, onRetry } = {}) {
  let attempt = 0;

  while (true) {
    try {
      return await fn();
    } catch (err) {
      attempt += 1;

      if (attempt > retries || !isRetryableError(err)) {
        throw err;
      }

      const jitter = Math.random() * 250;
      const delay = baseDelayMs * 2 ** (attempt - 1) + jitter;

      onRetry?.(err, attempt, delay);
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }
}

module.exports = { withRetry, isRetryableError };