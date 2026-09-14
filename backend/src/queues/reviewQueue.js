const { Queue } = require('bullmq');
const Redis = require('ioredis');

// Use hosted Redis in production.
// Use the local Docker Redis when REDIS_URL is not provided.
const connection = process.env.REDIS_URL
  ? new Redis(process.env.REDIS_URL, {
      maxRetriesPerRequest: null,
    })
  : {
      host: process.env.REDIS_HOST || 'redis',
      port: Number(process.env.REDIS_PORT) || 6379,
    };

const reviewQueue = new Queue('pr-review', {
  connection,
});

module.exports = {
  reviewQueue,
  connection,
};