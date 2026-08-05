const { Worker } = require('bullmq');
const axios = require('axios');
const { connection } = require('../queues/reviewQueue');
const { getReview, postReviewComment } = require('../services/aiReview');
const Review = require('../models/Review');

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