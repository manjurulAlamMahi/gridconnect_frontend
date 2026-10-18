import { ProfileHighlightCard } from "./ProfileCard";
import { profileHighlights } from "./profile.highlight.data";
import { useGetTeamDashboardOverviewQuery } from "@/redux/endpoints/team/team.api";

const formatDate = (value?: string) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

const formatDateRange = (from?: string, to?: string) => {
  if (!from || !to) return undefined;
  const fromLabel = formatDate(from);
  const toLabel = formatDate(to);
  if (!fromLabel || !toLabel) return undefined;
  return `${fromLabel} - ${toLabel}`;
};

export default function ProfileCompletion() {
  const { data } = useGetTeamDashboardOverviewQuery();
  const overview = data?.data;

  const highlights = profileHighlights.map((card) => {
    if (!overview) return card;

    if (card.id === "drives") {
      const total = overview.opportunities?.total;
      const active = overview.opportunities?.active;
      const inactive = overview.opportunities?.inactive;
      const meta =
        typeof active === "number" && typeof inactive === "number"
          ? `${active} active, ${inactive} inactive`
          : card.meta;

      return {
        ...card,
        emphasis: typeof total === "number" ? String(total) : card.emphasis,
        meta,
      };
    }

    if (card.id === "conversations") {
      const recent = overview.conversations?.recent_count;
      const period = overview.conversations?.period_days;
      const range = formatDateRange(
        overview.conversations?.from_date,
        overview.conversations?.to_date
      );
      const meta = range ?? (period ? `Last ${period} days` : card.meta);

      return {
        ...card,
        emphasis: typeof recent === "number" ? String(recent) : card.emphasis,
        meta,
      };
    }

    if (card.id === "plan") {
      const subscription = overview.subscription;
      const planName = subscription?.plan_name ?? subscription?.name;
      const renewalDate =
        subscription?.renews_at ??
        subscription?.renewal_date ??
        subscription?.expires_at;
      const meta = subscription
        ? renewalDate
          ? `Renews ${formatDate(renewalDate)}`
          : "Active"
        : "Not subscribed";

      return {
        ...card,
        emphasis: planName ?? (subscription ? "Active" : "No Plan"),
        meta,
      };
    }

    return card;
  });

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 w-full">
      {highlights.map(({ id, ...card }) => (
        <div key={id} className="h-full">
          <ProfileHighlightCard {...card} />
        </div>
      ))}
    </div>
  );
}
