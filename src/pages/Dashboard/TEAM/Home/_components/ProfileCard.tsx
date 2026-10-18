import { Card, CardContent } from "@/components/ui/card";
import type { ProfileHighlight } from "./profile.highlight.data";
import Icon from "@/components/shared/Icon";

export function ProfileHighlightCard({
  title,
  emphasis,
  meta,
  icon,
}: Omit<ProfileHighlight, "id">) {
  return (
    <Card className="rounded-[20px] sm:rounded-[26px] border bg-linear-to-r from-[#0D0D0D] to-[#780C0A] text-white shadow-[0_35px_80px_-40px_rgba(0,0,0,0.9)] h-full">
      <CardContent className="flex flex-col h-full justify-between gap-3 p-4 sm:p-5">
        <div className="flex items-center gap-3 justify-between w-full">
          <span className="flex items-center text-white/80">
            <Icon className="h-5 w-5 text-accent/40" src={icon} />
          </span>
          <span className="rounded-lg border border-white/20 px-2 py-1 text-[10px] font-medium uppercase tracking-wide text-white/80">
            {title}
          </span>
        </div>

        <div className="flex flex-col gap-3">
          <div className="space-y-1">
            <p className="text-2xl sm:text-3xl font-semibold leading-none text-white truncate pr-2">
              {emphasis}
            </p>
            {meta && (
              <p className="text-xs sm:text-sm text-white/70 mt-2 truncate max-w-[90%]">
                {meta}
              </p>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
