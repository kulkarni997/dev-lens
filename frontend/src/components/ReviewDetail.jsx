function timeAgo(dateStr) {
  const diffMs = Date.now() - new Date(dateStr).getTime();
  const mins = Math.floor(diffMs / 60000);

  if (mins < 1) return 'just now';
  if (mins < 60) return `${mins}m ago`;

  const hrs = Math.floor(mins / 60);

  if (hrs < 24) return `${hrs}h ago`;

  return `${Math.floor(hrs / 24)}d ago`;
}

export default function ReviewDetail({ review, onBack }) {
  const statusStyle =
    review.status === 'posted'
      ? 'text-emerald-400'
      : review.status === 'failed'
        ? 'text-red-400'
        : 'text-[#71717a]';

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#050507] text-[#e6e7eb]">

      {/* Background */}
      <div className="pointer-events-none fixed inset-0">
        <div className="absolute -left-40 -top-40 h-[500px] w-[500px] rounded-full bg-purple-700/[0.07] blur-[150px]" />
        <div className="absolute -bottom-40 -right-40 h-[550px] w-[550px] rounded-full bg-blue-700/[0.06] blur-[160px]" />

        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,rgba(5,5,7,0.94)_0%,rgba(5,5,7,0.82)_60%,rgba(5,5,7,0.55)_100%)]" />
      </div>

      {/* Header */}
      <header className="sticky top-0 z-50 border-b border-white/[0.07] bg-[#050507]/80 backdrop-blur-xl">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-5 lg:px-8">

          <button
            onClick={onBack}
            className="group flex items-center gap-2 font-mono text-xs text-[#71717a] transition hover:text-white"
          >
            <span className="transition-transform group-hover:-translate-x-1">
              ←
            </span>
            back to dashboard
          </button>

          <div className="font-mono text-sm uppercase tracking-[0.35em] text-[#a78bfa]">
            DEV<span className="text-[#8b5cf6]">LENS</span>
          </div>

        </div>
      </header>

      {/* Content */}
      <main className="relative z-10 mx-auto max-w-4xl px-6 py-16 lg:px-8 lg:py-24">

        <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#71717a]">
          Pull request #{review.prNumber}
        </div>

        <h1 className="mt-6 text-4xl font-medium leading-tight tracking-[-0.04em] text-[#f5f5f7] sm:text-5xl">
          {review.prTitle}
        </h1>

        <div className="mt-5 flex flex-wrap items-center gap-x-4 gap-y-2 font-mono text-xs text-[#71717a]">
          <span>
            {review.owner}/{review.repo}
          </span>

          <span className="text-[#3f3f46]">·</span>

          <span>{timeAgo(review.createdAt)}</span>

          <span className="text-[#3f3f46]">·</span>

          <span className={statusStyle}>
            ● {review.status}
          </span>
        </div>

        {/* Divider */}
        <div className="my-12 h-px bg-white/[0.08]" />

        {/* AI review */}
        <section>
          <div className="mb-7 flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-[0.25em] text-[#a78bfa]">
              AI Review
            </div>

            <div className="font-mono text-xs text-[#52525b]">
              {review.aiProvider || 'Gemini'}
            </div>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.025] p-6 backdrop-blur-sm sm:p-8">
            <div className="whitespace-pre-wrap font-mono text-sm leading-7 text-[#b8bac2]">
              {review.reviewText}
            </div>
          </div>
        </section>

      </main>
    </div>
  );
}