const { GoogleGenerativeAI } = require('@google/generative-ai');
const axios = require('axios');

// One client instance, reused across requests instead of creating a new
// connection every time someone opens a PR.
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

/**
 * Sends a PR diff to the AI provider and returns a review as plain text.
 * The provider is chosen by AI_PROVIDER in .env, so webhooks.js never
 * needs to know or care which AI is actually doing the work.
 */
async function getReview(diffText) {
  const provider = process.env.AI_PROVIDER || 'gemini';

  if (provider === 'gemini') {
    return getGeminiReview(diffText);
  }

  // Future: else if (provider === 'claude') { return getClaudeReview(diffText); }

  throw new Error(`Unsupported AI_PROVIDER: ${provider}`);
}

async function getGeminiReview(diffText) {
  const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

  const prompt = `You are reviewing a GitHub pull request diff. Give a concise,
practical code review: point out bugs, risky patterns, or missed edge cases.
Skip generic praise. If the diff looks fine, say so briefly.

Diff:
${diffText}`;

  const result = await model.generateContent(prompt);
  const response = result.response;
  return response.text();
}

/**
 * Posts the review text as a comment on the PR.
 * Note: PRs are internally "issues" in GitHub's API, so comments
 * live under /issues/{prNumber}/comments, not /pulls/.
 */
async function postReviewComment({ owner, repo, prNumber, accessToken, review }) {
  const url = `https://api.github.com/repos/${owner}/${repo}/issues/${prNumber}/comments`;

  await axios.post(
    url,
    { body: review },
    {
      headers: {
        Authorization: `token ${accessToken}`,
        Accept: 'application/vnd.github.v3+json',
      },
    }
  );
}

module.exports = { getReview, postReviewComment };