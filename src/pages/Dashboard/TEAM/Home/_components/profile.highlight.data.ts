import SteeringIcon from "@/assets/Icons/stearing.svg";
import MessageIcon from "@/assets/Icons/message_dash.svg";
import CardIcon from "@/assets/Icons/touch.svg";

export type ProfileHighlight = {
  id: string;
  title: string;
  emphasis: string;
  meta?: string;
  icon: string;
};

export const profileHighlights: ProfileHighlight[] = [
  {
    id: "drives",
    title: "Total Drives Posted",
    emphasis: "3",
    meta: "2 active, 1 filled",
    icon: SteeringIcon,
  },
  {
    id: "conversations",
    title: "Active Conversations",
    emphasis: "12",
    meta: "3 unread messages",
    icon: MessageIcon,
  },
  {
    id: "plan",
    title: "Subscription Plan",
    emphasis: "Premium",
    meta: "Renews Nov 25, 2026",
    icon: CardIcon,
  },
];
