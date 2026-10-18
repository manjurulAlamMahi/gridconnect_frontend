import CircleMark from "@/assets/Icons/circle_mark.svg";
import InfoMark from "@/assets/Icons/info.svg";
import Icon from "@/components/shared/Icon";
import { useGetTeamVerificationStatusQuery } from "@/redux/endpoints/team/team.api";

type StatusTone = "Verified" | "Pending" | "Rejected";

const statusColor: Record<StatusTone, string> = {
  Verified: "text-[#05DF72] bg-[#153D25] border-[#0F6732]",
  Pending: "bg-[#483415] text-[#FFB900] border-[#7F530F]",
  Rejected: "bg-[#3B1212] text-[#F87171] border-[#7A1F1F]",
};

const normalizeStatus = (value?: string): StatusTone => {
  if (!value) return "Pending";
  const normalized = value.trim().toLowerCase();
  if (normalized === "verified" || normalized === "approved" || normalized === "active") {
    return "Verified";
  }
  if (normalized === "rejected" || normalized === "declined") {
    return "Rejected";
  }
  return "Pending";
};

const VerificationStatus = () => {
  const { data } = useGetTeamVerificationStatusQuery();
  const verification = data?.data;

  const statuses = [
    {
      id: "racingLicense",
      label: "Competition License ",
      status: normalizeStatus(verification?.license_verified),
      icon:
        normalizeStatus(verification?.license_verified) === "Verified"
          ? CircleMark
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
            className="flex items-center justify-between rounded-2xl py-3 text-sm"
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
