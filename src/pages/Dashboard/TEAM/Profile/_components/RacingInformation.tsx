import { useState } from "react";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import Icon from "@/components/shared/Icon";
import RacingIcon from "@/assets/Icons/stearing.svg";
import BadgeIcon from "@/assets/Icons/badge.svg";
import { useFormContext, useFieldArray, Controller } from "react-hook-form";
import PreferredDisciplinesSelect from "@/components/shared/PreferredDisciplinesSelect";
import { Trash2, Eye, Calendar, Trophy, Upload } from "lucide-react";

interface RacingInformationProps {
  data: any;
}

const RacingInformation = ({ data }: RacingInformationProps) => {
  const { register, control } = useFormContext();
  const { fields, append, remove } = useFieldArray({
    control,
    name: "achievements",
  });

  const [selectedAchievement, setSelectedAchievement] = useState<any>(null);

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6 text-white shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
      <header className="mb-6 flex items-center gap-2">
        <Icon src={RacingIcon} />
        <p className="text-lg font-semibold">Racing Information</p>
      </header>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm text-white/70">Season Active</label>
          <Input
            placeholder="5"
            {...register("active_season")}
            className="rounded-2xl border border-white/15 bg-black/60 text-white placeholder:text-white/40"
          />
        </div>

        <div className="space-y-3">
          <Controller
            name="disciplines"
            control={control}
            render={({ field }) => (
              <PreferredDisciplinesSelect
                selectedDisciplines={field.value || []}
                onChange={(id) => {
                  const current = field.value || [];
                  const updated = current.includes(id)
                    ? current.filter((val: number) => val !== id)
                    : [...current, id];
                  field.onChange(updated);
                }}
              />
            )}
          />
        </div>

        <div className="space-y-3">
          {data?.achievements && data.achievements.length > 0 && (
            <div className="space-y-3 mb-4">
              {data.achievements.map((achievement: any) => (
                <div
                  key={achievement.id}
                  onClick={() => setSelectedAchievement(achievement)}
                  className="flex cursor-pointer items-center gap-3 rounded-2xl bg-black/40 px-4 py-3 text-sm text-white/80 hover:bg-black/60 transition-colors"
                >
                  <span className="flex h-7 w-7 items-center justify-center">
                    <Icon src={BadgeIcon} className="h-4 w-4 text-[#FFB900]" />
                  </span>
                  <div className="flex-1">
                    <p className="font-semibold">{achievement.title}</p>
                    {achievement.description && (
                      <p className="text-xs text-white/60">
                        {achievement.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          <label className="text-sm text-white/70">Add New Achievements</label>
          <div className="space-y-3 mt-2.5">
            {fields.map((field, index) => (
              <div
                key={field.id}
                className="relative space-y-3 bg-[#0D0D0D] p-4 rounded-2xl"
              >
                <button
                  type="button"
                  onClick={() => remove(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>

                <div className="space-y-1">
                  <Input
                    placeholder="Enter title (e.g. F4 Champion)"
                    {...register(`achievements.${index}.title`, {
                      required: true,
                    })}
                    required
                    className="rounded-2xl border-none! bg-[#1A1A1A] text-white placeholder:text-white/40"
                  />
                </div>

                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Year (e.g. 2023)"
                    {...register(`achievements.${index}.year`, {
                      required: true,
                    })}
                    required
                    className="rounded-2xl border-none! bg-[#1A1A1A] text-white placeholder:text-white/40"
                  />
                  <Controller
                    control={control}
                    name={`achievements.${index}.position`}
                    rules={{ required: true }}
                    render={({ field }) => (
                      <Select
                        required
                        onValueChange={field.onChange}
                        value={field.value}
                      >
                        <SelectTrigger className="w-full rounded-2xl h-[52px]! border-none bg-[#1A1A1A] text-white">
                          <SelectValue placeholder="Select position" />
                        </SelectTrigger>
                        <SelectContent className="bg-[#0B0B0B] text-white">
                          <SelectItem value="1st">1st</SelectItem>
                          <SelectItem value="2nd">2nd</SelectItem>
                          <SelectItem value="3rd">3rd</SelectItem>
                          <SelectItem value="Participant">
                            Participant
                          </SelectItem>
                          <SelectItem value="Finalist">Finalist</SelectItem>
                        </SelectContent>
                      </Select>
                    )}
                  />
                </div>

                <div>
                  <Controller
                    control={control}
                    name={`achievements.${index}.attachment`}
                    render={({ field: { onChange, value, ref, ...field } }) => (
                      <div className="relative group">
                        <input
                          {...field}
                          type="file"
                          ref={ref}
                          accept=".pdf,.png,.jpg,.jpeg"
                          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                          onChange={(e) => {
                            onChange(e.target.files?.[0] || null);
                          }}
                        />
                        <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3 text-sm text-white/70 border border-transparent transition group-hover:border-primary/40 group-hover:text-white">
                          <Upload className="h-4 w-4" />
                          {value instanceof File
                            ? value.name
                            : "Add Attachment"}
                        </div>
                      </div>
                    )}
                  />
                </div>
              </div>
            ))}
          </div>

          <button
            type="button"
            onClick={() =>
              append({ title: "", year: "", position: "", attachment: null })
            }
            className="w-full rounded-xl bg-[#0D0D0D] py-3 text-sm text-white/70 hover:border-primary/40 cursor-pointer border border-transparent transition-colors hover:text-white"
          >
            + Add Another
          </button>
        </div>
      </div>

      <Dialog
        open={!!selectedAchievement}
        onOpenChange={(open) => !open && setSelectedAchievement(null)}
      >
        <DialogContent className="border-white/10 bg-[#1A1A1A] text-white sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-xl">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-primary">
                <Icon src={BadgeIcon} className="h-5 w-5 text-[#FFB900]" />
              </span>
              Achievement Details
            </DialogTitle>
          </DialogHeader>
          {selectedAchievement && (
            <div className="grid gap-4 py-4">
              <div className="space-y-1">
                <p className="text-sm font-medium text-white/50">Title</p>
                <p className="text-lg font-semibold">
                  {selectedAchievement.title}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/50">Date/Year</p>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <p>
                      {selectedAchievement.date ||
                        selectedAchievement.year ||
                        "N/A"}
                    </p>
                  </div>
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium text-white/50">Position</p>
                  <div className="flex items-center gap-2">
                    <Trophy className="h-4 w-4 text-[#FFB900]" />
                    <p>
                      {selectedAchievement.position ||
                        selectedAchievement.description ||
                        "N/A"}
                    </p>
                  </div>
                </div>
              </div>

              {selectedAchievement.attachment && (
                <div className="pt-2">
                  <a
                    href={selectedAchievement.attachment}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex w-full items-center justify-center gap-2 rounded-xl bg-white/5 py-3 text-sm font-medium text-white transition hover:bg-white/10"
                  >
                    <Eye className="h-4 w-4" />
                    View Proof Attachment
                  </a>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </section>
  );
};

export default RacingInformation;
