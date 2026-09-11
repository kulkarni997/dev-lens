import StatusBadge from './StatusBadge';

function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) return `${hrs}h ago`;

  const days = Math.floor(hrs / 24);
  return `${days}d ago`;
}

export default function ReviewHistory({ reviews }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.1] px-6 py-10 text-center text-sm leading-6 text-[#71717a]">
        No reviews yet. Open a PR on a connected repo and DevLens will review
        it automatically.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-white/[0.07]">
      {reviews.map((review) => (
        <li
          key={review._id}
          className="group flex items-center gap-4 py-5"
        >
          <span className="shrink-0 font-mono text-xs text-[#52525b]">
            #{review.prNumber}
          </span>

          <div className="min-w-0 flex-1">
            <div className="truncate text-sm text-[#d4d4d8] transition-colors group-hover:text-white">
              {review.prTitle}
            </div>

            <div className="mt-1 truncate font-mono text-xs text-[#52525b]">
              {review.owner}/{review.repo}
            </div>
          </div>

          <span className="hidden shrink-0 font-mono text-xs text-[#52525b] sm:block">
            {timeAgo(review.createdAt)}
          </span>

          <StatusBadge status={review.status} />
        </li>
      ))}
    </ul>
  );
}