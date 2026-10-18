import { X } from "lucide-react";

export default function OpportunityHeader({
  company,
  onClose,
  isDriver,
}: {
  company: string;
  onClose: () => void;
  isDriver?: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <h3 className="text-lg font-medium text-white">
        {company} {isDriver ? "Driver Details" : "Opportunity Details"}
      </h3>
      <button
        onClick={onClose}
        aria-label="Close"
        type="button"
        className="p-2 rounded-full hover:bg-white/6"
      >
        <X className="w-4 h-4 text-white/80" />
      </button>
    </div>
  );
}
