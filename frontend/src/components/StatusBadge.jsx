const STYLES = {
  posted: 'text-emerald-400',
  failed: 'text-red-400',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? 'text-[#71717a]';

  const symbol =
    status === 'posted'
      ? '●'
      : status === 'failed'
        ? '●'
        : '●';

  return (
    <span
      className={`inline-flex shrink-0 items-center gap-1.5 font-mono text-xs ${style}`}
    >
      <span className="text-[7px]">{symbol}</span>
      {status}
    </span>
  );
}