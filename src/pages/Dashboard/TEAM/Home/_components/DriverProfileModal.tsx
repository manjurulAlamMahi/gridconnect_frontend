import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import Icon from "@/components/shared/Icon";
import { cn } from "@/lib/utils";
import {
  ShieldCheck,
  Download,
  X,
  Loader2,
  Award,
  EllipsisVertical,
} from "lucide-react";
import type { MatchingDriver } from "@/types/team";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";

// Asset Imports
import RocketIcon from "@/assets/Icons/rocket.svg";
import LicenceType from "@/assets/Icons/check_licencetype.svg";
// import DollarIcon from "@/assets/Icons/dollar.svg"; // Not using budget for now
import TrophyIcon from "@/assets/Icons/tropphy.svg";
import UserVerification from "@/assets/Icons/verification_user.svg";
import VerifiedBadge from "@/assets/Icons/verifiedbedge.svg";

interface DriverProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  driver: MatchingDriver;
}

export default function DriverProfileModal({
  open,
  onOpenChange,
  driver,
}: DriverProfileModalProps) {
  const navigate = useNavigate();
  const [startConversation, { isLoading }] = useStartConversationMutation();

  const handleStartChat = async () => {
    try {
      const response = await startConversation({
        with_id: driver.driver_id,
        with_type: "driver",
      }).unwrap();

      if (response.status === "success") {
        toast.success("Conversation started");
        onOpenChange(false);
        navigate(
          `/team/dashboard/message?conversation_id=${response.data.conversation_id}`,
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  const handleDownloadCV = () => {
    if (driver.cv) {
      window.open(driver.cv, "_blank");
    }
  };

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Helper to get styling based on match percentage for "verification" style badges
  const getMatchVariant = (percentage: number) => {
    if (percentage >= 80) return "success";
    if (percentage >= 50) return "pending";
    return "rejected";
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-6xl w-[95%] max-h-[85vh] overflow-y-auto border border-primary/60 bg-[#151515] text-white p-0 rounded-3xl"
        showCloseButton={false}
      >
        <div className="border-b border-white/10 px-6 py-4 flex justify-between items-center">
          <h2 className="text-lg font-semibold">Driver Profile</h2>
          <button
            onClick={() => onOpenChange(false)}
            className="p-2 rounded-full hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="h-5 w-5 text-white/70" />
          </button>
        </div>

        <div className="px-6 pb-6 pt-4 space-y-5">
          <div className="flex flex-col gap-4">
            {/* Top Actions Row */}
            <div className="flex items-end justify-end">
              <div className="flex flex-wrap items-center gap-3">
                {driver.cv && (
                  <Button
                    variant="outline"
                    onClick={handleDownloadCV}
                    className="h-9 border-white/20 text-sm font-semibold text-white hover:bg-white/5 gap-2"
                  >
                    <Download className="h-4 w-4" />
                    Download CV
                  </Button>
                )}

                <Button
                  onClick={handleStartChat}
                  disabled={isLoading}
                  className="h-9 bg-primary px-4 text-sm font-semibold hover:bg-primary/90"
                >
                  {isLoading ? (
                    <Loader2 className="animate-spin h-4 w-4 mr-2" />
                  ) : null}
                  Start Chat
                </Button>
                <button className="rounded-full border border-white/20 p-2 text-white/70 hover:text-white">
                  <EllipsisVertical className="h-4 w-4" />
                </button>
              </div>
            </div>

            {/* Profile Header Block */}
            <div className="flex items-start gap-4 w-full">
              <Avatar className="h-32 w-32 sm:h-38 sm:w-38 border border-white/10 rounded-none shrink-0">
                <AvatarImage src={driver.image || "/placeholder.png"} alt={driver.name} />
                <AvatarFallback className="text-3xl">
                  {getInitials(driver.name || "Driver")}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-xl sm:text-2xl font-semibold">
                    {driver.name}
                  </p>
                  <ShieldCheck className="h-5 w-5 text-primary" />
                </div>
                <p className="text-sm text-white/70">
                  {driver.nationality || "Unknown Nationality"}
                </p>

                <div className="grid gap-4 grid-cols-2 lg:grid-cols-4">
                  <InfoTile
                    label="Match Score"
                    value={`${driver.match_percentage}%`}
                    icon={VerifiedBadge}
                    valueClassName="text-primary"
                  />
                  <InfoTile
                    label="License Type"
                    value={driver.license_type || "N/A"}
                    icon={LicenceType}
                  />
                  <InfoTile
                    label="Experience"
                    value={driver.experience || "N/A"}
                    icon={LicenceType}
                  />
                  <InfoTile
                    label="Disciplines"
                    value={`${driver.matched_disciplines}/${driver.total_disciplines}`}
                    icon={RocketIcon}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Main Content Grid */}
          <div className="grid gap-4 lg:grid-cols-4">
            {/* Left Column (Stats + Bio) */}
            <div className="rounded-2xl border border-white/10 p-4 lg:col-span-2 space-y-4">
              <SectionTitle
                icon={
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 16 16"
                    fill="none"
                  >
                    <path
                      d="M2.87868 13.1213C2 12.2427 2 10.8284 2 8C2 5.17157 2 3.75736 2.87868 2.87868C3.75736 2 5.17157 2 8 2C10.8284 2 12.2427 2 13.1213 2.87868C14 3.75736 14 5.17157 14 8C14 10.8284 14 12.2427 13.1213 13.1213C12.2427 14 10.8284 14 8 14C5.17157 14 3.75736 14 2.87868 13.1213Z"
                      stroke="#D3D3D3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                    <path
                      d="M4 8.00016H5.66667L7 5.3335L9 10.6668L10.3333 8.00016H12"
                      stroke="#D3D3D3"
                      strokeWidth="1.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                }
              >
                Racing Statistics
              </SectionTitle>

              <div className="grid gap-4 md:grid-cols-3">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Matches</p>
                  <p className="text-2xl font-semibold">
                    {driver.matched_disciplines}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Total</p>
                  <p className="text-2xl font-semibold">
                    {driver.total_disciplines}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 space-y-3">
                  <p className="text-sm text-white/60">Disciplines</p>
                  <div className="flex flex-wrap gap-2">
                    {driver.disciplines?.slice(0, 3).map((item) => (
                      <Badge
                        key={item.id}
                        className="bg-primary hover:bg-primary/80 text-[10px] px-1.5 py-0.5"
                      >
                        {item.name}
                      </Badge>
                    ))}
                    {driver.disciplines?.length > 3 && (
                      <Badge
                        variant="outline"
                        className="text-[10px] px-1.5 py-0.5"
                      >
                        +{driver.disciplines.length - 3}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white/80 mb-1">
                  Short Bio
                </p>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70 min-h-[100px]">
                  {driver.bio || "No bio available."}
                </div>
              </div>
            </div>

            {/* Achievements Column */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <SectionTitle icon={<Icon src={TrophyIcon} />}>
                Achievements
              </SectionTitle>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
                {driver.achievements && driver.achievements.length > 0 ? (
                  driver.achievements.map((achievement, idx) => (
                    <div
                      key={`${achievement.title}-${idx}`}
                      className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                    >
                      <span className="shrink-0 rounded-full p-1.5 text-yellow-400 bg-yellow-400/10">
                        <Award className="h-4 w-4" />
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium truncate">
                          {achievement.title}
                        </p>
                        <p className="text-xs text-white/50">
                          {achievement.year} • {achievement.position}
                        </p>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-white/50 italic">
                    No achievements listed.
                  </p>
                )}
              </div>
            </div>

            {/* Verification/Status Column */}
            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <SectionTitle icon={<Icon src={UserVerification} />}>
                Match Status
              </SectionTitle>
              <div className="space-y-3">
                <StatusItem
                  label="Match Percentage"
                  status={`${driver.match_percentage}% Match`}
                  variant={getMatchVariant(driver.match_percentage)}
                />
                <StatusItem
                  label="License"
                  status={driver.license_type ? "Provided" : "Missing"}
                  variant={driver.license_type ? "success" : "pending"}
                />
                <StatusItem
                  label="CV"
                  status={driver.cv ? "Available" : "Missing"}
                  variant={driver.cv ? "success" : "pending"}
                />
              </div>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

function InfoTile({
  label,
  value,
  icon,
  valueClassName,
}: {
  label: string;
  value: string | number;
  icon?: string;
  valueClassName?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
      <div className="flex items-center gap-2">
        {icon && <Icon src={icon} className="h-4 w-4" />}
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      </div>
      <p className={cn("text-sm font-semibold truncate", valueClassName)}>
        {value}
      </p>
    </div>
  );
}

function SectionTitle({
  children,
  icon,
}: {
  children: React.ReactNode;
  icon: React.ReactNode;
}) {
  return (
    <div className="flex items-center gap-2 text-sm font-semibold text-white/80">
      <span className="inline-flex h-7 w-7 items-center justify-center rounded-full">
        {icon}
      </span>
      {children}
    </div>
  );
}

const statusStyles = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  rejected: "bg-red-500/15 text-red-400 border-red-500/40",
};

function StatusItem({
  label,
  status,
  variant,
}: {
  label: string;
  status: string;
  variant: "success" | "pending" | "rejected";
}) {
  return (
    <div className="rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm">
      <p className="text-xs text-white/50">{label}</p>
      <span
        className={cn(
          "mt-1 inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs font-semibold",
          statusStyles[variant],
        )}
      >
        <span className="h-2 w-2 rounded-full bg-current" />
        {status}
      </span>
    </div>
  );
}
