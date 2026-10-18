import Checkmark from "@/assets/Icons/circle_mark.svg";
import CardIcon from "@/assets/Icons/touch.svg";
import EyeIcon from "@/assets/Icons/eye.svg";

export type ProfileHighlight = {
  id: string;
  title: string;
  emphasis?: string;
  emphasisColor?: string;
  meta?: string;
  pillLabel?: string;
  pillVariant?: "success" | "neutral";
  icon: string;
};

export const profileHighlights: ProfileHighlight[] = [
  {
    id: "verification",
    title: "Verification Status",
    pillLabel: "Verified",
    pillVariant: "success",
    icon: Checkmark,
  },
  {
    id: "plan",
    title: "Subscription Plan",
    pillLabel: "Pro Plan",
    pillVariant: "success",
    icon: CardIcon,
  },
  {
    id: "views",
    title: "Profile Views",
    emphasis: "35",
    meta: "last week",
    icon: EyeIcon,
  },
];
