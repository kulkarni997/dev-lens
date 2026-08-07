const STYLES = {
  posted: 'text-[#3FB950] bg-[#3FB950]/10 border-[#3FB950]/30',
  failed: 'text-[#F85149] bg-[#F85149]/10 border-[#F85149]/30',
};

export default function StatusBadge({ status }) {
  const style = STYLES[status] ?? 'text-[#8B93A7] bg-[#8B93A7]/10 border-[#8B93A7]/30';
  const symbol = status === 'posted' ? '+' : status === 'failed' ? '−' : '·';

  return (
    <span
      className={`inline-flex items-center gap-1 rounded border px-2 py-0.5 font-mono text-xs ${style}`}
    >
      {symbol} {status}
    </span>
  );
}