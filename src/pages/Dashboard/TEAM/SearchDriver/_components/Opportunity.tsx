/* eslint-disable @typescript-eslint/no-explicit-any */
import { Dialog, DialogContent } from "@/components/ui/dialog";
import OpportunityHeader from "./OpportunityHeader";
import CompanyInfo from "./CompanyInfo";
import InfoGrid from "./InfoGrid";
import QuickStats from "./QuickStat";
import { Trophy } from "lucide-react";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export type Achievement = {
  id: number;
  driver_id: number;
  title: string;
  year: number;
  position: string;
  attachment?: string | null;
};

export type Opportunity = {
  id: string;
  company: string;
  location: string;
  logo?: string;
  tags?: string[];
  license?: string;
  budget?: string;
  cv?: string;
  isDriver?: boolean;
  achievements?: Achievement[];
  driveOverview: Record<string, string>;
  description?: string;
  quickStats: Record<string, string | number>;
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

  const handleDownloadCv = () => {
    if (opportunity.cv) {
      window.open(opportunity.cv, "_blank");
    }
  };

  const handleStartChat = async () => {
    if (!opportunity.id) {
      toast.error("User information is missing.");
      return;
    }

    try {
      const response = await startConversation({
        with_id: parseInt(opportunity.id, 10),
        with_type: "driver", // Since this is TEAM searching for driver
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
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent
        className="max-w-5xl w-[95%] bg-[#0f0f10] p-6 rounded-xl border border-primary/40 shadow-2xl max-h-[90vh] overflow-y-auto"
        showCloseButton={false}
      >
        <div className="space-y-4">
          <OpportunityHeader
            company={opportunity.company}
            onClose={() => onOpenChange(false)}
            isDriver={opportunity.isDriver}
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
                isDriver={opportunity.isDriver}
                actions={
                  <div className="flex gap-3">
                    {opportunity.cv && (
                      <button
                        onClick={handleDownloadCv}
                        className="px-4 py-2 rounded-md border text-white/90 bg-transparent cursor-pointer hover:bg-white/10 transition-colors"
                      >
                        Download CV
                      </button>
                    )}
                    <button
                      onClick={handleStartChat}
                      disabled={isStartingChat}
                      className="px-4 py-2 text-nowrap rounded-md bg-linear-to-b from-primary to-primary/40 text-white shadow-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isStartingChat ? "Starting..." : "Start Chat"}
                    </button>
                  </div>
                }
              />
            </div>

            <div className="col-span-12 md:col-span-8">
              <InfoGrid
                overview={opportunity.driveOverview}
                description={opportunity.description || ""}
                isDriver={opportunity.isDriver}
              />
            </div>

            <div className="col-span-12 md:col-span-4">
              <QuickStats stats={opportunity.quickStats} />
            </div>

            {/* Achievements Section */}
            {opportunity.isDriver &&
              opportunity.achievements &&
              opportunity.achievements.length > 0 && (
                <div className="col-span-12">
                  <div className="rounded-lg border border-neutral-800 p-4">
                    <h5 className="text-sm text-white/80 mb-3 flex items-center gap-2">
                      <Trophy className="h-4 w-4 text-primary" />
                      Achievements
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                      {opportunity.achievements.map((achievement) => (
                        <div
                          key={achievement.id}
                          className="rounded-lg border border-neutral-800 p-3 bg-[#1A1616] flex items-start gap-3"
                        >
                          <div className="flex-1">
                            <div className="font-medium text-white text-sm">
                              {achievement.title}
                            </div>
                            <div className="text-xs text-white/60 mt-0.5">
                              {achievement.year} &middot; {achievement.position}
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
