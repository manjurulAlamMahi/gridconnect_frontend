/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import {
  Flag,
  ShieldCheck,
  WalletMinimal,
  Trophy,
  BadgeCheck,
} from "lucide-react";

import OpportunityDialog, { type Opportunity } from "./Opportunity";
import useModal from "@/components/Modal/useModal";
import type { SearchedDriver } from "@/types/driver";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type ProductCardProps = {
  name: string;
  country: string;
  discipline: string;
  license: string;
  budget: string;
  description: string;
  logo: string;
  cv?: string;
  verified?: boolean;
  isDriver?: boolean;
  driver?: SearchedDriver;
};

const ProductsCard = ({
  name,
  country,
  discipline,
  license,
  budget,
  description,
  logo,
  cv,
  verified = false,
  isDriver = false,
  driver,
}: ProductCardProps) => {
  const { open, close, getParams } = useModal();
  const navigate = useNavigate();
  const [startConversation, { isLoading: isStartingChat }] =
    useStartConversationMutation();

  // Define a unique modal ID for this opportunity (e.g., based on name or ID)
  const modalId = "opportunity";
  const openId = name; // Or use a unique ID like opportunity.id if available

  // Check if the modal is open based on URL params
  const isOpen = getParams(modalId) === openId;

  const opportunityData: Opportunity =
    isDriver && driver
      ? {
          id: driver.id?.toString() || "1",
          company: driver.name || name,
          location: driver.nationality || country || "Unknown",
          logo: driver.image || logo,
          tags: driver.disciplines?.map((d) => d.name) || [discipline],
          license: driver.license_type?.type || license,
          budget: driver.experience
            ? `${driver.experience} Years Experience`
            : "N/A",
          cv: driver.cv || cv,
          isDriver: true,
          achievements: driver.achievements || [],
          driveOverview: {
            "Date of Birth": driver.date_of_birth || "N/A",
            Nationality: driver.nationality || "N/A",
            Experience: driver.experience
              ? `${driver.experience} Years`
              : "N/A",
            Email: driver.user?.email || "N/A",
          },
          description: driver.bio || description || "No bio available.",
          quickStats: {
            Experience: driver.experience
              ? `${driver.experience} Years`
              : "Beginner",
            Disciplines: driver.disciplines?.length || 0,
            Achievements: driver.achievements?.length || 0,
          },
        }
      : {
          id: "1",
          company: name,
          location: country,
          logo,
          tags: [discipline],
          license,
          budget,
          cv,
          isDriver: false,
          achievements: [],
          driveOverview: {
            Season: "2025",
            Car: "Formula 4",
            Testing: "Included",
          },
          description: "Full-season seat with testing program.",
          quickStats: {
            Races: 10,
            Budget: budget,
            Experience: "Beginner",
          },
        };

  const handleOpen = () => {
    open([{ modalId, openId }]);
  };

  const handleClose = () => {
    close([modalId]);
  };

  const handleStartChat = async () => {
    if (!driver?.id) {
      toast.error("Driver information is missing.");
      return;
    }

    try {
      const response = await startConversation({
        with_id: driver.id,
        with_type: "driver",
      }).unwrap();

      toast.success("Chat started successfully!");
      // Redirect to messages page with the conversation ID if possible,
      // or simply direct to the team messages page.
      navigate(
        `/team/dashboard/message?conversation_id=${response.data.conversation_id}`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-[25px] rounded-[12px] border border-white/10 transition hover:border-primary/40 bg-[#1A1A1A]">
      <div className="flex items-center gap-4">
        <img
          src={logo}
          alt={name}
          className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
        />
        <div>
          <div className="flex items-center gap-2 text-white">
            <p className="text-lg font-semibold text-white">{name}</p>
            {verified && <BadgeCheck className="h-4 w-4 text-primary" />}
          </div>
          <p className="text-sm text-white/60">{country}</p>
        </div>
      </div>

      <ul className="space-y-2.5 text-sm text-white/80">
        <li className="flex items-center gap-2">
          <Flag className="h-4 w-4 text-primary" />
          {discipline}
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          License: {license}
        </li>
        {!isDriver && (
          <li className="flex items-center gap-2">
            <WalletMinimal className="h-4 w-4 text-primary" />
            {budget}
          </li>
        )}
        <li className="flex items-start gap-2">
          <Trophy className="mt-1 h-4 w-4 text-primary" />
          <p className="text-white/70">{description}</p>
        </li>
      </ul>

      <div className="border-t border-white/10 pt-4">
        <div className="flex gap-3">
          <OpportunityDialog
            open={isOpen}
            onOpenChange={(open) => (open ? handleOpen() : handleClose())}
            opportunity={opportunityData}
          />
          <button
            onClick={handleOpen}
            className="w-full h-12 rounded-[12px] hover:bg-accent/10 border cursor-pointer"
          >
            View Details
          </button>
          <button
            onClick={handleStartChat}
            disabled={isStartingChat}
            className="w-full h-12 rounded-[12px] bg-linear-to-b from-primary to-primary/60 px-4 py-2 text-sm font-semibold text-white shadow cursor-pointer hover:brightness-110 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isStartingChat ? "Starting..." : "Start Chat"}
          </button>
        </div>
      </div>
    </Card>
  );
};

export default ProductsCard;
