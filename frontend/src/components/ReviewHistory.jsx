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
      <div className="rounded-md border border-dashed border-[#232838] p-6 text-center text-sm text-[#8B93A7]">
        No reviews yet. Open a PR on a connected repo and DevLens will review it automatically.
      </div>
    );
  }

  return (
    <ul className="divide-y divide-[#232838]">
      {reviews.map((review) => (
        <li key={review._id} className="flex items-center gap-3 py-3">
          <span className="w-10 shrink-0 font-mono text-xs text-[#8B93A7]">#{review.prNumber}</span>
          <div className="min-w-0 flex-1">
            <div className="truncate text-sm text-[#E6E9EF]">{review.prTitle}</div>
            <div className="truncate font-mono text-xs text-[#8B93A7]">
              {review.owner}/{review.repo}
            </div>
          </div>
          <span className="shrink-0 text-xs text-[#8B93A7]">{timeAgo(review.createdAt)}</span>
          <StatusBadge status={review.status} />
        </li>
      ))}
    </ul>
  );
}