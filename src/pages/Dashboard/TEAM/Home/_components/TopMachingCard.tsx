import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck, Star, Loader2 } from "lucide-react";
import { useStartConversationMutation } from "@/redux/endpoints/chatApi";
import { useNavigate } from "react-router";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import type { MatchingDriver } from "@/types/team";
import DriverProfileModal from "./DriverProfileModal";

type TopMatchingCardProps = {
  driver: MatchingDriver;
};

interface ErrorWithMessage {
  data?: {
    message?: string;
  };
}

const TopMachingCard = ({ driver }: TopMatchingCardProps) => {
  const navigate = useNavigate();
  const [startConversation, { isLoading }] = useStartConversationMutation();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [imageLoadFailed, setImageLoadFailed] = useState(false);

  const handleStartChat = async () => {
    try {
      const response = await startConversation({
        with_id: driver.driver_id,
        with_type: "driver",
      }).unwrap();

      if (response.status === "success") {
        toast.success("Conversation started");
        navigate(
          `/team/dashboard/message?conversation_id=${response.data.conversation_id}`,
        );
      }
    } catch (error: unknown) {
      const apiError = error as ErrorWithMessage;
      toast.error(apiError?.data?.message || "Failed to start conversation");
    }
  };

  const displayName = driver.name || driver.driver_name || "Driver";
  const rawImage = driver.image || driver.driver_image;
  const displayImage = !imageLoadFailed && rawImage ? rawImage : "/placeholder.png";
  const displayNationality = driver.nationality || "Unknown";
  const displayLicense = driver.license_type || "International";
  const matchScore = driver.match_percentage;
  const featured = matchScore === 100;

  useEffect(() => {
    setImageLoadFailed(false);
  }, [driver.driver_id, driver.image, driver.driver_image]);

  return (
    <>
      <Card className="flex h-full flex-col gap-4 sm:gap-5 rounded-[20px] sm:rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(26,26,26,0.85),#0f0c0c)] p-4 sm:p-5 text-white shadow-[0_25px_70px_-40px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50">
        <div className="flex items-center gap-3 sm:gap-4">
          <img
            src={displayImage}
            alt={displayName}
            className="h-12 w-12 sm:h-14 sm:w-14 shrink-0 rounded-sm object-cover"
            onError={() => setImageLoadFailed(true)}
          />

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1 text-sm font-semibold">
              <p className="truncate">{displayName}</p>
              <ShieldCheck
                className="h-4 w-4 text-primary shrink-0"
                strokeWidth={1.75}
              />
              {featured && (
                <Star
                  className="h-4 w-4 text-amber-400 shrink-0"
                  strokeWidth={1.75}
                />
              )}
            </div>
            <p className="text-xs text-white/65 truncate">
              {displayNationality}
            </p>
          </div>
        </div>

        <dl className="flex flex-col gap-3 text-xs text-white/70">
          <div className="flex justify-between items-center">
            <dt className="text-white/50">License:</dt>
            <dd className="text-sm font-medium text-white truncate ml-2">
              {displayLicense}
            </dd>
          </div>
          <div className="flex justify-between items-center">
            <dt className="text-white/50">Discipline:</dt>
            <dd className="text-sm font-medium text-white truncate ml-2">
              {driver.matched_disciplines}/{driver.total_disciplines}{" "}
              disciplines
            </dd>
          </div>
        </dl>

        <div className="space-y-2">
          <div className="flex items-center justify-between text-xs text-white/60">
            <span>Match Score</span>
            <span className="font-semibold text-[#FF5B5B]">{matchScore}%</span>
          </div>
          <div className="h-2 rounded-full bg-white/10">
            <div
              className="h-full rounded-full bg-[linear-gradient(90deg,#ff8d70,#e50914)] shadow-[0_0_10px_rgba(229,9,20,0.6)]"
              style={{ width: `${Math.min(matchScore, 100)}%` }}
            />
          </div>
        </div>

        <div className="mt-auto grid grid-cols-2 gap-2 sm:gap-3">
          <Button
            variant="outline"
            onClick={() => setIsModalOpen(true)}
            className="h-10 sm:h-11 cursor-pointer text-xs md:text-sm"
          >
            View Profile
          </Button>
          <Button
            onClick={handleStartChat}
            disabled={isLoading}
            className="h-10 sm:h-11 cursor-pointer rounded-sm bg-linear-to-b from-primary to-primary/60 text-white text-xs sm:text-sm hover:opacity-90"
          >
            {isLoading ? (
              <Loader2 className="animate-spin h-4 w-4" />
            ) : (
              "Start Chat"
            )}
          </Button>
        </div>
      </Card>

      <DriverProfileModal
        open={isModalOpen}
        onOpenChange={setIsModalOpen}
        driver={driver}
      />
    </>
  );
};

export default TopMachingCard;
