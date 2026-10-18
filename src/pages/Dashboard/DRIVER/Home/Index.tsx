import Icon from "@/components/shared/Icon";
import { ChevronLeft, ChevronRight } from "lucide-react";
import Search from "@/assets/Icons/Icon - Search.svg";
import { Input } from "@/components/ui/input";
import ProfileCompletion from "../../../../components/shared/ProfileCompletion";
import RecentActivity from "../../../../components/shared/RecentActivity";
import RacingStats from "./_components/RacingStats";
import RacingActivity from "./_components/RacingActivity";
import TopMatches from "./_components/TopMatches";
import useAuth from "@/hooks/useAuth";
import { useSEO } from "@/hooks/use-seo";

const DashboardHome = () => {
  const { user } = useAuth();
  const userName = user?.firstName || "Driver";
  useSEO({
    title: "Driver Dashboard",
    description: `Welcome back, ${userName}! Manage your racing stats and discover new opportunities.`,
  });

  return (
    <section className="px-4 sm:px-0">
      <div className="flex gap-4">
        <p className="flex gap-2.5">
          <span>
            <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>{" "}
          <span>
            {" "}
            <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>
        </p>
        <p className="text-sm font-medium">Home</p>
      </div>
      <div className="mt-[26px] text-xl sm:text-2xl lg:text-3xl font-semibold flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="wrap-break-word">
          Welcome back, <span className="text-primary">{userName}</span>
        </h1>
        <div className="w-full sm:w-auto sm:px-5">
          <div className="relative">
            <div className="absolute left-2 top-1/2 -translate-y-1/2 pl-4">
              <Icon src={Search} />
            </div>
            <Input
              placeholder="Search"
              className="w-full sm:w-[250px] lg:w-[327px] bg-[#0D0D0D] text-sm placeholder:text-white/50 rounded-full pl-14 border border-primary/30 text-white"
            />
          </div>
        </div>
      </div>
      <main className="mt-6 flex flex-col lg:flex-row justify-between gap-6 mb-20 md:mb-8">
        <div className="w-full lg:w-[80%]">
          <ProfileCompletion />
          <RacingActivity />
          <TopMatches />
        </div>
        <div className="w-full lg:w-[20%]">
          <RecentActivity />
          <RacingStats />
        </div>
      </main>
    </section>
  );
};
export default DashboardHome;
