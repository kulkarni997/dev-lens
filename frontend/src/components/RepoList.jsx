import { useState } from 'react';
import { connectRepo } from '../api/repos';

export default function RepoList({ repos, onRepoConnected }) {
  const [connectingId, setConnectingId] = useState(null);
  const [failedId, setFailedId] = useState(null);

  async function handleConnect(repo) {
  setConnectingId(repo.full_name);
  setFailedId(null);

  try {
    const [owner, repoName] = repo.full_name.split('/');

    await connectRepo(owner, repoName);

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
      <div className="rounded-xl border border-dashed border-white/[0.1] px-6 py-10 text-center text-sm leading-6 text-[#71717a]">
        No repos found. Make sure DevLens has access to your GitHub account.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/[0.07]">
      {repos.map((repo) => (
        <li
  key={repo.full_name}
  className="group -mx-3 flex items-center justify-between gap-4 rounded-xl px-3 py-5 transition-colors duration-300 hover:bg-white/[0.025]"
>
          <div className="min-w-0">
            <div className="flex items-center gap-2">
              <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-[#71717a] transition-colors group-hover:bg-[#a78bfa]" />

              <div className="truncate font-mono text-sm text-[#d4d4d8]">
                {repo.full_name}
              </div>
            </div>

            <div className="mt-1.5 ml-3.5">
              {repo.private && (
                <span className="font-mono text-xs text-[#52525b]">
                  private
                </span>
              )}

              {failedId === repo.full_name && (
                <div className="mt-1 text-xs text-red-400">
                  Couldn't connect — try again
                </div>
              )}
            </div>
          </div>

          {repo.hasWebhook ? (
            <span className="shrink-0 font-mono text-xs text-emerald-400">
              connected
            </span>
          ) : (
            <button
              onClick={() => handleConnect(repo)}
              disabled={connectingId === repo.full_name}
              className="shrink-0 rounded-full border border-[#383342] px-4 py-1.5 font-mono text-xs text-[#a78bfa] transition-all duration-300 hover:border-[#a78bfa]/60 hover:bg-[#a78bfa]/[0.07] disabled:cursor-wait disabled:opacity-50"
            >
              {connectingId === repo.full_name
                ? 'connecting…'
                : 'connect'}
            </button>
          )}
        </li>
      ))}
    </ul>
  );
}