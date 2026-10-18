import Preview from "./_components/Preview";
import PersonalInformation from "./_components/PersonalInformation";
import RacingInformation from "./_components/RacingInformation";
import VerificationStatus from "./_components/VerificationStatus";
import VerificationDocument from "./_components/VerificationDocument";
import { Button } from "@/components/ui/button";
import { ChevronLeft, ChevronRight } from "lucide-react";
import SaveIcon from "@/assets/Icons/save_icon.svg";
import Icon from "@/components/shared/Icon";
import { useUpdateDriverInfoMutation } from "@/redux/endpoints/driver/driver.api";
import { toast } from "sonner";
import { useEffect, useRef, useState } from "react";
import { useDriverProfile } from "@/providers/DriverProfileProvider";
import { useSEO } from "@/hooks/use-seo";

const Profile = () => {
  useSEO({
    title: "My Profile",
    description: "Manage your driver profile and racing information.",
  });

  const { data, isLoading, error, refetch } = useDriverProfile();
  console.log("Profile Data", data);
  const [updateDriverInfo, { isLoading: isUpdating }] =
    useUpdateDriverInfoMutation();
  const formRef = useRef<HTMLFormElement>(null);
  const [resetPreview, setResetPreview] = useState(false);
  const [imageFile, setImageFile] = useState<File | null>(null);

  useEffect(() => {
    if (error) {
      toast.error("Failed to load profile");
    }
  }, [error]);

  const profileData = data?.data?.user || data?.data?.driver;

  const handleSave = async () => {
    if (!formRef.current) return;

    if (!formRef.current.reportValidity()) {
      return;
    }

    const formData = new FormData(formRef.current);

    // Explicitly add image file if selected, to ensure it's included
    if (imageFile) {
      formData.set("image", imageFile);
    }

    // Debug logging
    // for (const [key, value] of formData.entries()) {
    //   console.log("FormData:", key, value);
    // }

    try {
      await updateDriverInfo(formData).unwrap();
      toast.success("Profile updated successfully");
      refetch();
      setResetPreview(true);
      setTimeout(() => setResetPreview(false), 0);
      setImageFile(null); // Clear selected file after upload
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to update profile");
    }
  };
  return (
    <section className="space-y-6">
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

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <p className="text-sm sm:text-base text-white/60">
          See your profile information and make edits
        </p>
        <Button
          onClick={handleSave}
          disabled={isLoading || isUpdating}
          className="h-10 w-full sm:w-auto bg-linear-to-b from-primary to-primary/70 px-5 text-sm font-semibold text-white shadow hover:brightness-110 disabled:opacity-50"
        >
          <Icon src={SaveIcon} />
          {isUpdating ? "Saving..." : "Save Changes"}
        </Button>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
        </div>
      ) : profileData ? (
        <form ref={formRef} className="flex flex-wrap gap-6 mb-20 md:mb-8">
          <div className="flex w-full flex-col gap-6 lg:w-[28%]">
            <Preview
              data={profileData}
              resetPreview={resetPreview}
              onImageChange={setImageFile}
            />
            <VerificationStatus documents={profileData.documents} />
          </div>
          <div className="flex w-full flex-col gap-6 lg:w-[70%]">
            <PersonalInformation data={profileData} />
            <RacingInformation data={profileData} />
            <VerificationDocument documents={profileData.documents} />
          </div>
        </form>
      ) : (
        <div className="text-center py-20 text-white/60">
          No profile data available
        </div>
      )}
    </section>
  );
};

export default Profile;
