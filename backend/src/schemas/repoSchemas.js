const { z } = require('zod');

// GitHub usernames/org names and repo names: alphanumeric, hyphens, underscores,
// dots. Real GitHub rules are a bit stricter (e.g. usernames can't start/end
// with a hyphen) but this is enough to reject path traversal attempts, injection
// payloads, and obvious junk before it reaches the GitHub API call.
const githubNamePattern = /^[a-zA-Z0-9._-]{1,100}$/;

const connectRepoSchema = z.object({
  params: z.object({
    owner: z.string().regex(githubNamePattern, 'Invalid GitHub owner name'),
    repo: z.string().regex(githubNamePattern, 'Invalid GitHub repo name'),
  }),
});

module.exports = { connectRepoSchema };