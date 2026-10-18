import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Clock, Zap, ArrowRight, CircleCheck } from "lucide-react";
import ClockIcon from "@/assets/Icons/clock.svg";
import Icon from "@/components/shared/Icon";
import CheckMarkBig from "@/assets/Icons/white_checkmark.svg";

export default function VerificationReadyStatic() {
  const Navigate = (url: string) => {
    return () => {
      window.location.href = `/${url}`;
    };
  };
  return (
    <section className="w-full">
      <div className="flex flex-col items-center text-center">
        {/* Red check circle */}
        <div className="mb-6">
          <div className="h-32 w-32 rounded-full bg-linear-to-b from-red-600 to-red-700 flex items-center justify-center shadow-2xl shadow-primary/50">
            <Icon src={CheckMarkBig} className="h-20 w-20" />
          </div>
        </div>

        {/* Title & subtitle */}
        <h2 className="text-2xl font-semibold text-accent">Congratulations!</h2>
        <p className="mt-2 text-base text-[#BCBFC3]">
          Your GridConnect profile is ready
        </p>

        {/* Card with verification steps */}
        <div className="mt-6 w-full max-w-2xl">
          <Card className="bg-linear-to-tl to-[#0E1421] via-[#080A11] from-[#030101] p-8 rounded-[12px] border">
            <CardHeader className="p-5 pb-0">
              <div className="flex items-start justify-between gap-4">
                <CardTitle className="text-sm text-accent/60 font-medium">
                  Verification Status
                </CardTitle>

                {/* overall badge (right) */}
                <Badge className="ml-auto flex gap-2 text-xs font-normal bg-[#38260D] text-[#FFB900] px-3 py-1 rounded-xl! border-2 border-[#74490A]">
                  <span className="">
                    <Icon src={ClockIcon} className="h-3 w-3" />
                  </span>{" "}
                  Pending
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="p-5 pb-6">
              <div className="grid gap-4">
                {/* Step: Profile Created (done) */}
                <div className="flex items-start gap-4 rounded-lg p-3 bg-linear-to-b from-white/2 to-transparent border border-slate-800/40">
                  <div className="h-8 w-8 rounded-full bg-emerald-600/20 flex items-center justify-center">
                    <CircleCheck className="h-5 w-5 text-[#00C950]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-slate-100">
                      Profile Created
                    </div>
                    <p className="mt-1 text-xs text-[#6A7282]">
                      Your account is active and ready to use
                    </p>
                  </div>
                </div>

                {/* Step: Documents Under Review (pending) */}
                <div className="flex items-start gap-4 rounded-lg p-3 bg-linear-to-b from-white/2 to-transparent border border-slate-800/40">
                  <div className="h-8 w-8 rounded-full bg-amber-700/10 flex items-center justify-center">
                    <Clock className="h-5 w-5 text-amber-400" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-slate-100">
                      Documents Under Review
                    </div>
                    <p className="mt-1 text-xs text-[#6A7282]">
                      Verification typically takes 24–48 hours
                    </p>
                  </div>
                </div>

                {/* Step: Verified Badge (todo) */}
                <div className="flex items-start gap-4 rounded-lg p-3 bg-linear-to-b from-white/2 to-transparent border border-slate-800/40">
                  <div className="h-8 w-8 rounded-full bg-slate-700/40 flex items-center justify-center">
                    <Zap className="h-5 w-5 text-[#6A7282]" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="text-sm font-medium text-slate-100">
                      Verified Badge
                    </div>
                    <p className="mt-1 text-xs text-[#6A7282]">
                      You'll receive this after verification is complete
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* CTA button */}
        <div className="mt-10 w-full max-w-2xl">
          <Button
          onClick={Navigate("dashboard")}
            variant="default"
            className="w-full mt-6 h-12 font-semibold bg-linear-to-b from-primary to-black/30 text-sm cursor-pointer text-accent tracking-wide shadow-md"
          >
            <span>Go To Dashboard</span>
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </section>
  );
}
