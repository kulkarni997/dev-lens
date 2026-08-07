import client from './client';

// GET /reviews — per your handoff doc this already returns full Review documents:
// { _id, owner, repo, prNumber, prTitle, reviewText, aiProvider, status, createdAt }
export async function getReviews() {
  const { data } = await client.get('/reviews');
  return data;
}