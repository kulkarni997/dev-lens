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

export default function ReviewHistory({ reviews, onReviewClick }) {
  if (reviews.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-white/[0.1] px-4 py-8 text-center text-sm leading-6 text-[#71717a] sm:px-6 sm:py-10">
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
          onClick={() => onReviewClick?.(review)}
          className="group flex cursor-pointer items-start gap-3 rounded-xl px-2 py-5 transition-colors hover:bg-white/[0.02] sm:items-center sm:gap-4 sm:px-3"
        >
          <span className="shrink-0 pt-1 font-mono text-xs text-[#52525b] sm:pt-0">
            #{review.prNumber}
          </span>

          <div className="min-w-0 flex-1">
            <div className="break-words text-sm leading-6 text-[#d4d4d8] transition-colors group-hover:text-white">
              {review.prTitle}
            </div>

            <div className="mt-1 break-all font-mono text-xs leading-5 text-[#52525b]">
              {review.owner}/{review.repo}
            </div>

            <div className="mt-2 flex items-center gap-3 sm:hidden">
              <span className="font-mono text-xs text-[#52525b]">
                {timeAgo(review.createdAt)}
              </span>

              <StatusBadge status={review.status} />
            </div>
          </div>

          <span className="hidden shrink-0 font-mono text-xs text-[#52525b] sm:block">
            {timeAgo(review.createdAt)}
          </span>

          <div className="hidden shrink-0 sm:block">
            <StatusBadge status={review.status} />
          </div>
        </li>
      ))}
    </ul>
  );
}