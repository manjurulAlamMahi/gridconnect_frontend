import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import { ArrowRight, Upload, Trash2 } from "lucide-react";
import backgroundImage from "@/assets/images/GetStarted.svg";
import { cn } from "@/lib/utils";
import { useNavigate, useLocation } from "react-router";
import Icon from "@/components/shared/Icon";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";
import PreferredDisciplinesSelect from "@/components/shared/PreferredDisciplinesSelect";
import LicenseTypeSelect from "./LicenseTypeSelect";
import { useEffect, useRef, useState } from "react";
import {
  useGetProfileQuery,
  useSetupDriverPageTwoMutation,
} from "@/redux/endpoints/driver/driver.api";
import { toast } from "sonner";
import { useGetLicenceTypesQuery } from "@/redux/endpoints/Licencetype";
import { useGetDisciplinesQuery } from "@/redux/endpoints/disciplineApi";

interface Achievement {
  title: string;
  year: string;
  position: string;
  attachment: File | string | null;
}

export default function RacingInfoForm() {
  const navigate = useNavigate();
  const location = useLocation();

  // Skip getProfile for new users in setup flow
  const isSetupFlow = location.pathname.includes("setup");

  const [setupDriverPageTwo, { isLoading }] = useSetupDriverPageTwoMutation();
  const { data: profileResponse } = useGetProfileQuery(undefined, {
    skip: isSetupFlow,
  });
  const { data: licenceTypesData } = useGetLicenceTypesQuery();
  const { data: disciplinesData } = useGetDisciplinesQuery();
  const hasAppliedPrefill = useRef(false);

  const [licenseTypeId, setLicenseTypeId] = useState<string>("");
  const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);
  const [cvFile, setCvFile] = useState<File | null>(null);
  const [existingCvName, setExistingCvName] = useState<string>("");
  const [achievements, setAchievements] = useState<Achievement[]>([
    { title: "", year: "", position: "", attachment: "" },
  ]);
  const [errors, setErrors] = useState<Record<string, string[]>>({});

  useEffect(() => {
    if (hasAppliedPrefill.current) return;

    const user = profileResponse?.data?.user;
    const licenceTypes = licenceTypesData?.data || [];
    const disciplineOptions = disciplinesData?.data || [];

    if (!user || licenceTypes.length === 0 || disciplineOptions.length === 0) {
      return;
    }

    const matchedLicense = licenceTypes.find(
      (license) =>
        license.type.trim().toLowerCase() ===
        String(user.license_type || "")
          .trim()
          .toLowerCase(),
    );

    if (matchedLicense) {
      setLicenseTypeId(String(matchedLicense.id));
    }

    const disciplineIds = (user.disciplines || [])
      .map(
        (disciplineName: string) =>
          disciplineOptions.find(
            (discipline) =>
              discipline.name.trim().toLowerCase() ===
              disciplineName.trim().toLowerCase(),
          )?.id as number | undefined,
      )
      .filter((id: number | undefined): id is number => typeof id === "number");

    if (disciplineIds.length > 0) {
      setSelectedDisciplines(disciplineIds);
    }

    if (user.cv) {
      const fileName = user.cv.split("/").pop() || "Existing CV";
      setExistingCvName(fileName);
    }

    if (Array.isArray(user.achievements) && user.achievements.length > 0) {
      setAchievements(
        user.achievements.map(
          (achievement: {
            title?: string;
            year?: number | string;
            position?: string;
            attachment?: string | null;
          }) => ({
            title: achievement.title || "",
            year: achievement.year ? String(achievement.year) : "",
            position: achievement.position || "",
            attachment: achievement.attachment || "",
          }),
        ),
      );
    }

    hasAppliedPrefill.current = true;
  }, [disciplinesData, licenceTypesData, profileResponse]);
  const handleDisciplineChange = (id: number) => {
    setSelectedDisciplines((prev) =>
      prev.includes(id) ? prev.filter((d) => d !== id) : [...prev, id],
    );
  };

  const handleAchievementChange = (
    index: number,
    field: keyof Achievement,
    value: string | File | null,
  ) => {
    const newAchievements = [...achievements];
    newAchievements[index] = { ...newAchievements[index], [field]: value };
    setAchievements(newAchievements);
  };

  const removeAchievement = (index: number) => {
    const newAchievements = achievements.filter((_, i) => i !== index);
    setAchievements(newAchievements);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setCvFile(e.target.files[0]);
      setExistingCvName("");
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!licenseTypeId) {
      toast.error("Please select a license type");
      return;
    }
    if (selectedDisciplines.length === 0) {
      toast.error("Please select at least one discipline");
      return;
    }

    const formData = new FormData();
    formData.append("license_type_id", licenseTypeId);
    selectedDisciplines.forEach((id) =>
      formData.append("disciplines[]", id.toString()),
    );
    if (cvFile) {
      formData.append("cv", cvFile);
    }

    achievements.forEach((achievement, index) => {
      if (achievement.title && achievement.year && achievement.position) {
        formData.append(`achievements[${index}][title]`, achievement.title);
        formData.append(`achievements[${index}][year]`, achievement.year);
        formData.append(
          `achievements[${index}][position]`,
          achievement.position,
        );
        if (achievement.attachment) {
          formData.append(
            `achievements[${index}][attachment]`,
            achievement.attachment,
          );
        }
      }
    });

    try {
      await setupDriverPageTwo(formData).unwrap();
      toast.success("Racing information saved successfully!");
      navigate("/join/driver-profile-setup/verification");
    } catch (error: unknown) {
      const err = error as {
        data?: { message?: string; errors?: Record<string, string[]> };
      };

      if (err?.data?.errors) {
        setErrors(err.data.errors);
      }
      toast.error(err?.data?.message || "Failed to save racing information");
    }
  };

  return (
    <div className="relative min-h-screen">
      {/* Background Layer - covers entire page including stepper */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/90" aria-hidden="true" />

      {/* Stepper - on top of background */}
      <MultiStepProgress currentStep={2} mode="driver" />

      <section className="relative w-full flex items-center justify-center overflow-hidden">
        {/* Content */}
        <div className="relative z-1 my-20">
          <Card
            className={cn(
              "bg-linear-to-tl to-[#0E1421] via-[#08090D] from-[#040404] border rounded-2xl shadow-xl max-w-2xl p-6",
              "backdrop-blur-md",
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-1 pt-8 pb-3">
              <h2 className="text-2xl font-bold text-accent">
                Racing <span className="text-primary">Information</span>
              </h2>
              <p className="text-accent text-center text-sm max-w-xs font-normal">
                Share your racing experience and credentials
              </p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
                {/* License Type */}
                <div className="flex flex-col gap-1">
                  <LicenseTypeSelect
                    value={licenseTypeId}
                    onChange={setLicenseTypeId}
                  />
                  {errors.license_type_id && (
                    <p className="text-red-500 text-sm">
                      {errors.license_type_id[0]}
                    </p>
                  )}
                </div>

                {/* Preferred Disciplines */}
                <div className="flex flex-col gap-1">
                  <PreferredDisciplinesSelect
                    selectedDisciplines={selectedDisciplines}
                    onChange={handleDisciplineChange}
                  />
                  {errors.disciplines && (
                    <p className="text-red-500 text-sm">
                      {errors.disciplines[0]}
                    </p>
                  )}
                </div>

                {/* Upload CV */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cv" className="text-[#D3D3D3] font-semibold">
                    Upload CV
                  </Label>
                  <div className="relative">
                    <Input
                      id="cv"
                      type="file"
                      accept=".pdf"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => document.getElementById("cv")?.click()}
                      className="w-full h-16 flex justify-center items-center bg-input text-accent/60 rounded-xl border border-accent/14 hover:bg-input/90 hover:text-accent/90 cursor-pointer transition gap-1"
                    >
                      <Upload className="text-accent/70 mr-2" />
                      {cvFile
                        ? cvFile.name
                        : existingCvName || "Upload PDF (Max 10MB)"}
                    </Button>
                  </div>
                  {errors.cv && (
                    <p className="text-red-500 text-sm">{errors.cv[0]}</p>
                  )}
                </div>

                {/* Achievements */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between  items-center">
                    <Label className="text-[#D3D3D3] font-semibold">
                      Achievements
                    </Label>
                  </div>
                  {achievements.map((achievement, index) => (
                    <div
                      key={index}
                      className="flex flex-col gap-2 rounded-2xl bg-neutral-900/50 p-4 border border-neutral-800 mt-1 relative"
                    >
                      {achievements.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removeAchievement(index)}
                          className="absolute top-2 right-2 h-6 w-6 text-red-500 hover:text-red-600 hover:bg-red-500/10"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                      <Input
                        type="text"
                        value={achievement.title}
                        onChange={(e) =>
                          handleAchievementChange(
                            index,
                            "title",
                            e.target.value,
                          )
                        }
                        placeholder="Achievement title (e.g., Championship Winner)"
                        className="bg-input border-none h-12! text-base text-accent placeholder:text-accent/60"
                      />
                      <div className="flex gap-2">
                        <Input
                          type="text"
                          value={achievement.year}
                          onChange={(e) =>
                            handleAchievementChange(
                              index,
                              "year",
                              e.target.value,
                            )
                          }
                          placeholder="Year (e.g., 2024)"
                          className="bg-input border-none h-12! text-base text-accent placeholder:text-accent/60"
                        />
                        <Input
                          type="text"
                          value={achievement.position}
                          onChange={(e) =>
                            handleAchievementChange(
                              index,
                              "position",
                              e.target.value,
                            )
                          }
                          placeholder="Position (e.g., 1st)"
                          className="bg-input border-none h-12! text-base text-accent placeholder:text-accent/60"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 font-semibold bg-linear-to-b from-primary to-black/20 text-sm cursor-pointer text-accent tracking-wide shadow-md disabled:opacity-50"
                  >
                    {isLoading ? "Saving..." : "Continue"}{" "}
                    {!isLoading && (
                      <ArrowRight className="w-4 h-4 ml-2 mb-0.5" />
                    )}
                  </Button>
                </div>
              </form>

              {/* Back link */}
              <button
                type="button"
                onClick={() => navigate(-1)}
                className="group flex cursor-pointer items-center gap-2 mx-auto text-base text-accent mt-6 transition"
              >
                {/* Icon with hover effect */}
                <Icon
                  src={BackIcon}
                  className="group-hover:text-primary transition-all"
                />
                <span className="group-hover:text-primary transition-color duration-300">
                  Back to the previous page
                </span>
              </button>
            </CardContent>
          </Card>
        </div>
      </section>
    </div>
  );
}
