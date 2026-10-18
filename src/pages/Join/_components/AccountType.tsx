import Icon from "@/components/shared/Icon";
import Car from "@/assets/Icons/car.svg";
import HelmateIcon from "@/assets/Icons/helmate.svg";
import AccountCard from "./AccountCard";
import useModal from "@/components/Modal/useModal";
import { useNavigate } from "react-router";
import { useGetGruidConnectDataQuery } from "@/redux/endpoints/join/join.api";
import { Skeleton } from "@/components/ui/skeleton";
import type {
  GridConnectDriver,
  GridConnectHeader,
  GridConnectTeam,
} from "@/types/gridconnect";

export default function AccountType({
  backgroundImage,
}: {
  backgroundImage?: string;
}) {
  const { open } = useModal();
  const navigate = useNavigate();
  const { data: gridData, isLoading } = useGetGruidConnectDataQuery({});

  const handleNavigate = (role: "driver" | "team") => {
    open([{ modalId: "role", openId: role }]);
    navigate(`/join/signup?role=${role}`);
  };

  const headerData = gridData?.data?.find(
    (item) => "grid_title" in item,
  ) as GridConnectHeader;
  const driverData = gridData?.data?.find(
    (item) => "driver_description" in item,
  ) as GridConnectDriver;
  const teamData = gridData?.data?.find(
    (item) => "team_description" in item,
  ) as GridConnectTeam;

  const roles = [
    {
      title: "I'm a Driver",
      roleId: "driver" as const,
      subtitle:
        driverData?.driver_description ||
        "Looking to connect with racing teams and advance my motorsport career.",
      bullets: driverData?.driver_features
        ? driverData.driver_features
            .split(/<br\s*\/?>/)
            .map((f) => f.trim())
            .filter((f) => f)
        : [
            "Create your driver profile",
            "Showcase achievements & licenses",
            "Connect with verified teams",
            "Manage contract offers",
          ],
      icon: <Icon src={HelmateIcon} />,
      cta: "Get Started as Driver",
      onClick: () => handleNavigate("driver"),
    },
    {
      title: "I'm a Team",
      roleId: "team" as const,
      subtitle:
        teamData?.team_description ||
        "Seeking talented drivers to join our racing team.",
      bullets: teamData?.team_features
        ? teamData.team_features
            .split(/<br\s*\/?>/)
            .map((f) => f.trim())
            .filter((f) => f)
        : [
            "Post team opportunities",
            "Search verified drivers",
            "Manage team roster",
            "Set budget parameters",
          ],
      icon: <Icon src={Car} />,
      cta: "Get Started as Team",
      onClick: () => handleNavigate("team"),
    },
  ];

  return (
    <section className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden">
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/80" />

      {/* Foreground */}
      <div className="relative z-10 w-full text-center px-6">
        {isLoading ? (
          <div className="flex flex-col items-center">
            <Skeleton className="h-16 w-3/4 md:w-1/2 mb-4 bg-white/10" />
            <Skeleton className="h-6 w-2/3 md:w-1/3 mb-12 bg-white/10" />
            <div className="flex flex-wrap justify-center gap-6 md:gap-8 lg:gap-10 xl:gap-12">
              <Skeleton className="h-[450px] w-full sm:w-[400px] md:w-[380px] lg:w-[420px] rounded-2xl bg-white/10" />
              <Skeleton className="h-[450px] w-full sm:w-[400px] md:w-[380px] lg:w-[420px] rounded-2xl bg-white/10" />
            </div>
          </div>
        ) : (
          <>
            <div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold text-white leading-tight">
                {headerData?.grid_title.split(" ")[0]}{" "}
                <span className="text-primary">
                  {headerData?.grid_title.split(" ").slice(1).join(" ")}
                </span>
              </h1>
              <p className="mt-4 text-accent/70 text-lg max-w-2xl mx-auto">
                {headerData?.grid_description}
              </p>
            </div>

            <div className="mt-12 flex flex-wrap justify-center items-stretch gap-6 md:gap-8 lg:gap-10 xl:gap-12">
              {roles.map((role) => (
                <div
                  key={role.title}
                  className="w-full sm:w-[400px] md:w-[380px] lg:w-[420px] cursor-pointer"
                  onClick={role.onClick}
                >
                  <AccountCard
                    title={role.title}
                    subtitle={role.subtitle}
                    bullets={role.bullets}
                    href="#"
                    icon={role.icon}
                    cta={role.cta}
                  />
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </section>
  );
}
