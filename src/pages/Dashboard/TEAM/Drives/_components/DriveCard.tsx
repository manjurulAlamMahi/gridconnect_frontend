/* eslint-disable @typescript-eslint/no-explicit-any */
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import DriverProfileDialog from "./DriverProfileDialog";
import { useNavigate } from "react-router";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { toast } from "sonner";

export type DriveOpportunity = {
  id: string;
  team: string;
  location: string;
  status: string;
  license: string;
  discipline: string;
  contract: string;
  budget: string;
  image: string;
  experience?: string;
  dateOfBirth?: string;
  disciplines?: string[];
  championships?: number;
  podiums?: number;
  achievements?: string[];
  bio?: string;
};

type DriveCardProps = {
  opportunity: DriveOpportunity;
  tab?: string;
  onDelete?: (id: string) => void;
  isDeleting?: boolean;
};

const DriveCard = ({
  opportunity,
  tab,
  onDelete,
  isDeleting,
}: DriveCardProps) => {
  const isSeasonOut = opportunity.status.toLowerCase().includes("season");
  const primaryLabel = isSeasonOut ? "View" : "Edit";
  const isActiveDriversTab = tab === "Active Drivers";
  const navigate = useNavigate();
  const [startConversation, { isLoading: isStartingChat }] =
    useStartConversationMutation();

  const handleStartChat = async () => {
    if (!opportunity.id) {
      toast.error("User information is missing.");
      return;
    }

    try {
      const response = await startConversation({
        with_id: parseInt(opportunity.id, 10),
        with_type: "driver", // Context implies it's a team examining drivers
      }).unwrap();

      toast.success("Chat started successfully!");
      navigate(
        `/team/dashboard/message?conversation_id=${response.data.conversation_id}`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  const driverProfile = isActiveDriversTab
    ? {
        name: opportunity.team,
        avatar: opportunity.image,
        country: opportunity.location,
        disciplineCount: opportunity.disciplines?.length || 0,
        licenseType: opportunity.license,
        experience: opportunity.experience || "N/A",
        dateOfBirth: opportunity.dateOfBirth || "N/A",
        disciplines: opportunity.disciplines || [],
        championships: opportunity.championships || 0,
        podiums: opportunity.podiums || 0,
        achievements: opportunity.achievements || [],
        bio: opportunity.bio || "No bio available",
        verification: {
          idStatus: "Verified",
          idVariant: "success" as const,
          licenseStatus: "Pending",
          licenseVariant: "pending" as const,
        },
      }
    : {
        name: opportunity.team,
        avatar: opportunity.image,
        country: opportunity.location,
        disciplineCount: 9,
        licenseType: opportunity.license,
        experience: "5 years",
        dateOfBirth: "01/01/2000",
        disciplines: [opportunity.discipline],
        championships: 2,
        podiums: 12,
        achievements: [
          "2023 Formula 4 Champion",
          "2022 Formula 4 Champion",
          "2021 Formula 4 Champion",
        ],
        bio: "Full-season seat with testing program. Looking for consistent pace and feedback on aero balance.",
        verification: {
          idStatus: "Verified",
          idVariant: "success" as const,
          licenseStatus: "Pending",
          licenseVariant: "pending" as const,
        },
      };

  return (
    <Card className="flex h-full flex-col gap-5 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(26,26,26,0.85),#0f0c0c)] p-5 text-white shadow-[0_25px_70px_-40px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className="h-16 w-16 shrink-0 rounded-lg bg-cover bg-center"
            style={{ backgroundImage: `url(${opportunity.image})` }}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">{opportunity.team}</p>
              <ShieldCheck
                className="h-4 w-4 text-primary"
                strokeWidth={1.75}
              />
            </div>
            <p className="text-sm text-white/60">{opportunity.location}</p>
          </div>
        </div>
      </div>

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Status</dt>
          <dd className="font-medium text-white">{opportunity.status}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/50">License:</dt>
          <dd className="font-medium text-white">{opportunity.license}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Discipline:</dt>
          <dd className="font-medium text-white">{opportunity.discipline}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Contract</dt>
          <dd className="font-medium text-white">{opportunity.contract}</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Budget</dt>
          <dd className="font-medium text-white">{opportunity.budget}</dd>
        </div>
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-3">
        {isActiveDriversTab ? (
          <>
            <DriverProfileDialog
              driver={driverProfile}
              driverId={opportunity.id}
            />
            <Button
              onClick={handleStartChat}
              disabled={isStartingChat}
              className="h-11 cursor-pointer rounded-lg bg-linear-to-b from-primary to-primary/60 text-white hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isStartingChat ? "Starting..." : "Start Chat"}
            </Button>
          </>
        ) : (
          <>
            <Button
              variant="outline"
              className="h-11 cursor-pointer rounded-lg border-white/20 bg-transparent"
              onClick={() => onDelete?.(opportunity.id)}
              disabled={isDeleting}
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </Button>
            <Button
              onClick={() =>
                navigate(`/team/dashboard/drives/edit/${opportunity.id}`)
              }
              className="h-11 cursor-pointer rounded-lg bg-linear-to-b from-primary to-primary/60 text-white hover:opacity-90"
            >
              {primaryLabel}
            </Button>
          </>
        )}
      </div>
    </Card>
  );
};

export default DriveCard;
