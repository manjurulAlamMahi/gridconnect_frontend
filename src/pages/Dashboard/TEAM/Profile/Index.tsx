import Preview from "./_components/Preview";
import PersonalInformation from "./_components/PersonalInformation";
import RacingInformation from "./_components/RacingInformation";
import VerificationStatus from "./_components/VerificationStatus";
import VerificationDocument from "./_components/VerificationDocument";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SaveIcon from "@/assets/Icons/save_icon.svg";
import Icon from "@/components/shared/Icon";
import { useUpdateTeamInfoMutation } from "@/redux/endpoints/team/team.api";
import { useForm, FormProvider } from "react-hook-form";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { useTeamProfile } from "@/providers/TeamProfileProvider";
import { useSEO } from "@/hooks/use-seo";

const Profile = () => {
  useSEO({
    title: "Team Profile",
    description: "Manage your team profile and achievements.",
  });

  const { data, isLoading, error, refetch } = useTeamProfile();
  const [updateTeamInfo, { isLoading: isUpdating }] =
    useUpdateTeamInfoMutation();
  const teamProfile = data?.data?.team;
  const [resetPreview, setResetPreview] = useState(false);
  const [logoFile, setLogoFile] = useState<File | null>(null);

  const methods = useForm({
    defaultValues: {
      team_name: "",
      location: "",
      website: "",
      contact_name: "",
      short_bio: "",
      active_season: "",
      disciplines: [] as number[],
      achievements: [] as {
        title: string;
        year: string;
        position: string;
        id?: number;
        attachment?: File | null;
      }[],
      team_logo: null as File | null,
      competetion_license: null as File | null,
    },
  });

  const { reset, handleSubmit } = methods;

  useEffect(() => {
    if (teamProfile) {
      reset({
        team_name: teamProfile.team_name || "",
        location: teamProfile.location || "",
        website: teamProfile.website || "",
        contact_name: teamProfile.contact_name || "",
        short_bio: teamProfile.short_bio || "",
        active_season: teamProfile.active_season || "",
        disciplines: teamProfile.disciplines?.map((d: any) => d.id) || [],
        achievements: [],
      });
    }
  }, [teamProfile, reset]);

  const onSubmit = async (data: any) => {
    try {
      const formData = new FormData();
      formData.append("team_name", data.team_name);
      formData.append("location", data.location);
      formData.append("website", data.website);
      formData.append("contact_name", data.contact_name);
      formData.append("short_bio", data.short_bio);
      formData.append("active_season", data.active_season);

      // Use the logoFile state if available, otherwise check form data
      if (logoFile) {
        formData.append("team_logo", logoFile);
      } else if (data.team_logo instanceof File) {
        formData.append("team_logo", data.team_logo);
      }

      if (data.competetion_license instanceof File) {
        formData.append("competetion_license", data.competetion_license);
      }

      // Disciplines
      if (data.disciplines && data.disciplines.length > 0) {
        data.disciplines.forEach((id: number, index: number) => {
          formData.append(`disciplines[${index}]`, String(id));
        });
      }

      // Achievements
      let achievementIndex = 0;

      // Add existing achievements
      if (teamProfile?.achievements) {
        teamProfile.achievements.forEach((ach: any) => {
          formData.append(
            `achievements[${achievementIndex}][title]`,
            ach.title,
          );
          formData.append(
            `achievements[${achievementIndex}][year]`,
            String(ach.year),
          );
          formData.append(
            `achievements[${achievementIndex}][position]`,
            ach.position,
          );
          if (ach.id) {
            formData.append(`achievements[${achievementIndex}][id]`, ach.id);
          }
          achievementIndex++;
        });
      }

      // Add new achievements
      if (data.achievements && data.achievements.length > 0) {
        data.achievements.forEach((achievement: any) => {
          formData.append(
            `achievements[${achievementIndex}][title]`,
            achievement.title,
          );
          formData.append(
            `achievements[${achievementIndex}][year]`,
            achievement.year,
          );
          formData.append(
            `achievements[${achievementIndex}][position]`,
            achievement.position,
          );
          if (achievement.attachment instanceof File) {
            formData.append(
              `achievements[${achievementIndex}][attachment]`,
              achievement.attachment,
            );
          }
          achievementIndex++;
        });
      }

      const res = await updateTeamInfo(formData).unwrap();
      toast.success(res.message || "Profile updated successfully");
      refetch(); // Refetch to update the centralized data
      setResetPreview(true);
      setTimeout(() => setResetPreview(false), 0);
      setLogoFile(null); // Clear selected file after upload
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center py-20">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error || !teamProfile) {
    return (
      <section className="space-y-6">
        <div className="flex items-center justify-center py-20">
          <p className="text-red-500">
            Failed to load profile. Please try again.
          </p>
        </div>
      </section>
    );
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="flex gap-4">
          <p className="flex gap-2.5">
            <span>
              <ChevronLeft className="h-6 w-6 rounded-[6px] border-2 border-[#CCD2D8]" />
            </span>{" "}
            <span>
              <ChevronRight className="h-6 w-6 rounded-[6px] border-2 border-[#CCD2D8]" />
            </span>
          </p>
          <p className="text-sm font-medium">Profile</p>
        </div>

        <div className="flex items-center justify-between">
          <p className="text-base text-white/60">
            See your profile information and make edits
          </p>
          <Button
            type="submit"
            disabled={isUpdating}
            className="h-10 bg-linear-to-b from-primary to-primary/70 px-5 text-sm font-semibold text-white shadow hover:brightness-110"
          >
            {isUpdating ? (
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            ) : (
              <Icon src={SaveIcon} />
            )}
            {isUpdating ? "Saving..." : "Save Changes"}
          </Button>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[28%_70%] gap-6">
          <div className="flex flex-col gap-6">
            <Preview
              teamProfile={teamProfile}
              resetPreview={resetPreview}
              onImageChange={setLogoFile}
            />
            <VerificationStatus />
          </div>
          <div className="flex flex-col gap-6">
            <PersonalInformation />
            <RacingInformation data={teamProfile} />
            <VerificationDocument teamProfile={teamProfile} />
          </div>
        </div>
      </form>
    </FormProvider>
  );
};

export default Profile;
