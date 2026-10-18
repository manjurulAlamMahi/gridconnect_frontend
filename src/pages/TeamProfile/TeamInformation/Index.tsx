import backgroundImage from "@/assets/images/GetStarted.svg";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import Icon from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowRight, UploadIcon } from "lucide-react";
import {
  useEffect,
  useRef,
  useState,
  type ChangeEvent,
  type FormEvent,
} from "react";
import { useNavigate, useLocation } from "react-router";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";
import {
  useGetTeamProfileQuery,
  useSetupTeamPageOneMutation,
} from "@/redux/endpoints/team/team.api";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import PreferredDisciplinesSelect from "@/components/shared/PreferredDisciplinesSelect";

type Achievement = {
  title: string;
  year: string;
  position: string;
};

const TeamInformationPage = () => {
  const navigate = useNavigate();
  const routerLocation = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasAppliedPrefill = useRef(false);

  // Skip getTeamProfile for new users in setup flow
  const isSetupFlow = routerLocation.pathname.includes("setup");

  // API mutation
  const [setupTeamPageOne, { isLoading }] = useSetupTeamPageOneMutation();
  const { data: teamProfileResponse } = useGetTeamProfileQuery(undefined, {
    skip: isSetupFlow,
  });

  // Get user data from Redux for pre-filling during setup
  const authUser = useAppSelector((state) => state.auth.user);

  // Form state
  const [teamLogo, setTeamLogo] = useState<File | null>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [teamName, setTeamName] = useState("");
  const [teamLocation, setTeamLocation] = useState("");
  const [website, setWebsite] = useState("");
  const [shortBio, setShortBio] = useState("");

  // Disciplines with shared component (uses numeric IDs)
  const [selectedDisciplines, setSelectedDisciplines] = useState<number[]>([]);

  // Achievements
  const [achievements, setAchievements] = useState<Achievement[]>([
    { title: "", year: "", position: "" },
  ]);

  // Pre-fill from Redux (for setup flow) or API response (for edit flow)
  useEffect(() => {
    if (hasAppliedPrefill.current) return;

    // For setup flow, use Redux data
    if (isSetupFlow && authUser) {
      if (authUser.teamName) setTeamName(authUser.teamName);
      if (authUser.image) setPreview(authUser.image);
      hasAppliedPrefill.current = true;
      return;
    }

    // For edit flow, use API response
    const team = teamProfileResponse?.data?.team;
    if (!team) return;

    setTeamName(team.team_name || "");
    setTeamLocation(team.location || "");
    setWebsite(team.website || "");
    setShortBio(team.short_bio || "");
    setSelectedDisciplines((team.disciplines || []).map((d) => d.id));

    const mappedAchievements = (team.achievements || []).map((achievement) => ({
      title: achievement.title || "",
      year: achievement.year ? String(achievement.year) : "",
      position: achievement.position || "",
    }));

    if (mappedAchievements.length > 0) {
      setAchievements(mappedAchievements);
    }

    if (team.team_logo) {
      setPreview(team.team_logo);
    }

    hasAppliedPrefill.current = true;
  }, [teamProfileResponse, isSetupFlow, authUser]);

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setTeamLogo(file);
    setPreview(URL.createObjectURL(file));
    console.log("Selected team logo:", file.name);
  };

  const toggleDiscipline = (id: number) => {
    setSelectedDisciplines((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id],
    );
  };

  const handleAchievementChange = (
    index: number,
    field: keyof Achievement,
    value: string,
  ) => {
    setAchievements((prev) =>
      prev.map((achievement, idx) =>
        idx === index ? { ...achievement, [field]: value } : achievement,
      ),
    );
  };

  const addAchievement = () => {
    setAchievements((prev) => [...prev, { title: "", year: "", position: "" }]);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    // Basic validation
    if (!teamName || !shortBio) {
      toast.error("Please fill in all required fields");
      return;
    }

    if (selectedDisciplines.length === 0) {
      toast.error("Please select at least one discipline");
      return;
    }

    const formData = new FormData();

    if (teamLogo) {
      formData.append("team_logo", teamLogo);
    }

    formData.append("team_name", teamName);
    formData.append("location", teamLocation);
    formData.append("website", website);
    formData.append("short_bio", shortBio);

    selectedDisciplines.forEach((id) => {
      formData.append("disciplines[]", id.toString());
    });

    achievements.forEach((achievement, index) => {
      if (achievement.title && achievement.year && achievement.position) {
        formData.append(`achievements[${index}][title]`, achievement.title);
        formData.append(`achievements[${index}][year]`, achievement.year);
        formData.append(
          `achievements[${index}][position]`,
          achievement.position,
        );
      }
    });

    try {
      await setupTeamPageOne(formData).unwrap();
      toast.success("Team information saved successfully!");
      navigate("/join/team-profile-setup/new-opportunity");
    } catch (error: unknown) {
      console.error("Setup Team Page One Error:", error);
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to save team information");
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
      <MultiStepProgress currentStep={1} mode="team" />

      <section className="relative w-full flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-2xl px-4 my-16">
          <Card
            className={cn(
              "bg-linear-to-tl to-[#0E1421] via-[#08090D] from-[#040404] border rounded-2xl shadow-xl w-full",
              "backdrop-blur-md",
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-2 pt-4 pb-4">
              <h2 className="text-2xl font-bold text-accent text-center">
                Team <span className="text-primary">Information</span>
              </h2>
              <p className="text-accent text-center text-sm max-w-md font-normal">
                Tell us about your racing team to set up your profile
              </p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Logo upload + preview */}
                <div className="flex flex-col md:flex-row items-center gap-5">
                  <div className="w-32 h-32 rounded-2xl border border-dashed border-primary/70 flex items-center justify-center bg-black/40 overflow-hidden">
                    {preview ? (
                      <img
                        src={preview}
                        alt="Team logo preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <UploadIcon className="w-10 h-10 text-primary/90" />
                    )}
                  </div>
                  <div className="flex flex-col gap-2 w-full max-w-xs">
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept=".jpg,.jpeg,.png,.gif"
                      onChange={handleFileChange}
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary hover:bg-primary text-accent h-12 cursor-pointer"
                      onClick={handleFileUpload}
                    >
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Upload Team Logo
                    </Button>
                    <span className="text-xs text-neutral-400">
                      JPG, PNG or GIF. Max 5MB
                    </span>
                  </div>
                </div>

                {/* Team name + location */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="teamName" className="text-[#D3D3D3]">
                      Team Name *
                    </Label>
                    <Input
                      id="teamName"
                      placeholder="Enter team name"
                      className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                      required
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="location" className="text-[#D3D3D3]">
                      Location
                    </Label>
                    <Input
                      id="location"
                      placeholder="Enter team location"
                      className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                      value={teamLocation}
                      onChange={(e) => setTeamLocation(e.target.value)}
                    />
                  </div>
                </div>

                {/* Website */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="website" className="text-[#D3D3D3]">
                    Website (Optional)
                  </Label>
                  <Input
                    id="website"
                    type="url"
                    placeholder="https://yourteam.domain"
                    className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                    value={website}
                    onChange={(e) => setWebsite(e.target.value)}
                  />
                </div>

                {/* Short bio */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="bio" className="text-[#D3D3D3]">
                    Short Bio *
                  </Label>
                  <Textarea
                    id="bio"
                    placeholder="Tell drivers about your team, racing history, and what makes you unique..."
                    className="bg-input border-none rounded-xl text-sm text-accent placeholder:text-accent/60 min-h-[120px]"
                    required
                    value={shortBio}
                    onChange={(e) => setShortBio(e.target.value)}
                  />
                </div>

                {/* Preferred disciplines – shared component */}
                <div className="flex flex-col gap-3">
                  {/* <Label className="text-[#D3D3D3]">
                    Preferred Disciplines *{" "}
                    <span className="text-xs text-accent/70">
                      (Select all that apply)
                    </span>
                  </Label> */}
                  <PreferredDisciplinesSelect
                    selectedDisciplines={selectedDisciplines}
                    onChange={toggleDiscipline}
                  />
                </div>

                {/* Achievements */}
                <div className="flex flex-col gap-3">
                  <div className="flex items-center justify-between gap-2 flex-wrap">
                    <Label className="text-[#D3D3D3]">Achievements</Label>
                    <button
                      type="button"
                      className="text-sm text-primary font-semibold cursor-pointer"
                      onClick={addAchievement}
                    >
                      + Add Achievement
                    </button>
                  </div>
                  <div className="flex flex-col gap-4">
                    {achievements.map((achievement, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4"
                      >
                        <Input
                          placeholder="e.g. F1 World Champion"
                          className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                          value={achievement.title}
                          onChange={(event) =>
                            handleAchievementChange(
                              index,
                              "title",
                              event.target.value,
                            )
                          }
                        />
                        <Input
                          placeholder="Year (e.g. 2023)"
                          type="text"
                          className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                          value={achievement.year}
                          onChange={(event) =>
                            handleAchievementChange(
                              index,
                              "year",
                              event.target.value,
                            )
                          }
                        />
                        <Input
                          placeholder="Position (e.g. 1st)"
                          className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                          value={achievement.position}
                          onChange={(event) =>
                            handleAchievementChange(
                              index,
                              "position",
                              event.target.value,
                            )
                          }
                        />
                      </div>
                    ))}
                  </div>
                </div>

                {/* Submit */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 font-semibold bg-linear-to-b from-primary to-black/20 text-sm cursor-pointer text-accent tracking-wide shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? (
                      "Saving..."
                    ) : (
                      <>
                        Continue <ArrowRight className="w-4 h-4 ml-2 mb-0.5" />
                      </>
                    )}
                  </Button>
                </div>
              </form>

              <button
                type="button"
                onClick={() => navigate(-1)}
                className="group flex cursor-pointer items-center gap-2 mx-auto text-base text-accent mt-6 transition"
              >
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
};

export default TeamInformationPage;
