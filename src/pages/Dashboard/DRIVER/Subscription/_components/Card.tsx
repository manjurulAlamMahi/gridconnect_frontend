import { CircleCheckBig } from "lucide-react";

export type Plan = {
  id: string;
  title: string;
  price: string;
  period?: string | null;
  renewalDate?: string | null;
  tokensRemaining?: number | null;
  features?: string[];
  isActive?: boolean;
  isPopular?: boolean;
};

type Props = {
  plan: Plan;
  onBuyTokens?: (planId: string) => void;
  onPrimary?: (planId: string) => void;
  isLoading?: boolean;
  hasActivePlan?: boolean;
};

const formatRenewalDate = (value?: string | null) => {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return null;

  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  }).format(parsed);
};

//onBuyTokens inside the parameters is for the button that will be shown if tokensRemaining is not null. It will call the function passed from the parent component with the plan id when clicked. The onPrimary function is for the main action button (Buy Now) and will also receive the plan id when clicked.
export default function CardChild({
  plan,
  onPrimary,
  isLoading = false,
  hasActivePlan = false,
}: Props) {
  const {
    id,
    title,
    price,
    period = "/month",
    renewalDate,
    tokensRemaining,
    features = [],
    isActive = false,
    isPopular = false,
  } = plan;

  const formattedRenewalDate = formatRenewalDate(renewalDate);
  const showTokens = typeof tokensRemaining === "number";
  const getButtonText = () => {
    if (hasActivePlan) return "Upgrade Plan";
    return "Buy Now";
  };

  const buttonText = getButtonText();
  return (
    <article
      aria-labelledby={`card-${id}`}
      className={`rounded-2xl border px-4 py-6 sm:px-6 sm:py-7 text-white transition hover:-translate-y-1 ${
        isActive
          ? "bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,0,0,0.25)]"
          : "bg-[#1A1A1A] hover:shadow-[0_0_30px_rgba(255,0,0,0.25)] hover:border-primary/40"
      }`}
    >
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <h3 id={`card-${id}`} className="text-xl font-extrabold">
              {title}
            </h3>
            {isPopular && (
              <span className="inline-flex items-center rounded-full bg-[#401A1B] px-3 py-1 text-xs font-semibold text-[#D71920]">
                MOST POPULAR
              </span>
            )}
          </div>
          <div className="flex items-baseline gap-2 text-gray-400">
            <span className="text-3xl font-semibold text-white">{price}</span>
            {period && <span className="text-sm text-gray-500">{period}</span>}
          </div>
        </div>

        <div className="flex flex-wrap justify-end gap-2">
          {isActive && (
            <span className="inline-flex items-center rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-[0_0_30px_rgba(16,185,129,0.4)]">
              Active
            </span>
          )}
        </div>
      </header>

      {formattedRenewalDate && (
        <div className="mt-5 flex items-center justify-between border-y border-white/5 py-4 text-sm">
          <span className="text-gray-400">Renewal Date</span>
          <span className="font-semibold text-white">
            {formattedRenewalDate}
          </span>
        </div>
      )}

      {features.length > 0 && (
        <ul className="space-y-3 border-t border-white/5 pt-5 text-sm text-gray-200">
          {features.map((feature, index) => (
            <li key={index} className="flex items-center gap-3">
              <span
                className="flex h-5 w-5 items-center justify-center text-primary"
                aria-hidden="true"
              >
                <CircleCheckBig />
              </span>
              <span className="flex-1">{feature}</span>
            </li>
          ))}
        </ul>
      )}

      {showTokens && isActive && (
        <div className="space-y-4 pt-5">
          <div className="flex flex-col gap-2 text-sm text-gray-300 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center gap-2 font-medium text-gray-300">
              <span
                className="flex h-8 w-8 items-center justify-center rounded-full bg-red-500/15 text-red-400"
                aria-hidden="true"
              >
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M7 12H17M12 7V17"
                    stroke="currentColor"
                    strokeWidth="1.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </span>
              Tokens Remaining
            </div>
            <span className="font-semibold text-red-400 sm:text-right">
              {tokensRemaining} Tokens
            </span>
          </div>
        </div>
      )}

      <footer className="pt-6">
        <button
          type="button"
          onClick={() => onPrimary?.(id)}
          disabled={isLoading}
          aria-label={`${buttonText} ${title}`}
          className="w-full rounded-lg border border-white/10 cursor-pointer bg-transparent py-3 text-sm font-semibold text-gray-200 transition hover:border-white/30 hover:bg-white/5 focus:outline-none focus:ring-2 focus:ring-white/40 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? "Processing..." : buttonText}
        </button>
      </footer>
    </article>
  );
}
