const { Queue } = require('bullmq');

// BullMQ needs a Redis connection to store queued jobs.
// This matches the redis service name from docker-compose.yml —
// same reasoning as why Mongo is reached via "mongo", not "localhost".
const connection = {
  host: process.env.REDIS_HOST || 'redis',
  port: process.env.REDIS_PORT || 6379,
};

// One queue, named 'pr-review'. Think of this as the mailbox name —
// the producer (webhook route) and worker both need to use this same
// name to talk to the same queue.
const reviewQueue = new Queue('pr-review', { connection });

module.exports = { reviewQueue, connection };