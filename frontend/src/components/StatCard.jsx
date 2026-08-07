export default function StatCard({ label, value, accent = '#3FB950' }) {
  return (
    <div
      className="flex-1 rounded-md border border-[#232838] bg-[#12161F] p-4"
      style={{ borderLeft: `3px solid ${accent}` }}
    >
      <div className="font-mono text-2xl font-semibold text-[#E6E9EF]">{value}</div>
      <div className="mt-1 text-sm text-[#8B93A7]">{label}</div>
    </div>
  );
}