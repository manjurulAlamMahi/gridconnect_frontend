import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Award, FileText, Camera } from "lucide-react";
import TeamImage from "@/assets/Icons/Primitive.img.svg";
import type { TeamProfile } from "@/types/team";
import { useFormContext } from "react-hook-form";
import { useRef, useState, useEffect } from "react";

interface PreviewProps {
  teamProfile: TeamProfile;
  resetPreview?: boolean;
  onImageChange?: (file: File) => void;
}

const Preview = ({
  teamProfile,
  resetPreview,
  onImageChange,
}: PreviewProps) => {
  const { watch, setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Watch values to update preview in real-time
  const location = watch("location");
  const website = watch("website");
  const activeSeason = watch("active_season");
  const teamName = watch("team_name");

  // Local state for image preview
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [imageHash, setImageHash] = useState(Date.now());

  // Reset preview when resetPreview prop changes
  useEffect(() => {
    if (resetPreview) {
      setLogoPreview(null);
      setImageHash(Date.now());
    }
  }, [resetPreview]);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onImageChange) {
        onImageChange(file);
      }
      setValue("team_logo", file);
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div>
      <article className="rounded-[14px] border  bg-[#1A1A1A] p-6 text-white shadow-[0_35px_80px_-45px_rgba(0,0,0,0.8)]">
        <div className="flex flex-col items-center gap-4 text-center">
          <div className="relative group">
            <Avatar className="h-24 w-24 border-4">
              <AvatarImage
                src={
                  logoPreview ||
                  (teamProfile.team_logo
                    ? `${teamProfile.team_logo}?t=${imageHash}`
                    : TeamImage)
                }
                className="object-cover"
              />
              <AvatarFallback>
                {teamName?.substring(0, 2).toUpperCase() || "TM"}
              </AvatarFallback>
            </Avatar>
            <button
              type="button"
              onClick={handleImageClick}
              className="absolute bottom-0 right-0 bg-primary p-2 rounded-full border-2 border-[#1A1A1A] hover:bg-primary/90 transition-colors cursor-pointer"
            >
              <Camera className="h-4 w-4 text-white" />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              className="hidden"
              accept="image/*"
              onChange={handleLogoUpload}
            />
          </div>
          <div>
            <h2 className="text-2xl font-semibold">
              {teamName || "Team Name"}
            </h2>
            <p className="text-white/60">Team</p>
          </div>
        </div>

        <div>
          <hr className="bg-accent mt-6" />
        </div>
        <div className="mt-6 space-y-4 text-sm text-accent/70">
          <div className="flex items-center gap-3">
            <div className="bg-[#0D0D0D] p-2 rounded-sm">
              <MapPin className="h-[18px] w-[18px] text-primary" />
            </div>
            <div>
              <p className="text-xs">Location</p>
              <p className="text-accent text-sm">
                {location || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#0D0D0D] p-2 rounded-sm">
              <Calendar className="h-[18px] w-[18px] text-primary" />
            </div>
            <div>
              <p className="text-xs">Website</p>
              <p className="text-accent text-sm">
                {website || "Not specified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#0D0D0D] p-2 rounded-sm">
              <FileText className="h-[18px] w-[18px] text-primary" />
            </div>
            <div>
              <p className="text-xs">License Status</p>
              <p className="text-accent text-sm">
                {teamProfile.license_verified ? "Verified" : "Not Verified"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <div className="bg-[#0D0D0D] p-2 rounded-sm">
              <Award className="h-[18px] w-[18px] text-primary" />
            </div>
            <div>
              <p className="text-xs">Active Season</p>
              <p className="text-accent text-sm">
                {activeSeason || "Not specified"}
              </p>
            </div>
          </div>
        </div>
      </article>
    </div>
  );
};
export default Preview;
