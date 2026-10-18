/**
 * Drive overview grid. Renders key/value pairs in rounded boxes.
 */
export default function InfoGrid({
  overview,
  description,
  isDriver,
}: {
  overview: Record<string, string>;
  description?: string;
  isDriver?: boolean;
}) {
  const entries = Object.entries(overview);

  return (
    <div className="mt-4 rounded-lg border border-neutral-800 p-4 ">
      <h5 className="text-sm text-white/80 mb-3">{isDriver ? "Driver Overview" : "Drive Overview"}</h5>

      <div className="grid grid-cols-2 gap-3">
        {entries.map(([k, v]) => (
          <div
            key={k}
            className="rounded-lg border p-3 bg-[#1A1616]"
          >
            <div className="text-xs text-white/70">{k}</div>
            <div className="mt-1 font-medium text-white">{v}</div>
          </div>
        ))}
      </div>

      {description && (
        <div className="mt-4">
          <div className="text-xs text-white/70 mb-1">{isDriver ? "Bio" : "Support Offered"}</div>
          <div className="rounded-lg border border-neutral-800 p-3 bg-[#1A1616] text-sm text-white/90">
            {description}
          </div>
        </div>
      )}
    </div>
  );
}
