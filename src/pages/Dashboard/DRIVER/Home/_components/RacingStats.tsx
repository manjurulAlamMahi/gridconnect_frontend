import Icon from "@/components/shared/Icon";
import { Card, CardContent } from "@/components/ui/card";
import BadgeIcon from "@/assets/Icons/badge.svg";
import { useGetRacingStatsQuery } from "@/redux/endpoints/driver/stats.api";
import { Skeleton } from "@/components/ui/skeleton";

const RacingStats = () => {
  const { data: response, isLoading } = useGetRacingStatsQuery();

  const racingStats = response?.data?.stats;

  const stats = racingStats
    ? [
        {
          id: "experience",
          label: "Experience",
          value: `${racingStats.experience} Years`,
        },
        {
          id: "disciplines",
          label: "Disciplines",
          value: `${racingStats.disciplines_count}`,
        },
        {
          id: "podiums",
          label: "Podiums",
          value: `${racingStats.podiums.total}`,
          accent: "text-amber-300",
        },
        {
          id: "championships",
          label: "Championships",
          value: `${racingStats.championships}`,
          accent: "text-red-400",
        },
      ]
    : [];

  return (
    <>
      <div className="flex items-center justify-between mt-6">
        <h2 className="text-sm font-semibold tracking-[0.2em] text-accent flex gap-2 items-center pb-4">
          <Icon className="h-4 w-4" src={BadgeIcon} /> RACING STATS
        </h2>
      </div>
      <Card className="rounded-[12px] border text-accent/80 bg-[#1A1A1A]">
        <CardContent className="p-5">
          <div className="mt-5 space-y-4">
            {isLoading ? (
              <>
                {[...Array(4)].map((_, index) => (
                  <div key={index}>
                    <div className="flex items-center justify-between text-sm space-y-2">
                      <Skeleton className="h-4 w-20 bg-white/10" />
                      <Skeleton className="h-4 w-12 bg-white/10" />
                    </div>
                    {index < 3 && (
                      <div className="mt-4 border-t border-white/5" />
                    )}
                  </div>
                ))}
              </>
            ) : (
              stats.map(({ id, label, value, accent }) => (
                <div key={id}>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-accent/60">{label}</span>
                    <span
                      className={`font-semibold ${accent ?? "text-accent"}`}
                    >
                      {value}
                    </span>
                  </div>
                  {id !== stats[stats.length - 1].id && (
                    <div className="mt-4 border-t border-white/5" />
                  )}
                </div>
              ))
            )}
          </div>
        </CardContent>
      </Card>
    </>
  );
};
export default RacingStats;
