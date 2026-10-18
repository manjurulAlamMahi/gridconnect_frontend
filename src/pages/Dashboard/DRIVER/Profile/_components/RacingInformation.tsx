import { useState, useRef, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import SteeringIcon from "@/assets/Icons/StearingIcons.svg";
import Icon from "@/components/shared/Icon";
import { Upload, Trash2, Eye, FileCheck, Calendar, Trophy } from "lucide-react";
import BadgeIcon from "@/assets/Icons/badge.svg";
import type { DriverUser } from "@/types/driver";
import { useGetDisciplinesQuery } from "@/redux/endpoints/disciplineApi";
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

interface RacingInformationProps {
  data: DriverUser;
}

interface Achievement {
  id: number;
  title: string;
  year: string;
  position: string;
  attachment: File | string | null;
}

const RacingInformation = ({ data }: RacingInformationProps) => {
  const { data: disciplinesData, isLoading: isDisciplinesLoading } =
    useGetDisciplinesQuery();
  const disciplines = disciplinesData?.data || [];

  // Initialize with empty array
  const [selected, setSelected] = useState<number[]>([]);

  // Sync state when data or available disciplines change, but only once initially
  useEffect(() => {
    if (data.disciplines && disciplines.length > 0) {
      // Logic to extract initial IDs...
      let initialIds: number[] = [];

      if (data.disciplines.length > 0) {
        const firstItem = data.disciplines[0];
        if (typeof firstItem === "string") {
          const names = data.disciplines as string[];
          initialIds = disciplines
            .filter((d) => names.includes(d.name))
            .map((d) => d.id);
        } else if (typeof firstItem === "object" && "id" in firstItem) {
          initialIds = (data.disciplines as any[]).map((d) => d.id);
        }
      }

      // Sort to ensure consistent comparison
      initialIds.sort((a, b) => a - b);

      setSelected((prev) => {
        const currentIds = [...prev].sort((a, b) => a - b);
        if (JSON.stringify(initialIds) !== JSON.stringify(currentIds)) {
          return initialIds;
        }
        return prev;
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [disciplines]); // Intentionally restricted dependencies to avoid cycles if data.disciplines is new ref every time

  const [cvFile, setCvFile] = useState<File | null>(null);
  const cvInputRef = useRef<HTMLInputElement>(null);
  const [selectedAchievement, setSelectedAchievement] = useState<any>(null); // Using any for simplicity as API type differs slightly from form type

  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [achievementErrors, setAchievementErrors] = useState<
    Record<number, boolean>
  >({});

  const toggleDiscipline = (id: number) => {
    setSelected((prev) =>
      prev.includes(id) ? prev.filter((p) => p !== id) : [...prev, id],
    );
  };

  const handleCvChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setCvFile(e.target.files[0]);
    }
  };

  const handleAchievementChange = (
    id: number,
    field: keyof Achievement,
    value: string | File | null,
  ) => {
    setAchievements((prev) =>
      prev.map((ach) => (ach.id === id ? { ...ach, [field]: value } : ach)),
    );
  };

  const removeAchievement = (id: number) => {
    setAchievements((prev) => prev.filter((ach) => ach.id !== id));
  };

  const addAchievement = () => {
    setAchievements((prev) => [
      ...prev,
      {
        id: Date.now(),
        title: "",
        year: "",
        position: "",
        attachment: null,
      },
    ]);
  };

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6 text-white shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
      <header className="mb-6 flex items-center gap-2">
        <span className="rounded-full border border-white/15 p-1 text-xs text-white">
          <Icon src={SteeringIcon} />
        </span>
        <p className="text-lg font-semibold">Racing Information</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2">
          <label className="text-sm text-white/70">License Type</label>
          <Input
            name="license_type"
            defaultValue={data.license_type || ""}
            placeholder="Enter license type"
            className="rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/70">Years of Experience</label>
          <Input
            name="experience"
            defaultValue={data.experience || ""}
            placeholder="5"
            className="rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
          />
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <label className="text-sm text-white/70">
          Preferred Disciplines (Select all that apply)
        </label>
        {selected.map((id) => (
          <input key={id} type="hidden" name="disciplines[]" value={id} />
        ))}
        {isDisciplinesLoading ? (
          <div className="text-sm text-white/40">Loading disciplines...</div>
        ) : (
          <div className="flex flex-wrap gap-2">
            {disciplines.map((item) => {
              const isActive = selected.includes(item.id);
              return (
                <button
                  type="button"
                  key={item.id}
                  onClick={() => toggleDiscipline(item.id)}
                  className={`rounded-full px-4 py-1.5 text-xs font-semibold transition ${
                    isActive
                      ? "bg-primary text-white shadow-[0_15px_35px_-20px_rgba(255,81,47,0.8)]"
                      : "border border-white/10 text-white/60 hover:text-white"
                  }`}
                >
                  {item.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <div className="mt-6 space-y-3">
        {data.achievements && data.achievements.length > 0 && (
          <div className="space-y-3">
            {data.achievements.map((achievement) => (
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
        <div className="space-y-3">
          <label className="text-sm text-white/70">Add New Achievements</label>

          {achievements.map((item, index) => {
            const fieldIndex = (data.achievements?.length || 0) + index;
            // Only include name attributes if the item has at least some data
            // This prevents sending empty objects to the backend which causes 500 errors
            const hasData =
              !!item.title ||
              !!item.year ||
              !!item.position ||
              !!item.attachment;
            const getName = (name: string) => (hasData ? name : undefined);

            return (
              <div
                key={item.id}
                className="relative space-y-3 bg-[#0D0D0D] p-4 rounded-2xl"
              >
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    removeAchievement(item.id);
                  }}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-400 p-1"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
                <div>
                  <Input
                    placeholder="Enter title"
                    required
                    value={item.title}
                    name={getName(`achievements[${fieldIndex}][title]`)}
                    onChange={(e) =>
                      handleAchievementChange(item.id, "title", e.target.value)
                    }
                    className="rounded-2xl border-none! bg-[#1A1A1A] text-white placeholder:text-white/40"
                  />
                </div>
                <div className="grid gap-3 md:grid-cols-2">
                  <Input
                    placeholder="Year"
                    required
                    value={item.year}
                    name={getName(`achievements[${fieldIndex}][year]`)}
                    onChange={(e) =>
                      handleAchievementChange(item.id, "year", e.target.value)
                    }
                    className="rounded-2xl border-none bg-[#1A1A1A] text-white placeholder:text-white/40"
                  />
                  <input
                    type="hidden"
                    name={getName(`achievements[${fieldIndex}][position]`)}
                    value={item.position}
                  />
                  <Select
                    value={item.position}
                    onValueChange={(val) =>
                      handleAchievementChange(item.id, "position", val)
                    }
                  >
                    <SelectTrigger className="w-full h-[52px]! rounded-2xl  bg-[#1A1A1A] text-white border-none">
                      <SelectValue placeholder="Select position" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0B0B] text-white">
                      <SelectItem value="1st">1st</SelectItem>
                      <SelectItem value="2nd">2nd</SelectItem>
                      <SelectItem value="3rd">3rd</SelectItem>
                      <SelectItem value="Top 10">Top 10</SelectItem>
                      <SelectItem value="Participant">Participant</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <div className="relative group">
                    <input
                      type="file"
                      required={!item.attachment}
                      name={getName(`achievements[${fieldIndex}][attachment]`)}
                      accept=".pdf,.png,.jpg,.jpeg"
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-20"
                      onInvalid={(e) => {
                        e.preventDefault();
                        setAchievementErrors((prev) => ({
                          ...prev,
                          [item.id]: true,
                        }));
                      }}
                      onChange={(e) => {
                        setAchievementErrors((prev) => ({
                          ...prev,
                          [item.id]: false,
                        }));
                        handleAchievementChange(
                          item.id,
                          "attachment",
                          e.target.files?.[0] || null,
                        );
                      }}
                    />
                    <div className="w-full flex items-center justify-center gap-2 rounded-xl bg-[#1A1A1A] py-3 text-sm text-white/70 border border-transparent transition group-hover:border-primary/40 group-hover:text-white">
                      <Upload className="h-4 w-4" />
                      {item.attachment instanceof File
                        ? item.attachment.name
                        : "Add Attachment"}
                    </div>
                  </div>
                  {achievementErrors[item.id] && (
                    <p className="text-red-500 text-xs mt-1 ml-1">
                      Attachment is required
                    </p>
                  )}
                </div>
              </div>
            );
          })}

          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              addAchievement();
            }}
            className="w-full rounded-xl bg-[#0D0D0D] py-3 text-sm text-white/70 hover:border-primary/40 cursor-pointer border border-transparent transition-colors hover:text-white"
          >
            + Add Another
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-3">
        <label className="text-sm text-white/70">Career Bio</label>
        <Textarea
          defaultValue={data.bio || ""}
          placeholder="Share notable stories, mentors, or goals for your next season..."
          className="min-h-[120px] rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
        />
      </div>

      <div className="mt-6 space-y-2">
        <label className="text-sm text-white/70">Upload CV</label>

        {data.cv && !cvFile && (
          <div className="flex items-center justify-between rounded-xl bg-green-500/10 p-3 border border-green-500/20 mb-2">
            <div className="flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-500">
                  CV Uploaded
                </p>
                <p className="text-xs text-white/50">Your CV is on file</p>
              </div>
            </div>
            <a
              href={data.cv}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/10 px-2 py-1 rounded-lg transition-colors"
            >
              <Eye className="h-3 w-3" /> View
            </a>
          </div>
        )}

        <input
          type="file"
          ref={cvInputRef}
          name="cv"
          onChange={handleCvChange}
          accept=".pdf,.doc,.docx"
          className="hidden"
        />

        <label
          className="flex cursor-pointer flex-col gap-2 rounded-[30px] border border-white/15 bg-black/40 p-4 hover:bg-black/50 transition-colors"
          onClick={() => cvInputRef.current?.click()}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/70 py-6 text-center">
            {cvFile ? (
              <FileCheck className="h-10 w-10 text-green-500" />
            ) : (
              <Upload className="h-10 w-10 text-primary" />
            )}
            <p className="font-semibold text-accent/60">
              {cvFile ? (
                cvFile.name
              ) : (
                <>{data.cv ? "Click to replace CV" : "Click to upload CV"}</>
              )}
            </p>
            <p className="text-xs text-white/50">
              {cvFile ? "File selected" : "PDF, DOC, DOCX (Max 10MB)"}
            </p>
          </div>
        </label>
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
