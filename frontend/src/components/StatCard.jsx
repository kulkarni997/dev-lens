export default function StatCard({ label, value }) {
  return (
    <div className="group bg-[#0b0c10]/80 px-6 py-7 text-center backdrop-blur-sm transition-colors duration-300 hover:bg-white/[0.035] sm:px-8">
      <div className="font-mono text-3xl font-medium tracking-tight text-[#f4f4f5] sm:text-4xl">
        {value}
      </div>

      <div className="mt-2 font-mono text-xs uppercase tracking-[0.18em] text-[#71717a]">
        {label}
      </div>
    </div>
  );
}