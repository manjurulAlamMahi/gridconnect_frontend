import { Card, CardContent } from "@/components/ui/card";
import { MoveRight } from "lucide-react";
import Pulse from "@/assets/Icons/pulse.svg";
import MessageIcon from "@/assets/Icons/message_2.svg";
import UserMul from "@/assets/Icons/user_mul.svg";
import Icon from "@/components/shared/Icon";
import { Link } from "react-router";
import { useGetDriverRacingActivityQuery } from "@/redux/endpoints/driver/driver.api";

type Metric = {
  id: string;
  value: string;
  sublabel: string;
  icon: string;
  badge?: string;
  highlight?: boolean;
};

const baseCard =
  "rounded-3xl border border-white/8 bg-[#1A1A1A] px-5 py-4 shadow-inner shadow-black/40 transition-colors";
const highlightCard =
  "rounded-3xl  border border-[#6D460E] bg-linear-to-tl to-[#2F2215] via-[#1E1815] from-[#1A1616] px-5 py-4 shadow-inner shadow-black/60 transition-colors";

const RacingActivity = () => {
  const { data } = useGetDriverRacingActivityQuery();

  const activity = data?.data;
  const metrics: Metric[] = [
    {
      id: "matches",
      value: String(activity?.total_matched_teams ?? 0),
      sublabel: "Team Matches",
      icon: UserMul,
    },
    {
      id: "response",
      value: `${activity?.response_rate ?? 0}%`,
      sublabel: "Response Rate",
      icon: MessageIcon,
    },
  ];

  return (
    <section className="rounded-[12px]">
      <div className="mb-5 flex items-center justify-between text-sm text-accent">
        <div className="flex items-center gap-2 mt-6">
          <span className="text-primary">
            <Icon src={Pulse} />
          </span>
          <p className="text-[20px]">Racing Activity</p>
        </div>
        <Link
          to="/driver/dashboard/search-team"
          className="group inline-flex items-center gap-2 text-xs font-medium text-accent/60 hover:text-primary transition-colors duration-300 cursor-pointer px-1"
        >
          <span className="group-hover:text-primary">Search All Teams</span>
          <span aria-hidden className="group-hover:text-primary">
            <MoveRight className="h-4 w-4" />
          </span>
        </Link>
      </div>

      <div className="grid gap-3 md:grid-cols-2">
        {metrics.map(
          ({ id, value, sublabel, icon: Icons, badge, highlight }) => (
            <Card key={id} className={highlight ? highlightCard : baseCard}>
              <CardContent className="flex h-full flex-col justify-between p-0">
                <div className="flex items-center justify-between text-white/60">
                  <Icon
                    src={Icons}
                    className={`h-[18px] w-[18px] ${
                      highlight ? "text-[#FFB900]" : ""
                    }`}
                  />
                  {badge && (
                    <span className="rounded-sm border border-white/20 px-3 py-0.5 text-xs font-medium text-white/80">
                      {badge}
                    </span>
                  )}
                </div>
                <div className="mt-6 space-y-1">
                  <p
                    className={`text-3xl font-semibold ${
                      highlight ? "text-[#FFB900]" : "text-white"
                    }`}
                  >
                    {value}
                  </p>
                  <p className="text-sm text-white/60">{sublabel}</p>
                </div>
              </CardContent>
            </Card>
          ),
        )}
      </div>
    </section>
  );
};
export default RacingActivity;
