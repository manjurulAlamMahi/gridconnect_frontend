import { cn } from "@/lib/utils";
import Icon from "../shared/Icon";
import Token from "@/assets/Icons/store.svg";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import type { TUserRole } from "@/redux/slices/authSlice";
import { useTeamProfile } from "@/providers/TeamProfileProvider";
import { useDriverProfile } from "@/providers/DriverProfileProvider";
import { useGetAvailableTokensQuery } from "@/redux/endpoints/token/token.api";
import { useState } from "react";
import useModal from "@/components/Modal/useModal";
import TokenPackagesModal from "@/components/Modal/TokenPackagesModal";

type ProfileProps = {
  role?: TUserRole;
  isCollapsed?: boolean;
};

type ProfileViewProps = {
  isCollapsed?: boolean;
  displayName: string;
  avatarSrc: string;
  roleLabel: string;
  tokens?: number;
  isTokensLoading?: boolean;
  onBuyToken?: () => void;
};

const Profile = ({ role = "driver", isCollapsed = false }: ProfileProps) => {
  const isDriver = role === "driver";

  if (isDriver) {
    return <DriverProfile role={role} isCollapsed={isCollapsed} />;
  }
  return <TeamProfile role={role} isCollapsed={isCollapsed} />;
};

const DriverProfile = ({ isCollapsed }: ProfileProps) => {
  const { data } = useDriverProfile();
  const driverProfile = data?.data?.user;
  const { open } = useModal();
  const { data: tokensData, isLoading: isTokensLoading } = useGetAvailableTokensQuery({ role: "driver" });

  const displayName = driverProfile?.name || "Driver Name";

  // Use a stable timestamp created once per session/mount to bust cache
  const [mountKey] = useState(Date.now());
  const avatarSrc = driverProfile?.image
    ? `${driverProfile.image}?t=${mountKey}`
    : "/images/avatar-placeholder.jpg";

  return (
    <>
      <ProfileView
        isCollapsed={isCollapsed}
        displayName={displayName}
        avatarSrc={avatarSrc}
        roleLabel="Driver"
        tokens={tokensData?.data?.total_tokens}
        isTokensLoading={isTokensLoading}
        onBuyToken={() => open([{ modalId: "package", openId: "token-packages" }])}
      />
      <TokenPackagesModal role="driver" />
    </>
  );
};

const TeamProfile = ({ isCollapsed }: ProfileProps) => {
  const { data } = useTeamProfile();
  const teamProfile = data?.data?.team;
  const { open } = useModal();
  const { data: tokensData, isLoading: isTokensLoading } = useGetAvailableTokensQuery({ role: "team" });

  const displayName = teamProfile?.team_name || "Team Name";

  // Use a stable timestamp created once per session/mount to bust cache
  const [mountKey] = useState(Date.now());
  const avatarSrc = teamProfile?.team_logo
    ? `${teamProfile.team_logo}?t=${mountKey}`
    : "/images/avatar-placeholder.jpg";

  return (
    <>
      <ProfileView
        isCollapsed={isCollapsed}
        displayName={displayName}
        avatarSrc={avatarSrc}
        roleLabel="Team"
        tokens={tokensData?.data?.total_tokens}
        isTokensLoading={isTokensLoading}
        onBuyToken={() => open([{ modalId: "package", openId: "token-packages" }])}
      />
      <TokenPackagesModal role="team" />
    </>
  );
};

const ProfileView = ({
  isCollapsed,
  displayName,
  avatarSrc,
  roleLabel,
  tokens,
  isTokensLoading,
  onBuyToken,
}: ProfileViewProps) => {
  if (isCollapsed) {
    return (
      <div className="w-full pt-3 md:pt-4 flex justify-center">
        <Avatar className="h-8 w-8 md:h-9 md:w-9 object-cover border-2 border-white/20">
          <AvatarImage src={avatarSrc} alt="avatar" />
          <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
        </Avatar>
      </div>
    );
  }

  return (
    <div className="w-full pt-3 md:pt-4">
      <div
        className={cn(
          "rounded-xl p-3 md:p-4 shadow-lg",
          "bg-linear-to-r from-[#0D0D0D] via-primary/30 to-red-700 border/80",
        )}
        style={{ borderRadius: 12 }}
      >
        <div className="flex items-center gap-2.5 md:gap-3">
          <Avatar className="h-10 w-10 md:h-12 md:w-12 object-cover border-2 border-white/20">
            <AvatarImage src={avatarSrc} alt="avatar" />
            <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
          </Avatar>
          <div className="flex-1 text-left">
            <div className="text-white font-semibold text-sm md:text-base truncate">
              {displayName}
            </div>
            <div className="text-white/80 text-[11px] md:text-xs">
              {roleLabel}
            </div>
          </div>
        </div>

        <div className="flex flex-wrap justify-between items-center gap-2 mt-2.5 md:mt-3">
          <div className="text-white/90 text-xs md:text-sm flex gap-2">
            <div className="flex gap-1 items-center">
              <Icon src={Token} />
              <span className="text-xs md:text-sm">
                Tokens {isTokensLoading ? "..." : tokens ?? "--"}
              </span>
            </div>
          </div>
          <div className="bg-white rounded-full">
            <button
              onClick={onBuyToken}
              className="text-[11px] md:text-xs cursor-pointer bg-linear-to-r from-[#6912D4] via-[#A614B2] to-[#ED714E] bg-clip-text text-transparent px-3 md:px-4 py-1 md:py-1.5 rounded-full font-medium shadow-sm"
            >
              Buy Token
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
