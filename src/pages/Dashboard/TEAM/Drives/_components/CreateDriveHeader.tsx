import Icon from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SaveIcon from "@/assets/Icons/save_icon.svg";

interface CreateDriveHeaderProps {
  onPublish: () => void;
  isLoading: boolean;
}

export default function CreateDriveHeader({
  onPublish,
  isLoading,
}: CreateDriveHeaderProps) {
  return (
    <>
      {/* back + forward arrows */}
      <div className="flex gap-4">
        <p className="flex gap-2.5">
          <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
        </p>
        <p className="text-sm font-medium">Create New Drive Opportunity</p>
      </div>

      {/* description + publish button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-accent/60 max-w-3xl">
          Share details about your available seat, driver requirements, and team
          support to attract the right talent.
        </p>

        <Button
          onClick={onPublish}
          disabled={isLoading}
          className="flex gap-3 items-center"
        >
          <Icon src={SaveIcon} />{" "}
          {isLoading ? "Publishing..." : "Published Opportunity"}
        </Button>
      </div>
    </>
  );
}
