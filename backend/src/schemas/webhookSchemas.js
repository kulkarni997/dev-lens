const { z } = require('zod');

// Only validates the fields webhooks.js actually reads before enqueuing a job.
// GitHub sends a much larger payload — .passthrough() lets the rest through
// unvalidated instead of stripping it.
const pullRequestWebhookSchema = z.object({
  body: z
    .object({
      action: z.string(),
      pull_request: z.object({
        number: z.number(),
        title: z.string(),
      }),
      repository: z.object({
        name: z.string(),
        owner: z.object({
          login: z.string(),
        }),
      }),
    })
    .passthrough(),
});

module.exports = { pullRequestWebhookSchema };