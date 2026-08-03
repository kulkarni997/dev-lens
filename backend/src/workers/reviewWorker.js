const { Worker } = require('bullmq');
const axios = require('axios');
const { connection } = require('../queues/reviewQueue');
const { getReview, postReviewComment } = require('../services/aiReview');

// A Worker listens on the 'pr-review' queue (same name as reviewQueue.js)
// and runs this function every time a job appears. This is where all the
// slow work now lives, with no time pressure from GitHub's webhook timeout.
const reviewWorker = new Worker(
  'pr-review',
  async (job) => {
    const { owner, repo, prNumber, accessToken } = job.data;

    console.log('Worker picked up job for PR', prNumber);

    // Step 1: fetch the diff (moved here from webhooks.js)
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

    // Step 2: send to Gemini
    const review = await getReview(diffText);
    console.log('AI Review:', review);

    // Step 3: post back to GitHub
    await postReviewComment({ owner, repo, prNumber, accessToken, review });

    console.log('Review posted for PR', prNumber);
  },
  { connection }
);

// If a job throws (Gemini down, bad token, etc.), this fires instead of
// crashing the whole worker process.
reviewWorker.on('failed', (job, err) => {
  console.error(`Job for PR ${job?.data?.prNumber} failed:`, err.message);
});

module.exports = { reviewWorker };