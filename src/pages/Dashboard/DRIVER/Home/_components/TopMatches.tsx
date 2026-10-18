import Icon from "@/components/shared/Icon";
import { MoveRight } from "lucide-react";
import Circle from "@/assets/Icons/circle.svg";
import TopMachingCard from "./TopMachingCard";
import { useGetTeamMatchingQuery } from "@/redux/endpoints/driver/stats.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

const TopMatches = () => {
  const { data: response, isLoading } = useGetTeamMatchingQuery();

  const matches = response?.data || [];

  return (
    <section className="rounded-[12px] my-6">
      <div className="mb-6 flex flex-col gap-3 text-sm text-accent sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#281219] p-2 text-primary">
            <Icon src={Circle} />
          </span>
          <div>
            <p className="text-[20px] font-semibold text-white">Top Matches</p>
            <p className="text-xs text-white/60">
              Tailored suggestions based on your profile
            </p>
          </div>
        </div>
        <Link
          to="/driver/dashboard/search-team"
          className="group inline-flex items-center gap-2 self-start text-xs font-medium text-accent/70 transition hover:text-primary"
        >
          <span className="group-hover:text-primary">Search All Teams</span>
          <span aria-hidden className="group-hover:text-primary">
            <MoveRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {isLoading ? (
          <>
            {[...Array(3)].map((_, index) => (
              <div
                key={index}
                className="rounded-[12px] border border-white/10 bg-[#1A1A1A] p-4"
              >
                <div className="flex items-center gap-3 mb-4">
                  <Skeleton className="h-12 w-12 rounded-full bg-white/10" />
                  <div className="flex-1 space-y-2">
                    <Skeleton className="h-4 w-3/4 bg-white/10" />
                    <Skeleton className="h-3 w-1/2 bg-white/10" />
                  </div>
                </div>
                <div className="space-y-2">
                  <Skeleton className="h-3 w-full bg-white/10" />
                  <Skeleton className="h-3 w-2/3 bg-white/10" />
                </div>
              </div>
            ))}
          </>
        ) : (
          matches.map((match) => (
            <TopMachingCard
              key={match.team_id}
              teamId={match.team_id}
              logo={match.team_logo}
              name={match.team_name}
              country="" // API doesn't provide country, keeping empty for now
              category={`${match.matched_disciplines}/${match.total_disciplines} disciplines matched`}
              matchScore={match.match_percentage}
              accent="#1F4A3A" // Default accent, could be customized based on match percentage
            />
          ))
        )}
      </div>
    </section>
  );
};
export default TopMatches;
