/* eslint-disable @typescript-eslint/no-explicit-any */
import { Card } from "@/components/ui/card";
import {
  Flag,
  ShieldCheck,
  WalletMinimal,
  Trophy,
  BadgeCheck,
} from "lucide-react";

import OpportunityDialog from "./Opportunity";
import useModal from "@/components/Modal/useModal";
import type { MatchedOpportunity } from "@/types/driver";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";

type ProductCardProps = {
  opportunity: MatchedOpportunity;
};

const ProductsCard = ({ opportunity }: ProductCardProps) => {
  const { open, close, getParams } = useModal();
  const navigate = useNavigate();
  const [startConversation, { isLoading: isStartingChat }] =
    useStartConversationMutation();

  // Define a unique modal ID for this opportunity
  const modalId = "opportunity";
  const openId = opportunity.id.toString();

  // Check if the modal is open based on URL params
  const isOpen = getParams(modalId) === openId;

  const transformedOpportunity = {
    id: opportunity.id.toString(),
    teamId: opportunity.team_id,
    company: opportunity.title,
    location: opportunity.location || "Not specified",
    logo: opportunity.vehicle_image || undefined,
    tags: opportunity.disciplines.map((d) => d.name),
    license: `License Type ${opportunity.license_type_id}`,
    budget: opportunity.budget_display,
    driveOverview: {
      Experience: opportunity.experience || "Not specified",
      "Contract Duration": opportunity.contract_duration || "Not specified",
      "Available Seats": opportunity.available_seat || "Not specified",
    },
    description: opportunity.description,
    quickStats: {
      Budget: opportunity.budget_display,
      Location: opportunity.location || "Not specified",
      Status: opportunity.status,
    },
    applicationStatus: opportunity.application_status,
  };

  const handleOpen = () => {
    open([{ modalId, openId }]);
  };

  const handleClose = () => {
    close([modalId]);
  };

  const handleStartChat = async () => {
    if (!opportunity?.team_id) {
      toast.error("Team information is missing.");
      return;
    }

    try {
      const response = await startConversation({
        with_id: opportunity.team_id,
        with_type: "team",
      }).unwrap();

      toast.success("Chat started successfully!");
      // Redirect to messages page with the conversation ID
      navigate(
        `/driver/dashboard/message?conversation_id=${response.data.conversation_id}`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  return (
    <Card className="flex flex-col gap-4 p-[25px] rounded-[12px] border border-white/10 hover:border-primary/40 bg-[#1A1A1A] hover:scale-101 transition-all duration-300">
      <div className="flex items-center gap-4">
        <img
          src={opportunity.vehicle_image || "/default-logo.png"}
          alt={opportunity.title}
          className="h-16 w-16 rounded-2xl border border-white/10 object-cover"
        />
        <div>
          <div className="flex items-center gap-2 text-white">
            <p className="text-lg font-semibold text-white">
              {opportunity.title}
            </p>
            {opportunity.status === "active" && (
              <BadgeCheck className="h-4 w-4 text-primary" />
            )}
          </div>
          <p className="text-sm text-white/60">
            {opportunity.location || "Location not specified"}
          </p>
        </div>
      </div>

      <ul className="space-y-2.5 text-sm text-white/80">
        <li className="flex items-center flex-wrap gap-2">
          <Flag className="h-4 w-4 text-primary" />
          {opportunity.disciplines.map((d) => d.name).join(", ")}
        </li>
        <li className="flex items-center gap-2">
          <ShieldCheck className="h-4 w-4 text-primary" />
          License Type: {opportunity.license_type_id}
        </li>
        <li className="flex items-center gap-2">
          <WalletMinimal className="h-4 w-4 text-primary" />
          {opportunity.budget_display}
        </li>
        <li className="flex gap-2">
          <Trophy className="shrink-0 h-4 w-4 text-primary mt-0.5" />
          <p className="text-white/70 flex-1">{opportunity.description}</p>
        </li>
      </ul>

      <div className="border-t border-white/10 pt-4">
        <div className="flex gap-3">
          <OpportunityDialog
            open={isOpen}
            onOpenChange={(open) => (open ? handleOpen() : handleClose())}
            opportunity={transformedOpportunity}
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
