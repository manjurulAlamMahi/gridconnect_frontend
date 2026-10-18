import { ShieldCheck } from "lucide-react";

export default function CompanyInfo({
  logo,
  company,
  location,
  tags = [],
  license,
  budget,
  actions,
}: {
  logo?: string;
  company: string;
  location?: string;
  tags?: string[];
  license?: string;
  budget?: string;
  actions?: React.ReactNode;
}) {
  return (
    <div className="bg-[#0b0b0c] border border-neutral-800 rounded-lg p-4">
      <div className="flex items-start gap-4">
        {logo ? (
          <img
            src={logo}
            alt={company}
            className="w-[142px] h-[142px] rounded-md"
          />
        ) : (
          <div className="bg-neutral-700  " />
        )}

        <div className="flex-1">
          <div className="flex items-center justify-between">
            <div>
              <h4 className="text-white font-semibold flex gap-2 items-center">
                {company} <ShieldCheck className="text-primary w-5 h-5" />{" "}
              </h4>
              <p className="text-sm text-white/70">{location}</p>
            </div>
            {actions}
          </div>

          <div className="mt-3 grid grid-cols-3 gap-3">
            <div className="p-3 rounded-lg border border-neutral-800 bg-[#0c0c0d] text-sm">
              <div className="text-xs text-white/70 mb-2">Discipline</div>
              <div className="flex flex-wrap gap-2">
                {tags.map((t) => (
                  <span
                    key={t}
                    className="text-xs px-3 py-0.5 rounded-full bg-red-600/90 text-white"
                  >
                    {t}
                  </span>
                ))}
              </div>
            </div>
            <div className="p-3 rounded-lg border border-neutral-800 bg-[#0c0c0d] text-sm">
              <div className="text-xs text-white/70">License Required</div>
              <div className="mt-1 font-medium text-white">{license}</div>
            </div>

            <div className="p-3 rounded-lg border border-neutral-800 bg-[#0c0c0d] text-sm">
              <div className="text-xs text-white/70">Budget Range</div>
              <div className="mt-1 font-medium text-white">{budget}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
