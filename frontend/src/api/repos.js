import client from './client';

// GET /repos — assumed shape per repo: { owner, name, full_name, private, hasWebhook }
// If your actual response doesn't include hasWebhook, either add it backend-side
// (check if a webhook already exists for that repo) or drop the "connected" badge
// logic in RepoList.jsx — see NOTES.md.
export async function getRepos() {
  const { data } = await client.get('/repos');
  return data;
}

export async function connectRepo(owner, repo) {
  const { data } = await client.post(`/repos/${owner}/${repo}/hooks`);
  return data;
}