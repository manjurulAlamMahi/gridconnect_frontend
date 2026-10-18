import { Card, CardContent } from "@/components/ui/card";
import type { ProfileHighlight } from "./profile.highlight.data";
import Icon from "@/components/shared/Icon";

export function ProfileHighlightCard({
  title,
  emphasis,
  emphasisColor,
  meta,
  icon,
}: Omit<ProfileHighlight, "id">) {
  const renderIcon = () => {
    if (typeof icon === "string") {
      return <Icon className="h-5 w-5 text-primary" src={icon} />;
    }

    const IconComponent = icon as React.ComponentType<{
      className?: string;
      strokeWidth?: number;
    }>;

    return (
      <IconComponent className="h-5 w-5 text-primary" strokeWidth={1.75} />
    );
  };

  return (
    <Card className="rounded-[26px] border bg-[linear-gradient(130deg,#0E0E0E,#780C0A)] text-white]">
      <CardContent className="flex flex-col gap-4">
        <div className="flex items-center justify-between gap-2">
          <span className="rounded-full px-3 py-1 text-[11px] font-medium uppercase tracking-wide text-white/80">
            {title}
          </span>
          <span className="flex h-10 w-10 items-center justify-center rounded-md border border-white/10 bg-white text-primary">
            {renderIcon()}
          </span>
        </div>
        <div className="space-y-0.5 pl-2.5">
          <p
            className="text-lg font-semibold leading-none"
            style={{ color: emphasisColor || "white" }}
          >
            {emphasis}
          </p>

          {meta && <p className="text-sm text-white/70">{meta}</p>}
        </div>
      </CardContent>
    </Card>
  );
}
