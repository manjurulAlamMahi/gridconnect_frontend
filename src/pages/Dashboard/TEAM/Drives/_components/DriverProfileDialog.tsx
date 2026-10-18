/* eslint-disable @typescript-eslint/no-explicit-any */
import Icon from "@/components/shared/Icon";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import RocketIcon from "@/assets/Icons/rocket.svg";
import LicenceType from "@/assets/Icons/check_licencetype.svg";
import DollarIcon from "@/assets/Icons/dollar.svg";
import TrophyIcon from "@/assets/Icons/tropphy.svg";
import UserVerification from "@/assets/Icons/verification_user.svg";
import useModal from "@/components/Modal/useModal";
import { cn } from "@/lib/utils";
import { Award, ShieldCheck } from "lucide-react";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type DriverProfile = {
  name: string;
  avatar: string;
  country: string;
  disciplineCount: number;
  licenseType: string;
  experience: string;
  dateOfBirth: string;
  disciplines: string[];
  championships: number;
  podiums: number;
  achievements: string[];
  bio: string;
  verification: {
    idStatus: string;
    idVariant: "success" | "pending";
    licenseStatus: string;
    licenseVariant: "success" | "pending";
  };
};

type DriverProfileDialogProps = {
  driver: DriverProfile;
  triggerClassName?: string;
  driverId: string;
  requestId?: number;
  status?: string;
  onAction?: (action: "approved" | "rejected") => void;
  isLoading?: boolean;
};

const statusStyles = {
  success: "bg-emerald-500/15 text-emerald-400 border-emerald-500/40",
  pending: "bg-yellow-500/15 text-yellow-400 border-yellow-500/40",
  rejected: "bg-red-500/15 text-red-400 border-red-500/40",
};

export default function DriverProfileDialog({
  driver,
  triggerClassName,
  driverId,
  // requestId,
  status,
  onAction,
  isLoading,
}: DriverProfileDialogProps) {
  const { Modal, open } = useModal();
  const navigate = useNavigate();
  const [startConversation, { isLoading: isStartingChat }] =
    useStartConversationMutation();

  // const isPending = status === "pending";
  const isApproved = status === "approved";
  const isRejected = status === "rejected";

  const handleStartChat = async () => {
    if (!driverId) {
      toast.error("User information is missing.");
      return;
    }

    try {
      const response = await startConversation({
        with_id: parseInt(driverId, 10),
        with_type: "driver", // Team looking at driver profiles in drives
      }).unwrap();

      toast.success("Chat started successfully!");
      navigate(
        `/team/dashboard/message?conversation_id=${response.data.conversation_id}`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  return (
    <>
      <Button
        variant="outline"
        className={cn(
          "h-11 cursor-pointer rounded-lg border-white/20 bg-transparent text-white hover:bg-white/5",
          triggerClassName,
        )}
        onClick={() => open([{ modalId: "driverProfile", openId: driverId }])}
      >
        View Profile
      </Button>

      <Modal
        modalId="driverProfile"
        openId={driverId}
        className="max-w-6xl max-h-[85vh] overflow-y-auto border border-primary/60 bg-[#151515] text-white p-0 rounded-3xl"
      >
        <div className="border-b border-white/10 px-6 py-4">
          <h2 className="text-lg font-semibold">Driver Profile</h2>
        </div>
        <div className="px-6 pb-6 space-y-5">
          <div className="flex flex-col gap-4">
            <div className="flex items-end justify-end">
              <div className="flex flex-wrap items-center gap-3">
                {onAction && (
                  <>
                    {isApproved ? (
                      <>
                        <Button
                          disabled
                          className=" bg-linear-to-b from-primary to-primary/60 px-4 text-sm font-semibold text-white opacity-60 cursor-not-allowed"
                        >
                          Accepted
                        </Button>
                        <Button
                          onClick={() => onAction("rejected")}
                          disabled={isLoading}
                          variant="outline"
                          className=" border-white/20 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50 hover:text-red-500 hover:border-red-500/50"
                        >
                          Cancel
                        </Button>
                      </>
                    ) : isRejected ? (
                      <>
                        <Button
                          onClick={() => onAction("approved")}
                          disabled={isLoading}
                          className=" bg-linear-to-b from-primary to-primary/60 px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                        >
                          Accept
                        </Button>
                        <Button
                          disabled
                          variant="outline"
                          className=" border-white/20 text-sm font-semibold text-white hover:bg-white/5 opacity-80 cursor-not-allowed"
                        >
                          Rejected
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          onClick={() => onAction("approved")}
                          disabled={isLoading}
                          className=" bg-linear-to-b from-primary to-primary/60 px-4 text-sm font-semibold text-white hover:opacity-90 disabled:opacity-50"
                        >
                          Accept
                        </Button>
                        <Button
                          onClick={() => onAction("rejected")}
                          disabled={isLoading}
                          variant="outline"
                          className=" border-white/20 text-sm font-semibold text-white hover:bg-white/5 disabled:opacity-50"
                        >
                          Reject
                        </Button>
                      </>
                    )}
                  </>
                )}

                <Button
                  onClick={handleStartChat}
                  disabled={isStartingChat}
                  className="bg-primary px-4 text-sm font-semibold hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isStartingChat ? "Starting..." : "Start Chat"}
                </Button>
                {/* <button className="rounded-full border border-white/20 p-2 text-white/70 hover:text-white">
                  <EllipsisVertical className="h-4 w-4" />
                </button> */}
              </div>
            </div>

            <div className="flex items-start gap-4 w-full">
              <Avatar className="h-38 w-38 border border-white/10 rounded-none shrink-0">
                <AvatarImage src={driver.avatar} alt={driver.name} />
                <AvatarFallback>
                  {driver.name
                    .split(" ")
                    .map((chunk) => chunk[0])
                    .join("")
                    .slice(0, 2)
                    .toUpperCase()}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 space-y-3">
                <div className="flex items-center gap-2">
                  <p className="text-lg font-semibold">{driver.name}</p>
                  <ShieldCheck className="h-4 w-4 text-primary" />
                </div>
                <p className="text-sm text-white/70">{driver.country}</p>
                <div className="grid gap-4 grid-cols-4">
                  <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-3 col-span-1">
                    <div className="flex items-center gap-2">
                      <Icon src={RocketIcon} className="h-4 w-4" />
                      <p className="text-xs uppercase tracking-wide text-white/50">
                        Disciplines
                      </p>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {driver.disciplines.map((item) => (
                        <Badge key={item} className="bg-primary">
                          {item}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <InfoTile
                    label="License Type"
                    value={driver.licenseType}
                    icon={LicenceType}
                  />
                  <InfoTile
                    label="Experience"
                    value={driver.experience}
                    icon={LicenceType}
                  />
                  <InfoTile
                    label="Date of Birth"
                    value={driver.dateOfBirth}
                    icon={DollarIcon}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="grid gap-4 lg:grid-cols-4">
            <div className="rounded-2xl border p-4 lg:col-span-2 space-y-4">
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
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                    <path
                      d="M4 8.00016H5.66667L7 5.3335L9 10.6668L10.3333 8.00016H12"
                      stroke="#D3D3D3"
                      stroke-width="1.5"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    />
                  </svg>
                }
              >
                Racing Statistics
              </SectionTitle>

              <div className="grid gap-4 md:grid-cols-2">
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Championships</p>
                  <p className="text-2xl font-semibold">
                    {driver.championships}
                  </p>
                </div>
                <div className="rounded-xl border border-white/10 bg-white/5 p-4">
                  <p className="text-sm text-white/60">Podiums</p>
                  <p className="text-2xl font-semibold">{driver.podiums}</p>
                </div>
              </div>

              <div>
                <p className="text-sm font-semibold text-white/80 mb-1">
                  Short Bio
                </p>
                <p className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-white/70">
                  {driver.bio}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <SectionTitle icon={<Icon src={TrophyIcon} />}>
                Achievements
              </SectionTitle>
              <div className="space-y-3">
                {driver.achievements.map((achievement, idx) => (
                  <div
                    key={achievement + idx}
                    className="flex items-center gap-3 rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm"
                  >
                    <span className="rounded-full p-1.5 text-yellow-400">
                      <Award className="h-4 w-4" />
                    </span>
                    <span>{achievement}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="rounded-2xl border border-white/10 bg-black/20 p-4 space-y-3">
              <SectionTitle icon={<Icon src={UserVerification} />}>
                Verification Status
              </SectionTitle>
              <div className="space-y-3">
                <StatusItem
                  label="ID Documents"
                  status={driver.verification.idStatus}
                  variant={driver.verification.idVariant}
                />
                <StatusItem
                  label="Racing License"
                  status={driver.verification.licenseStatus}
                  variant={driver.verification.licenseVariant}
                />
              </div>
            </div>
          </div>
        </div>
      </Modal>
    </>
  );
}

function InfoTile({
  label,
  value,
  icon,
}: {
  label: string;
  value: string | number;
  icon?: string;
}) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/5 p-4 space-y-2">
      <div className="flex items-center gap-2">
        {icon && <Icon src={icon} className="h-4 w-4" />}
        <p className="text-xs uppercase tracking-wide text-white/50">{label}</p>
      </div>
      <p className="text-sm font-semibold">{value}</p>
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

function StatusItem({
  label,
  status,
  variant,
}: {
  label: string;
  status: string;
  variant: "success" | "pending";
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
