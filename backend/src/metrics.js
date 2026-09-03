const client = require('prom-client');

const register = new client.Registry();

// Collect default Node.js metrics (CPU, memory, event loop lag, etc.)
client.collectDefaultMetrics({ register });

// --- Custom metric 1: HTTP request duration ---
const httpRequestDuration = new client.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.05, 0.1, 0.3, 0.5, 1, 2, 5], // tune based on expected latency
});

// --- Custom metric 2: BullMQ queue depth ---
const queueDepth = new client.Gauge({
  name: 'bullmq_queue_depth',
  help: 'Number of jobs currently waiting in the BullMQ queue',
  labelNames: ['queue_name'],
});

// --- Custom metric 3: Gemini API call duration ---
const geminiCallDuration = new client.Histogram({
  name: 'gemini_api_call_duration_seconds',
  help: 'Duration of Gemini API calls in seconds',
  labelNames: ['status'], // 'success' | 'error'
  buckets: [0.5, 1, 2, 5, 10, 20], // Gemini calls are slower than typical HTTP
});

// Register all custom metrics
register.registerMetric(httpRequestDuration);
register.registerMetric(queueDepth);
register.registerMetric(geminiCallDuration);

module.exports = {
  register,
  httpRequestDuration,
  queueDepth,
  geminiCallDuration,
};