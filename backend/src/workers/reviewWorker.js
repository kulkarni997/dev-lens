const { Worker } = require('bullmq');
const axios = require('axios');
const { connection, reviewQueue } = require('../queues/reviewQueue'); // <-- need reviewQueue exported too
const { getReview, postReviewComment } = require('../services/aiReview');
const Review = require('../models/Review');
const { tryConsumeGeminiCall } = require('../services/usageLimiter');
const { queueDepth } = require('../metrics'); // <-- new import

// Poll queue depth every 5s and update the Gauge
setInterval(async () => {
  try {
    const waiting = await reviewQueue.getWaitingCount();
    queueDepth.set({ queue_name: 'pr-review' }, waiting);
  } catch (err) {
    console.error('Failed to poll queue depth:', err.message);
  }
}, 5000);

const reviewWorker = new Worker(
  'pr-review',
  async (job) => {
    const { owner, repo, prNumber, prTitle, accessToken, userId } = job.data;

    console.log('Worker picked up job for PR', prNumber);

    // Step 1: fetch the diff
    const diffResponse = await axios.get(
      `https://api.github.com/repos/${owner}/${repo}/pulls/${prNumber}`,
      {
        headers: {
          Authorization: `token ${accessToken}`,
          Accept: 'application/vnd.github.v3.diff',
        },
      }
    );
    const diffText = diffResponse.data;
    console.log('Diff fetched, length:', diffText.length);

    const usage = await tryConsumeGeminiCall();
    if (!usage.allowed) {
      console.warn(`Gemini daily limit reached (${usage.count}/${usage.limit}), skipping PR #${prNumber}`);
      await Review.create({
        user: userId,
        owner,
        repo,
        prNumber,
        prTitle,
        reviewText: null,
        aiProvider: 'gemini',
        status: 'failed',
        failureReason: 'daily_limit_reached',
      });
      return;
    }

    // Step 2: send to Gemini
    const review = await getReview(diffText);
    console.log('AI Review:', review);

    // Step 3: post back to GitHub
    await postReviewComment({ owner, repo, prNumber, accessToken, review });
    console.log('Review posted for PR', prNumber);

    // Step 4: save to MongoDB so it's queryable later (dashboard, history, limits)
    await Review.create({
      user: userId,
      owner,
      repo,
      prNumber,
      prTitle,
      reviewText: review,
      status: 'posted',
    });
    console.log('Review saved to DB for PR', prNumber);
  },
  { connection }
);

reviewWorker.on('failed', (job, err) => {
  console.error(`Job for PR ${job?.data?.prNumber} failed:`, err.message);
});

module.exports = { reviewWorker };