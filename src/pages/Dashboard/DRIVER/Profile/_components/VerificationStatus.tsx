import CircleMark from "@/assets/Icons/circle_mark.svg";
import InfoMark from "@/assets/Icons/info.svg";
import Icon from "@/components/shared/Icon";
import type { DriverDocument } from "@/types/driver";

const statusColor: Record<string, string> = {
  Verified: "text-[#05DF72] bg-[#153D25] border-[#0F6732]",
  Pending: "bg-[#483415] text-[#FFB900] border-[#7F530F]",
  "Not Uploaded": "bg-[#3D1515] text-[#FF5151] border-[#7F1F1F]",
};

interface VerificationStatusProps {
  documents: DriverDocument | null;
}

const VerificationStatus = ({ documents }: VerificationStatusProps) => {
  const getStatus = (verified: number | undefined) => {
    if (!verified && verified !== 0) return "Not Uploaded";
    return verified === 1 ? "Verified" : "Pending";
  };

  const getIcon = (status: string) => {
    return status === "Verified" ? CircleMark : InfoMark;
  };

  const statuses = [
    {
      id: "idDocument",
      label: "ID Document",
      status: documents
        ? getStatus(documents.govt_id_verified)
        : "Not Uploaded",
      icon: documents
        ? getIcon(getStatus(documents.govt_id_verified))
        : InfoMark,
    },
    {
      id: "racingLicense",
      label: "Racing License",
      status: documents
        ? getStatus(documents.racing_license_verified)
        : "Not Uploaded",
      icon: documents
        ? getIcon(getStatus(documents.racing_license_verified))
        : InfoMark,
    },
  ];
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6 text-white shadow-[0_30px_60px_-40px_rgba(0,0,0,0.9)]">
      <header className="mb-4">
        <p className="text-lg font-semibold flex gap-2 items-center">
          <span className="text-primary">
            <Icon src={CircleMark} />
          </span>
          Verification Status
        </p>
        <p className="text-xs text-white/50">Keep your documents up-to-date.</p>
      </header>
      <div className="space-y-3">
        {statuses.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between rounded-2xl border border-white/10 px-3 py-3 text-sm"
          >
            <span className="text-accent/60"> {item.label}</span>
            <div
              className={`rounded-sm border px-3 py-1 text-xs font-semibold ${
                statusColor[item.status]
              }`}
            >
              <p className="flex gap-2 items-center">
                <Icon src={item.icon} className="w-4 h-4" />
                {item.status}
              </p>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default VerificationStatus;
