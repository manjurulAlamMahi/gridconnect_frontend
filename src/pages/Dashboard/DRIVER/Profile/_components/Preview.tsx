import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Badge } from "@/components/ui/badge"
import { MapPin, Calendar, Award, FileText, Camera } from "lucide-react";
import { useState, useRef, useEffect } from "react";
import type { DriverUser } from "@/types/driver";
import { useGetProfileCompletionQuery } from "@/redux/endpoints/driver/driver.api";

interface PreviewProps {
  data: DriverUser;
  resetPreview?: boolean;
  onImageChange?: (file: File) => void;
}

const Preview = ({ data, resetPreview, onImageChange }: PreviewProps) => {
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [imageHash, setImageHash] = useState(Date.now());
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { data: completionData, isLoading: completionLoading } =
    useGetProfileCompletionQuery();

  useEffect(() => {
    if (resetPreview) {
      setPreviewImage(null);
      setImageHash(Date.now());
    }
  }, [resetPreview]);

  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((n) => n[0])
      .join("")
      .toUpperCase()
      .slice(0, 2);
  };

  // Use API data for completion percentage, fallback to local calculation if API fails
  const completion =
    completionData?.data?.profile_completion_percentage ||
    (() => {
      let score = 0;
      if (data.name) score += 15;
      if (data.date_of_birth) score += 15;
      if (data.nationality) score += 10;
      if (data.bio) score += 15;
      if (data.license_type) score += 10;
      if (data.experience) score += 10;
      if (data.image) score += 10;
      if (data.disciplines?.length > 0) score += 10;
      if (data.documents) score += 15;
      return score;
    })();

  const handleImageClick = () => {
    fileInputRef.current?.click();
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (onImageChange) {
        onImageChange(file);
      }
      // Just preview the image - actual upload happens with form submission
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <article className="rounded-[14px] border  bg-[#1A1A1A] p-6 text-white shadow-[0_35px_80px_-45px_rgba(0,0,0,0.8)]">
      <div className="flex flex-col items-center gap-4 text-center">
        <div className="relative group">
          <Avatar className="h-24 w-24 border-4">
            <AvatarImage
              src={
                previewImage ||
                (data.image ? `${data.image}?t=${imageHash}` : "") ||
                "https://images.unsplash.com/photo-1504593811423-6dd665756598?q=80&w=400"
              }
            />
            <AvatarFallback>{getInitials(data.name)}</AvatarFallback>
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
            name="image"
            ref={fileInputRef}
            onChange={handleImageChange}
            accept="image/*"
            className="hidden"
          />
        </div>
        <div>
          <h2 className="text-2xl font-semibold">{data.name}</h2>
          <p className="text-white/60">Professional Racer</p>
        </div>
        <div className="flex justify-between w-full text-sm">
          <p className="text-sm font-medium text-accent/60">
            Profile Completion
          </p>
          <p className="text-primary font-medium">
            {completionLoading ? "..." : `${completion}%`}
          </p>
        </div>
        <div className="w-full rounded-full bg-white/10">
          <div
            className="rounded-full bg-primary text-xs text-center h-2"
            style={{ width: `${completion}%` }}
          ></div>
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
            <p className="text-xs">Nationality</p>
            <p className="text-accent text-sm">
              {data.nationality || "Not specified"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#0D0D0D] p-2 rounded-sm">
            <Calendar className="h-[18px] w-[18px] text-primary" />
          </div>
          <div>
            <p className="text-xs">Date of Birth</p>
            <p className="text-accent text-sm">
              {data.date_of_birth
                ? new Date(data.date_of_birth).toLocaleDateString("en-US", {
                    year: "numeric",
                    month: "short",
                    day: "numeric",
                  })
                : "Not specified"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#0D0D0D] p-2 rounded-sm">
            <FileText className="h-[18px] w-[18px] text-primary" />
          </div>
          <div>
            <p className="text-xs">License Type</p>
            <p className="text-accent text-sm">
              {data.license_type || "Not specified"}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="bg-[#0D0D0D] p-2 rounded-sm">
            <Award className="h-[18px] w-[18px] text-primary" />
          </div>
          <div>
            <p className="text-xs">Experience</p>
            <p className="text-accent text-sm">
              {data.experience || "Not specified"}
            </p>
          </div>
        </div>
      </div>

      {/* <div className="mt-8 space-y-3">
        <p className="text-sm font-semibold text-white">Highlights</p>
        <ul className="space-y-3 text-sm text-white/80">
          {profile.achievements.map((item) => (
            <li
              key={item}
              className="flex items-center gap-2 rounded-2xl border border-white/10 bg-black/40 px-3 py-2"
            >
              <Badge
                variant="outline"
                className="border-primary/40 text-[10px] text-primary"
              >
                Pro
              </Badge>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div> */}
    </article>
  );
};
export default Preview;
