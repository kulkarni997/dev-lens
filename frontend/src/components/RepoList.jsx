import { useState } from 'react';
import { connectRepo } from '../api/repos';

export default function RepoList({ repos, onRepoConnected }) {
  const [connectingId, setConnectingId] = useState(null);
  const [failedId, setFailedId] = useState(null);

  async function handleConnect(repo) {
    setConnectingId(repo.full_name);
    setFailedId(null);
    try {
      await connectRepo(repo.owner, repo.name);
      onRepoConnected?.(repo.full_name);
    } catch (err) {
      console.error('Failed to connect repo', err);
      setFailedId(repo.full_name);
    } finally {
      setConnectingId(null);
    }
  }

  if (repos.length === 0) {
    return (
      <div className="rounded-md border border-dashed border-[#232838] p-6 text-center text-sm text-[#8B93A7]">
        No repos found. Make sure DevLens has access to your GitHub account.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[#232838]">
      {repos.map((repo) => (
        <li key={repo.full_name} className="flex items-center justify-between gap-3 py-3">
          <div className="min-w-0">
            <div className="truncate font-mono text-sm text-[#E6E9EF]">{repo.full_name}</div>
            {repo.private && <span className="text-xs text-[#8B93A7]">private</span>}
            {failedId === repo.full_name && (
              <div className="text-xs text-[#F85149]">Couldn't connect — try again</div>
            )}
          </div>

          {repo.hasWebhook ? (
            <span className="shrink-0 rounded border border-[#3FB950]/30 bg-[#3FB950]/10 px-2 py-0.5 font-mono text-xs text-[#3FB950]">
              connected
            </span>
          ) : (
            <button
              onClick={() => handleConnect(repo)}
              disabled={connectingId === repo.full_name}
              className="shrink-0 rounded border border-[#A78BFA]/40 px-3 py-1 font-mono text-xs text-[#A78BFA] transition hover:bg-[#A78BFA]/10 disabled:opacity-50"
            >
              {connectingId === repo.full_name ? 'connecting…' : 'connect'}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}