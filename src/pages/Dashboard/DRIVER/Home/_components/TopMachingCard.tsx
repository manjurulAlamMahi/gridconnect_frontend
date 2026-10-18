import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useNavigate } from "react-router";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type TopMatchingCardProps = {
  teamId: number;
  logo: string;
  name: string;
  country: string;
  category: string;
  matchScore: number;
  accent?: string;
};

const TopMachingCard = ({
  teamId,
  logo,
  name,
  country,
  category,
  matchScore,
  accent = "#222222",
}: TopMatchingCardProps) => {
  const navigate = useNavigate();
  const [startConversation, { isLoading }] = useStartConversationMutation();

  const handleStartChat = async () => {
    try {
      const response = await startConversation({
        with_id: teamId,
        with_type: "team",
      }).unwrap();

      if (response.status === "success" && response.data?.conversation_id) {
        toast.success("Conversation started");
        navigate(
          `/driver/dashboard/message?conversation_id=${response.data.conversation_id}`,
        );
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to start conversation");
    }
  };

  return (
    <Card className="flex h-full bg-[#1A1A1A] flex-col gap-5 rounded-3xl border p-5 transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:shadow-black/70">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-center gap-3">
          <div
            className="h-12 w-12 shrink-0 overflow-hidden rounded-2xl border bg-cover bg-center"
            style={{ backgroundImage: `url(${logo})`, backgroundColor: accent }}
          />
          <div>
            <p className="text-base font-semibold text-white">{name}</p>
            <p className="text-xs text-white/60">{country}</p>
          </div>
        </div>
        <span className="rounded-full border border-[#3D1414] bg-[#1F0C0C] px-3 py-1 text-[11px] font-semibold text-[#FF5B5B]">
          {matchScore}%
        </span>
      </div>

      <div className="flex flex-1 flex-col gap-4">
        <span className="w-fit rounded-sm border border-white/10 px-4 py-1 text-xs font-medium text-white/80">
          {category}
        </span>

        <Button
          onClick={handleStartChat}
          disabled={isLoading}
          variant={"default"}
          className="border border-[#3B3B3B] cursor-pointer w-full bg-[#262626] text-sm font-medium text-white hover:bg-accent/10 mt-auto"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Starting...
            </>
          ) : (
            "Start Conversation"
          )}
        </Button>
      </div>
    </Card>
  );
};
export default TopMachingCard;
