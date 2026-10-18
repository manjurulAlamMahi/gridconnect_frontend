import Icon from "@/components/shared/Icon";
import { MoveRight } from "lucide-react";
import Circle from "@/assets/Icons/circle.svg";
import TopMachingCard from "./TopMachingCard";
import { useGetMatchingDriversQuery } from "@/redux/endpoints/team/team.api";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "react-router";

const TopMatches = () => {
  const { data, isLoading, error } = useGetMatchingDriversQuery();
  console.log("🚀 ~ TopMatches ~ data:", data)
  

  if (isLoading) {
    return (
      <section className="rounded-[12px] my-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#281219] p-2 text-primary">
              <Icon src={Circle} />
            </span>
            <div>
              <p className="text-lg sm:text-[20px] font-semibold text-white">
                Top Matching Drivers
              </p>
              <p className="text-xs text-white/60">
                Tailored suggestions based on your profile
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {[...Array(3)].map((_, index) => (
            <div
              key={index}
              className="rounded-[20px] sm:rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(26,26,26,0.85),#0f0c0c)] p-4 sm:p-5"
            >
              <Skeleton className="h-12 w-12 sm:h-14 sm:w-14 rounded-sm mb-4" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-3 w-1/2 mb-4" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-3 w-full mb-2" />
              <Skeleton className="h-2 w-full mb-4" />
              <div className="grid grid-cols-2 gap-2 sm:gap-3">
                <Skeleton className="h-10 sm:h-11" />
                <Skeleton className="h-10 sm:h-11" />
              </div>
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="rounded-[12px] my-6">
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <span className="rounded-full bg-[#281219] p-2 text-primary">
              <Icon src={Circle} />
            </span>
            <div>
              <p className="text-lg sm:text-[20px] font-semibold text-white">
                Top Matching Drivers
              </p>
              <p className="text-xs text-white/60">
                Unable to load matching drivers
              </p>
            </div>
          </div>
        </div>
      </section>
    );
  }

  const matches = data?.data || [];

  return (
    <section className="rounded-[12px] my-6">
      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <span className="rounded-full bg-[#281219] p-2 text-primary">
            <Icon src={Circle} />
          </span>
          <div>
            <p className="text-lg sm:text-[20px] font-semibold text-white">
              Top Matching Drivers
            </p>
            <p className="text-xs text-white/60">
              Tailored suggestions based on your profile
            </p>
          </div>
        </div>
        <Link
          to="/team/dashboard/search-driver"
          className="inline-flex items-center gap-2 self-start text-xs font-medium text-accent/70 transition hover:text-primary cursor-pointer"
        >
          Search All Drivers
          <MoveRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {matches.map((driver) => (
          <TopMachingCard key={driver.driver_id} driver={driver} />
        ))}
      </div>
    </section>
  );
};
export default TopMatches;
