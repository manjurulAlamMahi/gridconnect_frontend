import Icon from "@/components/shared/Icon";
import CircleIcon from "@/assets/Icons/circle.svg";
import Checkmark from "@/assets/Icons/circle_mark.svg";
import CardIcon from "@/assets/Icons/touch.svg";
import EyeIcon from "@/assets/Icons/eye.svg";
import { Card, CardContent } from "@/components/ui/card";
import { ProfileHighlightCard } from "../../pages/Dashboard/DRIVER/Home/_components/ProfileCard";
import {
  useGetProfileCompletionQuery,
  useGetDriverComprehensiveStatusQuery,
} from "@/redux/endpoints/driver/driver.api";

export default function ProfileCompletion() {
  const { data, isLoading, error } = useGetProfileCompletionQuery();
  const { data: statusData } = useGetDriverComprehensiveStatusQuery();
  const percent = data?.data?.profile_completion_percentage || 0;

  const status = statusData?.data;
  const verificationStatus = status?.verification_status?.status ?? "—";
  const planName = status?.subscription?.plan_name ?? "No plan";
  // const totalTokens = status?.subscription?.total_tokens ?? 0;
  const totalViews = status?.profile_views?.total_views ?? 0;
  // const uniqueTeamViews = status?.profile_views?.unique_team_views ?? 0;

  const verificationColor =
    verificationStatus === "verified" || verificationStatus === "success"
      ? "#22c55e"
      : verificationStatus === "pending"
        ? "#eab308"
        : "white";

  const highlightCards = [
    {
      id: "verification",
      title: "Verification Status",
      emphasis:
        verificationStatus.charAt(0).toUpperCase() +
        verificationStatus.slice(1),
      emphasisColor: verificationColor,
      icon: Checkmark,
    },
    {
      id: "plan",
      title: "Subscription Plan",
      emphasis: planName,
      // meta: `${totalTokens} tokens remaining`,
      icon: CardIcon,
    },
    {
      id: "views",
      title: "Profile Views",
      emphasis: String(totalViews),
      // meta: `${uniqueTeamViews} unique teams`,
      icon: EyeIcon,
    },
  ];

  if (isLoading) {
    return (
      <div>
        <Card className="bg-[linear-gradient(154deg,#0F0E0E_30%,rgba(51,15,14,0.85)_66%,#0F0E0E_98%)] border rounded-[12px] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/30">
                  <Icon src={CircleIcon} className="h-5 w-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-accent leading-tight">
                    Profile Completion
                  </h3>
                  <p className="text-xs text-accent/60 mt-1 truncate">
                    Loading...
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (error) {
    return (
      <div>
        <Card className="bg-[linear-gradient(154deg,#0F0E0E_30%,rgba(51,15,14,0.85)_66%,#0F0E0E_98%)] border rounded-[12px] shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-start justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/30">
                  <Icon src={CircleIcon} className="h-5 w-5 text-red-500" />
                </div>
                <div className="min-w-0">
                  <h3 className="text-sm font-medium text-accent leading-tight">
                    Profile Completion
                  </h3>
                  <p className="text-xs text-accent/60 mt-1 truncate">
                    Failed to load profile completion
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div>
      <Card className="bg-[linear-gradient(154deg,#0F0E0E_30%,rgba(51,15,14,0.85)_66%,#0F0E0E_98%)] border rounded-[12px] shadow-sm">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-4">
            <div className="flex items-start gap-3">
              <div className="flex items-center justify-center h-10 w-10 rounded-full bg-primary/30">
                <Icon src={CircleIcon} className="h-5 w-5 text-red-500" />
              </div>

              <div className="min-w-0">
                <h3 className="text-sm font-medium text-accent leading-tight">
                  Profile Completion
                </h3>
                <p className="text-xs text-accent/60 mt-1 truncate">
                  Complete your profile to increase visibility
                </p>
              </div>
            </div>

            <div className="shrink-0 text-right">
              <div className="text-lg font-semibold text-slate-100">
                {percent}%
              </div>
            </div>
          </div>

          <div className="mt-4">
            <div className="h-2 rounded-full bg-white/6 overflow-hidden">
              <div
                className="h-full rounded-full bg-linear-to-r from-red-600 to-red-700 shadow-sm"
                style={{ width: `${percent}%` }}
              />
            </div>
          </div>
        </CardContent>
      </Card>
      <div>
        <div className="mt-6 grid gap-3 md:grid-cols-3">
          {highlightCards.map(({ id, ...card }) => (
            <ProfileHighlightCard key={id} {...card} />
          ))}
        </div>
      </div>
    </div>
  );
}
