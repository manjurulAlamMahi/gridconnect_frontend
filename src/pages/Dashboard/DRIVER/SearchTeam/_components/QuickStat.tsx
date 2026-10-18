
export default function QuickStats({
  stats,
}: {
  stats: Record<string, string | number>;
}) {
  const entries = Object.entries(stats);

  return (
    <div className="space-y-3">
      <div className="rounded-lg border border-neutral-800 p-3 ">
        <h6 className="text-sm text-white/80 mb-2">Quick Stats</h6>

        <div className="space-y-2">
          {entries.map(([k, v]) => (
            <div
              key={k}
              className="rounded-lg border border-neutral-800 p-3 bg-[#1A1616]"
            >
              <div className="text-xs text-white/70">{k}</div>
              <div className="mt-1 font-medium text-white">{v}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="rounded-lg border border-neutral-800 p-3 bg-[#1A1616] text-sm text-white/90">
        <div className="text-xs text-white/70 mb-2">Description</div>
        <div>
          Full-season seat with testing program. Looking for consistent quali
          pace and feedback on aero balance.
        </div>
      </div>
    </div>
  );
}
