// import Icon from "@/components/shared/Icon";
import { ChevronLeft, ChevronRight } from "lucide-react";
// import Search from "@/assets/Icons/Icon - Search.svg";
// import { Input } from "@/components/ui/input";
import ProfileCompletion from "./_components/ProfileCompletion";
import TopMatches from "./_components/TopMatches";
import RecentMessages from "./_components/RecentMessages";
import RecentActivity from "../../../../components/shared/RecentActivity";
import RacingStatsTeam from "./_components/RacingStats";
import { useTeamProfile } from "@/providers/TeamProfileProvider";
import { useSEO } from "@/hooks/use-seo";

const DashboardHome = () => {
  const { data } = useTeamProfile();
  const teamProfile = data?.data?.team;
  const userName = teamProfile?.team_name || "Team";

  useSEO({
    title: "Team Dashboard",
    description: `Welcome back, ${userName}! Find the best racing drivers and manage your team.`,
  });

  return (
    <section className="px-4 sm:px-0">
      {/* Navigation and Breadcrumb */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-4">
          <div className="flex gap-2.5">
            <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6 cursor-pointer" />
            <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6 cursor-pointer" />
          </div>
          <p className="text-sm font-medium">Home</p>
        </div>

        {/* Search Bar - moves to top on mobile */}
        {/* <div className="w-full sm:w-auto">
          <div className="relative max-w-[360px] sm:max-w-[420px] lg:max-w-[480px] mx-auto sm:mx-0">
            <div className="absolute left-0 top-1/2 -translate-y-1/2 flex items-center justify-center w-10 lg:w-14">
              <Icon src={Search} />
            </div>
            <Input
              placeholder="Search"
              className="w-full bg-[#0D0D0D] text-sm placeholder:text-white/50 rounded-full pl-12 pr-4 border border-primary/30 text-white"
            />
          </div>
        </div> */}
      </div>

      {/* Welcome Section */}
      <div className="mt-6 lg:mt-[26px]">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <h1 className="text-2xl lg:text-3xl font-semibold text-white">
            Welcome back, <span className="text-primary">{userName}</span>
          </h1>
        </div>
      </div>

      {/* Main Content */}
      <main className="mt-6 flex flex-col xl:flex-row gap-6">
        {/* Left Column - Main Content */}
        <div className="w-full xl:w-[75%] space-y-6">
          <ProfileCompletion />
          <TopMatches />
          <RecentMessages />
        </div>

        {/* Right Column - Sidebar Content */}
        <div className="w-full xl:w-[25%] space-y-6">
          <RecentActivity />
          <RacingStatsTeam />
        </div>
      </main>
    </section>
  );
};
export default DashboardHome;
