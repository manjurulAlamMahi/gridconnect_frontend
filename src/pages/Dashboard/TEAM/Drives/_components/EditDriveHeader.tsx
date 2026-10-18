import Icon from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SaveIcon from "@/assets/Icons/save_icon.svg";

interface EditDriveHeaderProps {
  onSave?: () => void;
  isLoading?: boolean;
}

export default function EditDriveHeader({
  onSave,
  isLoading,
}: EditDriveHeaderProps) {
  return (
    <>
      {/* back + forward arrows */}
      <div className="flex gap-4">
        <p className="flex gap-2.5">
          <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
        </p>
        <p className="text-sm font-medium">Edit Drive Opportunity</p>
      </div>

      {/* description + publish button */}
      <div className="flex justify-between items-center">
        <p className="text-sm text-accent/60 max-w-3xl">
          Edit details about your available seat, driver requirements, and team
          support to attract the right talent.
        </p>

        <Button
          className="flex gap-3 items-center"
          onClick={onSave}
          disabled={isLoading}
        >
          <Icon src={SaveIcon} />{" "}
          {isLoading ? "Updating..." : "Update Opportunity"}
        </Button>
      </div>
    </>
  );
}
