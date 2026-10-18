import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ShieldCheck } from "lucide-react";
import DriverProfileDialog from "./DriverProfileDialog";
import type { DriverRequest } from "@/types/drive-request";
import { useHandleJoinRequestMutation } from "@/redux/endpoints/team/drives.api";
import { toast } from "sonner";

type DriveRequestCardProps = {
  request: DriverRequest;
};

const DriveRequestCard = ({ request }: DriveRequestCardProps) => {
  const { driver, opportunity } = request;
  const [handleJoinRequest, { isLoading }] = useHandleJoinRequestMutation();

  // Map driver data to DriverProfileDialog props
  const driverProfile = {
    name: driver.name,
    avatar: driver.image || "", // Use a default avatar if null? Avatar component handles it usually.
    country: driver.nationality,
    disciplineCount: driver.disciplines?.length || 0,
    licenseType: driver.license_type?.type || "N/A",
    experience: `${driver.experience} years`,
    dateOfBirth: driver.date_of_birth || "N/A",
    disciplines: driver.disciplines?.map((d) => d.name) || [],
    championships: driver.racing_stats?.championships || 0,
    podiums: driver.racing_stats?.podiums?.total || 0,
    achievements: driver.achievements?.map((a) => a.title) || [],
    bio: driver.bio || "No bio available",
    verification: {
      idStatus: "Verified",
      idVariant: "success" as const,
      licenseStatus: "Pending",
      licenseVariant: "pending" as const,
    },
    // Add email for display if needed
    email: driver.user.email,
  };

  const handleAction = async (action: "approved" | "rejected") => {
    try {
      const res = await handleJoinRequest({ id: request.id, action }).unwrap();
      toast.success(res.message);
    } catch (error: any) {
      toast.error(error?.data?.message || "Something went wrong");
    }
  };

  // const isPending = request.accepted === "pending";
  const isApproved = request.accepted === "approved";
  // const isRejected = request.accepted === "rejected";

  return (
    <Card className="flex h-full flex-col gap-5 rounded-[28px] border border-white/10 bg-[radial-gradient(circle_at_top,rgba(26,26,26,0.85),#0f0c0c)] p-5 text-white shadow-[0_25px_70px_-40px_rgba(0,0,0,1)] transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/50">
      <div className="flex items-start justify-between">
        <div className="flex items-start gap-4">
          <div
            className="h-16 w-16 shrink-0 rounded-lg bg-cover bg-center bg-[#252525]"
            style={{ backgroundImage: `url(${driver.image})` }}
          />
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <p className="text-base font-semibold">{driver.name}</p>
              <ShieldCheck
                className="h-4 w-4 text-primary"
                strokeWidth={1.75}
              />
            </div>
            <p className="text-sm text-white/60">{driver.nationality}</p>
          </div>
        </div>
      </div>

      <dl className="flex flex-col gap-3 text-sm">
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Applied For:</dt>
          <dd
            className="font-medium text-white text-right truncate max-w-[150px]"
            title={opportunity?.title || "N/A"}
          >
            {opportunity?.title || "N/A"}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Location:</dt>
          <dd className="font-medium text-white">
            {opportunity?.location || "N/A"}
          </dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Experience:</dt>
          <dd className="font-medium text-white">{driver.experience} years</dd>
        </div>
        <div className="flex items-center justify-between">
          <dt className="text-white/50">Budget:</dt>
          <dd className="font-medium text-white">
            {opportunity?.budget_display || "N/A"}
          </dd>
        </div>
      </dl>

      <div className="mt-auto grid grid-cols-2 gap-3">
        <DriverProfileDialog
          driver={driverProfile}
          driverId={driver.id.toString()}
          requestId={request.id}
          status={request.accepted}
          onAction={handleAction}
          isLoading={isLoading}
        />
        {isApproved ? (
          <Button
            className="h-11 rounded-lg bg-linear-to-b from-primary to-primary/60 text-white opacity-60 cursor-not-allowed hover:opacity-60"
            disabled
          >
            Accepted
          </Button>
        ) : (
          <Button
            onClick={() => handleAction("approved")}
            disabled={isLoading}
            className="h-11 cursor-pointer rounded-lg bg-linear-to-b from-primary to-primary/60 text-white hover:opacity-90"
          >
            Accept
          </Button>
        )}
      </div>
    </Card>
  );
};

export default DriveRequestCard;
