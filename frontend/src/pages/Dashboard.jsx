import { useEffect, useMemo, useState } from 'react';
import { getRepos } from '../api/repos';
import { getReviews } from '../api/reviews';
import { useAuth } from '../hooks/useAuth';
import StatCard from '../components/StatCard';
import RepoList from '../components/RepoList';
import ReviewHistory from '../components/ReviewHistory';
import ReviewDetail from '../components/ReviewDetail';

const STAR_COLORS = [
  '#ffffff',
  '#c4b5fd',
  '#a5b4fc',
  '#93c5fd',
  '#f9a8d4',
];

function TypewriterText() {
  const lines = [
    'Your code.',
    'Reviewed automatically.',
  ];

  const [lineIndex, setLineIndex] = useState(0);
  const [charIndex, setCharIndex] = useState(0);
  const [deleting, setDeleting] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  const currentLine = lines[lineIndex];

  useEffect(() => {
    const typingSpeed = deleting ? 45 : 90;

    const timer = setTimeout(() => {
      if (!deleting) {
        if (charIndex < currentLine.length) {
          setCharIndex((prev) => prev + 1);
        } else {
          setTimeout(() => setDeleting(true), 1400);
        }
      } else {
        if (charIndex > 0) {
          setCharIndex((prev) => prev - 1);
        } else {
          setDeleting(false);
          setLineIndex((prev) => (prev + 1) % lines.length);
        }
      }
    }, typingSpeed);

    return () => clearTimeout(timer);
  }, [charIndex, deleting, currentLine, lineIndex]);

  return (
    <>
      <span className="text-[#f5f5f7]">
        {currentLine.slice(0, charIndex)}
      </span>

      <span
        className="ml-1 inline-block h-[0.9em] w-[3px] translate-y-[0.08em] bg-[#a78bfa] align-middle"
        style={{
          animation: 'cursorBlink 0.8s steps(1) infinite',
        }}
      />

      <style>{`
        @keyframes cursorBlink {
          0%, 45% {
            opacity: 1;
          }

          46%, 100% {
            opacity: 0;
          }
        }
      `}</style>
    </>
  );
}

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
      prev.map((repo) =>
        repo.full_name === fullName
          ? { ...repo, hasWebhook: true }
          : repo
      )
    );
  }

  const connectedCount = repos.filter((repo) => repo.hasWebhook).length;
  const postedCount = reviews.filter(
    (review) => review.status === 'posted'
  ).length;

  const successRate =
    reviews.length > 0
      ? Math.round((postedCount / reviews.length) * 100)
      : 0;

  const stars = useMemo(() => {
    return Array.from({ length: 45 }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      top: Math.random() * 100,
      size: Math.random() * 1.5 + 0.5,
      color: STAR_COLORS[Math.floor(Math.random() * STAR_COLORS.length)],
      duration: Math.random() * 10 + 8,
      delay: Math.random() * -15,
      driftX: (Math.random() - 0.5) * 80,
      driftY: (Math.random() - 0.5) * 60,
    }));
  }, []);

  if (!isAuthenticated) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#050507] px-4 text-center text-white">
        <div>
          <div className="font-mono text-sm uppercase tracking-[0.35em] text-[#a78bfa]">
            DevLens
          </div>

          <h1 className="mt-8 text-4xl font-medium tracking-[-0.04em]">
            Not signed in
          </h1>

          <p className="mx-auto mt-4 max-w-md text-sm leading-6 text-[#8b8e98]">
            Sign in with GitHub to see your connected repositories and
            review history.
          </p>

          <a
            href="/login"
            className="mt-8 inline-flex rounded-full border border-[#8b5cf6]/50 px-6 py-3 font-mono text-sm text-[#c4b5fd] transition hover:border-[#a78bfa] hover:bg-[#a78bfa]/10"
          >
            Sign in
          </a>
        </div>
      </div>
    );
  }

  if (selectedReview) {
  return (
    <ReviewDetail
      review={selectedReview}
      onBack={() => setSelectedReview(null)}
    />
  );
}

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-[#e6e7eb]">

      {/* Subtle galaxy */}
      <div className="pointer-events-none fixed inset-0 overflow-hidden">

        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/[0.07] blur-[150px]" />

        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-blue-700/[0.06] blur-[160px]" />

        {stars.map((star) => (
          <span
            key={star.id}
            className="dashboard-star absolute rounded-full"
            style={{
              left: `${star.left}%`,
              top: `${star.top}%`,
              width: `${star.size}px`,
              height: `${star.size}px`,
              backgroundColor: star.color,
              '--duration': `${star.duration}s`,
              '--delay': `${star.delay}s`,
              '--drift-x': `${star.driftX}px`,
              '--drift-y': `${star.driftY}px`,
            }}
          />
        ))}

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.94)_0%,rgba(5,5,7,0.82)_60%,rgba(5,5,7,0.55)_100%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050507]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">

          <div className="font-mono text-sm uppercase tracking-[0.35em] text-[#a78bfa]">
            DEV<span className="text-[#8b5cf6]">LENS</span>
          </div>

          <div className="font-mono text-xs text-[#71717a]">
            {repos.length} repo{repos.length === 1 ? '' : 's'} synced
          </div>

        </div>
      </header>

      <main className="relative z-10 mx-auto max-w-6xl px-6 py-16 lg:px-8 lg:py-20">

        {/* Hero */}
        <section className="mb-16">
  <h1 className="max-w-3xl text-5xl font-medium leading-[1.03] tracking-[-0.05em] text-[#f5f5f7] sm:text-6xl">
    <TypewriterText />
  </h1>
</section>

        {error && (
          <div className="mb-10 rounded-xl border border-red-400/20 bg-red-400/[0.06] px-5 py-4 text-sm text-red-400">
            {error}
          </div>
        )}

        {/* Stats */}
        <section className="mb-20 grid grid-cols-1 gap-px overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.08] sm:grid-cols-3">
          <StatCard
            label="repos connected"
            value={loading ? '—' : connectedCount}
          />

          <StatCard
            label="reviews posted"
            value={loading ? '—' : reviews.length}
          />

          <StatCard
            label="success rate"
            value={loading ? '—' : `${successRate}%`}
          />
        </section>

        {/* Main content */}
        <div className="grid grid-cols-1 gap-16 lg:grid-cols-[0.9fr_1.5fr] lg:gap-24">

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#71717a]">
                Connected repos
              </h2>

              <span className="font-mono text-xs text-[#52525b]">
                {connectedCount}/{repos.length}
              </span>
            </div>

            {loading ? (
              <SkeletonList />
            ) : (
              <RepoList
                repos={repos}
                onRepoConnected={handleRepoConnected}
              />
            )}
          </section>

          <section>
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-mono text-xs uppercase tracking-[0.25em] text-[#71717a]">
                Review history
              </h2>

              <span className="font-mono text-xs text-[#52525b]">
                {reviews.length} total
              </span>
            </div>

            {loading ? (
              <SkeletonList rows={5} />
            ) : (
              <ReviewHistory
  reviews={reviews}
  onReviewClick={setSelectedReview}
/>
            )}
          </section>

        </div>
      </main>

      <style>{`
        .dashboard-star {
          opacity: 0.25;
          box-shadow: 0 0 4px currentColor;
          animation: dashboardDrift var(--duration) ease-in-out var(--delay) infinite alternate;
        }

        @keyframes dashboardDrift {
          0% {
            transform: translate3d(0, 0, 0);
            opacity: 0.15;
          }

          50% {
            transform: translate3d(var(--drift-x), var(--drift-y), 0);
            opacity: 0.65;
          }

          100% {
            transform: translate3d(
              calc(var(--drift-x) * -0.4),
              calc(var(--drift-y) * -0.4),
              0
            );
            opacity: 0.2;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .dashboard-star {
            animation: none;
          }
        }
      `}</style>
    </div>
  );
}

function SkeletonList({ rows = 3 }) {
  return (
    <div className="space-y-3">
      {Array.from({ length: rows }).map((_, i) => (
        <div
          key={i}
          className="h-16 animate-pulse rounded-xl border border-white/[0.06] bg-white/[0.025]"
        />
      ))}
    </div>
  );
}