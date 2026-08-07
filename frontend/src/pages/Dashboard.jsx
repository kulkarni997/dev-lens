import { useEffect, useState } from 'react';
import { getRepos } from '../api/repos';
import { getReviews } from '../api/reviews';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import RepoList from '../components/RepoList';
import ReviewHistory from '../components/ReviewHistory';

export default function Dashboard() {
  const { isAuthenticated } = useAuth();
  const [repos, setRepos] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isAuthenticated) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    Promise.all([getRepos(), getReviews()])
      .then(([repoData, reviewData]) => {
        if (cancelled) return;
        setRepos(repoData);
        setReviews(reviewData);
        setError(null);
      })
      .catch((err) => {
        if (cancelled) return;
        console.error(err);
        setError("Couldn't load dashboard data. Is the backend running?");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [isAuthenticated]);

  function handleRepoConnected(fullName) {
    setRepos((prev) =>
      prev.map((r) => (r.full_name === fullName ? { ...r, hasWebhook: true } : r))
    );
  }

  const connectedCount = repos.filter((r) => r.hasWebhook).length;
  const postedCount = reviews.filter((r) => r.status === 'posted').length;
  const successRate = reviews.length > 0 ? Math.round((postedCount / reviews.length) * 100) : 0;

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#0B0E14] px-4">
        <div className="max-w-sm text-center">
          <div className="font-mono text-lg text-[#E6E9EF]">Not signed in</div>
          <p className="mt-2 text-sm text-[#8B93A7]">
            Sign in with GitHub to see your connected repos and review history.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#0B0E14] text-[#E6E9EF]">
      <header className="border-b border-[#232838] px-6 py-4">
        <div className="mx-auto flex max-w-5xl items-center justify-between">
          <span className="font-mono text-sm tracking-wide">
            Dev<span className="text-[#A78BFA]">Lens</span>
          </span>
          <span className="font-mono text-xs text-[#8B93A7]">
            {repos.length} repo{repos.length === 1 ? '' : 's'} synced
          </span>
        </div>
      </header>

      <main className="mx-auto max-w-5xl px-6 py-8">
        {error && (
          <div className="mb-6 rounded-md border border-[#F85149]/30 bg-[#F85149]/10 px-4 py-3 text-sm text-[#F85149]">
            {error}
          </div>
        )}

        <div className="mb-8 flex flex-col gap-4 sm:flex-row">
          <StatCard label="repos connected" value={loading ? '—' : connectedCount} accent="#A78BFA" />
          <StatCard label="reviews posted" value={loading ? '—' : reviews.length} accent="#3FB950" />
          <StatCard label="success rate" value={loading ? '—' : `${successRate}%`} accent="#6E9FFF" />
        </div>

        <div className="grid grid-cols-1 gap-8 lg:grid-cols-[1fr_2fr]">
          <section>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-[#8B93A7]">
              Connected repos
            </h2>
            {loading ? (
              <SkeletonList />
            ) : (
              <RepoList repos={repos} onRepoConnected={handleRepoConnected} />
            )}
          </section>

          <section>
            <h2 className="mb-3 font-mono text-xs uppercase tracking-wider text-[#8B93A7]">
              Review history
            </h2>
            {loading ? <SkeletonList rows={5} /> : <ReviewHistory reviews={reviews} />}
          </section>
        </div>
      </main>
    </div>
  );
}

function SkeletonList({ rows = 3 }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: rows }).map((_, i) => (
        <div key={i} className="h-10 animate-pulse rounded bg-[#12161F]" />
      ))}
    </div>
  );
}