import * as React from "react";
import { cn } from "@/lib/utils";
import User2 from "@/assets/Icons/user_tri.svg";
import Gauge from "@/assets/Icons/stearing.svg";
import IdCard from "@/assets/Icons/clipboard.svg";
import CreditCard from "@/assets/Icons/card.svg";
import Icon from "../shared/Icon";

type Step = {
  id: number;
  label: string;
  subLabel: string;
  icon: string;
};

// Driver flow steps: Personal, Racing, Verification, Subscription
const DRIVER_STEPS: Step[] = [
  { id: 1, label: "Personal", subLabel: "STEP 1", icon: User2 },
  { id: 2, label: "Racing", subLabel: "STEP 2", icon: Gauge },
  { id: 3, label: "Verification", subLabel: "STEP 3", icon: IdCard },
  { id: 4, label: "Subscription", subLabel: "STEP 4", icon: CreditCard },
];

// Team flow steps: Team, Driver, Verification, Subscription
const TEAM_STEPS: Step[] = [
  { id: 1, label: "Team", subLabel: "STEP 1", icon: User2 },
  { id: 2, label: "Driver", subLabel: "STEP 2", icon: Gauge },
  { id: 3, label: "Verification", subLabel: "STEP 3", icon: IdCard },
  { id: 4, label: "Subscription", subLabel: "STEP 4", icon: CreditCard },
];

type MultiStepProgressProps = {
  currentStep?: number;
  currentStepProgress?: number;
  mode?: "driver" | "team";
};

export function MultiStepProgress({
  currentStep = 1,
  currentStepProgress = 0.4,
  mode = "driver",
}: MultiStepProgressProps) {
  const steps = mode === "team" ? TEAM_STEPS : DRIVER_STEPS;
  return (
    <div className="relative z-10 w-full rounded-2xl px-4 py-4 hidden md:block">
      <div className="w-full overflow-x-auto">
        <div className="mx-auto max-w-7xl">
          <div className="flex items-center gap-4 md:gap-6">
            {steps.map((step, index) => {
              const isActive = step.id === currentStep;
              const isCompleted = step.id < currentStep;

              const hasConnector = index < steps.length - 1;
              let fillPercent = 0;

              if (isCompleted) fillPercent = 100;
              else if (isActive) fillPercent = currentStepProgress * 100;

              return (
                <React.Fragment key={step.id}>
                  {/* CIRCLE WITH LABEL BELOW */}
                  <div className="flex-none flex flex-col items-center">
                    {/* Circle */}
                    <div
                      className={cn(
                        "flex items-center justify-center rounded-full border-4 h-12 w-12 md:h-14 md:w-14",
                        isActive || isCompleted
                          ? "border-red-500 bg-red-600"
                          : "border-white bg-white",
                      )}
                    >
                      <div
                        className={cn(
                          "flex items-center justify-center rounded-full border-4 h-10 w-10 md:h-12 md:w-12",
                          isActive || isCompleted
                            ? "border-white bg-red-600"
                            : "border-black bg-white",
                        )}
                      >
                        <Icon
                          src={step.icon}
                          className={cn(
                            "h-5 w-5",
                            isActive || isCompleted
                              ? "text-white"
                              : "text-red-600",
                          )}
                        />
                      </div>
                    </div>

                    {/* Label below the circle */}
                    <div className="mt-3 text-center leading-tight">
                      <div className="text-[10px] uppercase tracking-[0.25em] text-zinc-400">
                        {step.subLabel}
                      </div>
                      <div className="text-xs md:text-sm text-white mt-0.5">
                        {step.label}
                      </div>
                    </div>
                  </div>

                  {/* CONNECTOR LINE — between circles */}
                  {hasConnector && (
                    <div className="flex-1 flex items-center -mt-10">
                      {" "}
                      {/* Negative margin to align with circles */}
                      <div className="relative h-1.5 w-full rounded-full bg-zinc-700/70 overflow-hidden">
                        <div
                          className="absolute left-0 top-0 h-full bg-red-600 transition-all duration-300"
                          style={{ width: `${fillPercent}%` }}
                        />
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
