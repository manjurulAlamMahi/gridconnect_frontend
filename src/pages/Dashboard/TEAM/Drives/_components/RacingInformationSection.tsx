import React from "react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import Icon from "@/components/shared/Icon";
import SteeringIcon from "@/assets/Icons/StearingIcons.svg";
import { useFormContext, Controller } from "react-hook-form";
import { useGetDisciplinesQuery } from "@/redux/endpoints/disciplineApi";

const RacingInformationSection: React.FC = () => {
  const { register, control } = useFormContext();
  const { data: disciplineData } = useGetDisciplinesQuery();

  return (
    <Card className="rounded-3xl border border-[#272727] bg-[#141414] text-white">
      <CardHeader className="flex flex-row items-center gap-3 ">
        <span className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/5">
          <Icon src={SteeringIcon} />
        </span>
        <h3 className="text-sm font-semibold">Racing Information</h3>
      </CardHeader>

      <CardContent className="pt-6 space-y-4">
        {/* Experience + Location */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="experience" className="text-xs text-white/80">
              Experience Required <span className="text-red-500">*</span>
            </Label>
            <Input
              id="experience"
              placeholder="5 Seasons"
              className="h-11 rounded-xl border-none bg-black/70 text-sm text-white placeholder:text-white/50"
              {...register("experience", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location" className="text-xs text-white/80">
              Location <span className="text-red-500">*</span>
            </Label>
            <Input
              id="location"
              placeholder='e.g. "Monza, Italy"'
              className="h-11 rounded-xl border-none bg-black/70 text-sm text-white placeholder:text-white/50"
              {...register("location", { required: true })}
            />
          </div>
        </div>

        {/* Deadline + Seat */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="deadline" className="text-xs text-white/80">
              Application Deadline <span className="text-red-500">*</span>
            </Label>
            <Input
              id="deadline"
              type="date"
              placeholder="Select Date"
              className="h-11 rounded-xl border-none bg-black/70 text-sm text-white placeholder:text-white/50"
              {...register("deadline", { required: true })}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="available_seat" className="text-xs text-white/80">
              Available Seat <span className="text-red-500">*</span>
            </Label>
            <Input
              id="available_seat"
              placeholder='e.g. "3 Seats"'
              className="h-11 rounded-xl border-none bg-black/70 text-sm text-white placeholder:text-white/50"
              {...register("available_seat", { required: true })}
            />
          </div>
        </div>

        {/* Contract duration */}
        <div className="space-y-2">
          <Label htmlFor="contract_duration" className="text-xs text-white/80">
            Contact Duration <span className="text-white/40">(Optional)</span>
          </Label>
          <Input
            id="contract_duration"
            placeholder='e.g. "1 season" / "2026–2027"'
            className="h-11 rounded-xl border-none bg-black/70 text-sm text-white placeholder:text-white/50"
            {...register("contract_duration")}
          />
        </div>

        {/* Preferred disciplines */}
        <div className="space-y-3 pt-1">
          <Label className="text-xs text-white/80">
            Preferred Disciplines{" "}
            <span className="text-[10px] text-white/50">
              (Select all that apply)
            </span>
          </Label>
          <Controller
            name="discipline_id"
            control={control}
            defaultValue={[]}
            render={({ field: { value = [], onChange } }) => (
              <div className="flex flex-wrap gap-2">
                {disciplineData?.data?.map((item: any) => {
                  const isActive = value.includes(item.id);
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => {
                        const newValue = isActive
                          ? value.filter((v: number) => v !== item.id)
                          : [...value, item.id];
                        onChange(newValue);
                      }}
                      className={cn(
                        "rounded-full px-4 py-1.5 text-xs font-medium transition-all border",
                        isActive
                          ? "bg-primary text-white border-primary"
                          : "bg-black/70 text-white/70 border-white/15 hover:border-primary/70 hover:text-white"
                      )}
                    >
                      {item.name}
                    </button>
                  );
                })}
              </div>
            )}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default RacingInformationSection;
