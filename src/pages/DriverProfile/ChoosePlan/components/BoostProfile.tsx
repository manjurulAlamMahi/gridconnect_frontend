import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Check } from "lucide-react";
import { Switch } from "@/components/ui/switch";
import SparkIcon from "@/assets/Icons/spark.svg";
import Icon from "@/components/shared/Icon";

export function BoostProfile() {
  return (
    <Card className="border rounded-2xl bg-linear-to-b from-neutral-900 to-neutral-950">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="bg-primary/20 p-4 text-primary rounded-[12px]">
              <Icon src={SparkIcon} className="h-5 w-5" />
            </div>
            <div className="flex flex-col">
              <h3 className="text-xl font-bold text-white">
                Boost Your Profile
              </h3>
              <span className="text-primary text-sm">£+5 one-time</span>
            </div>
          </div>
          <Switch />
        </div>
      </CardHeader>

      <CardContent className="space-y-4 text-[#99A1AF]">
        <p className="text-sm">
          Get 3x more visibility in team searches for 30 days. Your profile
          appears at the top of search result.
        </p>
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#00C950] mt-0.5 shrink-0" />
            <span className="text-sm">Featured base on profile</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#00C950] mt-0.5 shrink-0" />
            <span className="text-sm">Priority placement in searches</span>
          </div>
          <div className="flex items-start gap-3">
            <Check className="w-5 h-5 text-[#00C950] mt-0.5 shrink-0" />
            <span className="text-sm">30-day boost duration</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
