export default function SkeletonCard() {
  return (
    <div className="rounded-2xl overflow-hidden bg-slate-900 border border-white/5">
      <div className="relative h-[280px] bg-slate-800 animate-shimmer overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-800 via-slate-700/50 to-slate-800 animate-pulse" />
      </div>
    </div>
  );
}
