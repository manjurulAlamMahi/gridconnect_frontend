import { Dialog, DialogContent } from "@/components/ui/dialog";
import OpportunityHeader from "./OpportunityHeader";
import CompanyInfo from "./CompanyInfo";
import InfoGrid from "./InfoGrid";
import QuickStats from "./QuickStat";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
// import { useJoinTeamMutation } from "@/redux/endpoints/driver/searchteam.api";
// import { Loader2 } from "lucide-react";
// import { useState } from "react";

type Opportunity = {
  id: string;
  teamId?: string | number;
  company: string;
  location: string;
  logo?: string;
  tags?: string[];
  license?: string;
  budget?: string;
  driveOverview: Record<string, string>;
  description?: string;
  quickStats: Record<string, string | number>;
  applicationStatus?: string;
};

export default function OpportunityDialog({
  open,
  onOpenChange,
  opportunity,
}: {
  open: boolean;
  onOpenChange: (v: boolean) => void;
  opportunity: Opportunity;
}) {
  const navigate = useNavigate();
  const [startConversation, { isLoading: isStartingChat }] =
    useStartConversationMutation();

  const handleStartChat = async () => {
    if (!opportunity.teamId) {
      toast.error("Team information is missing.");
      return;
    }

    try {
      const response = await startConversation({
        with_id:
          typeof opportunity.teamId === "string"
            ? parseInt(opportunity.teamId, 10)
            : opportunity.teamId,
        with_type: "team", // Since this is DRIVER searching for team
      }).unwrap();

      toast.success("Chat started successfully!");
      navigate(
        `/driver/dashboard/message?conversation_id=${response.data.conversation_id}`,
      );
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  // const [joinTeam, { isLoading }] = useJoinTeamMutation();
  // const [hasApplied, setHasApplied] = useState(false);

  // const handleApply = async () => {
  //   try {
  //     const res = await joinTeam({
  //       opportunity_detail_id: opportunity.id,
  //     }).unwrap();
  //     toast.success(res?.message || "Success");
  //     setHasApplied(true);
  //   } catch (error: any) {
  //     toast.error(error?.data?.message || "Something went wrong");
  //   }
  // };
  //console.log("🚀 ~ handleApply ~ opportunity_detail_id:", opportunity.id)

  // const isPending = opportunity.applicationStatus === "pending" || hasApplied;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[95%] bg-[#0f0f10] p-6 rounded-xl border border-primary/40 shadow-2xl"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <OpportunityHeader
            company={opportunity.company}
            onClose={() => onOpenChange(false)}
          />

          <div className="grid grid-cols-12 gap-4">
            <div className="col-span-12">
              <CompanyInfo
                logo={opportunity.logo}
                company={opportunity.company}
                location={opportunity.location}
                tags={opportunity.tags}
                license={opportunity.license}
                budget={opportunity.budget}
                actions={
                  <div className="flex gap-3">
                    {/* <button
                      onClick={handleApply}
                      disabled={isLoading}
                      className={`px-4 py-2 rounded-md border text-white/90 bg-transparent cursor-pointer flex items-center gap-2 min-w-[100px] justify-center transition-all hover:bg-white/5 disabled:opacity-50 ${isPending ? "border-primary" : "border-white/20"}`}
                    >
                      {isLoading ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isPending ? (
                        "Cancel Request"
                      ) : (
                        "Apply"
                      )}
                    </button> */}
                    <button
                      onClick={handleStartChat}
                      disabled={isStartingChat}
                      className="px-4 py-2 text-nowrap rounded-md bg-linear-to-b from-primary to-primary/40 text-white shadow-sm cursor-pointer hover:brightness-110 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isStartingChat ? "Starting..." : "Start Chat"}
                    </button>
                  </div>
                }
              />
            </div>

            <div className="col-span-8">
              <InfoGrid
                overview={opportunity.driveOverview}
                description={opportunity.description || ""}
              />
            </div>

            <div className="col-span-4">
              <QuickStats stats={opportunity.quickStats} />
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
