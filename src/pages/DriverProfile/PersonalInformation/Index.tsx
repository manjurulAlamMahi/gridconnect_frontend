import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import backgroundImage from "@/assets/images/GetStarted.svg";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CalendarIcon,
  UploadIcon,
  ArrowRight,
  User,
  Loader2,
} from "lucide-react";
import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import * as React from "react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { useNavigate, useLocation } from "react-router";
import { useRef } from "react";
import Icon from "@/components/shared/Icon";
import {
  useGetProfileQuery,
  useSetupDriverPageOneMutation,
} from "@/redux/endpoints/driver/driver.api";
import { useAppSelector } from "@/redux/hooks";
import { toast } from "sonner";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";

function formatDate(date: Date | undefined) {
  if (!date) return "";
  return date.toLocaleDateString("en-US", {
    day: "2-digit",
    month: "long",
    year: "numeric",
  });
}

export default function PersonalInfoForm() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasAppliedPrefill = useRef(false);

  // Skip getProfile for new users in setup flow (route contains "setup")
  const isSetupFlow = location.pathname.includes("setup");

  const [open, setOpen] = React.useState(false);
  const [date, setDate] = React.useState<Date | undefined>(new Date());
  const [month, setMonth] = React.useState<Date | undefined>(date);
  const [value, setValue] = React.useState(formatDate(date));
  const [name, setName] = React.useState("");
  const [nationality, setNationality] = React.useState("");
  const [photo, setPhoto] = React.useState<File | null>(null);
  const [photoPreview, setPhotoPreview] = React.useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [setupPageOne, { isLoading }] = useSetupDriverPageOneMutation();
  // Skip profile fetch for new users in setup flow to avoid 401 errors
  const { data: profileResponse } = useGetProfileQuery(undefined, {
    skip: isSetupFlow,
  });

  // Get user data from Redux for pre-filling during setup
  const authUser = useAppSelector((state) => state.auth.user);

  // Pre-fill from Redux (for setup flow) or API response (for edit flow)
  React.useEffect(() => {
    if (hasAppliedPrefill.current) return;

    // For setup flow, use Redux data
    if (isSetupFlow && authUser) {
      const fullName = [authUser.firstName, authUser.lastName]
        .filter(Boolean)
        .join(" ");
      if (fullName) setName(fullName);

      if (authUser.dateOfBirth) {
        const parsedDate = new Date(authUser.dateOfBirth);
        if (!Number.isNaN(parsedDate.getTime())) {
          setDate(parsedDate);
          setMonth(parsedDate);
          setValue(formatDate(parsedDate));
        }
      }

      if (authUser.image) {
        setPhotoPreview(authUser.image);
      }

      hasAppliedPrefill.current = true;
      return;
    }

    // For edit flow, use API response
    const user = profileResponse?.data?.user;
    if (!user) return;

    if (user.name) {
      setName(user.name);
    }

    if (user.nationality) {
      setNationality(user.nationality);
    }

    if (user.date_of_birth) {
      const parsedDate = new Date(user.date_of_birth);
      if (!Number.isNaN(parsedDate.getTime())) {
        setDate(parsedDate);
        setMonth(parsedDate);
        setValue(formatDate(parsedDate));
      }
    }

    if (user.image) {
      setPhotoPreview(user.image);
    }

    hasAppliedPrefill.current = true;
  }, [profileResponse, isSetupFlow, authUser]);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setPhoto(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPhotoPreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!name || !date || !nationality) {
      toast.error("Please fill in all required fields");
      return;
    }

    const formData = new FormData();
    formData.append("name", name);
    formData.append("date_of_birth", date.toISOString().split("T")[0]);
    formData.append("nationality", nationality);
    if (photo) {
      formData.append("image", photo);
    }

    try {
      await setupPageOne(formData).unwrap();
      toast.success("Personal information saved successfully!");
      navigate("/join/driver-profile-setup/racing-information");
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to save information");
      console.error("Setup Page One Error:", error);
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
      <MultiStepProgress currentStep={1} mode="driver" />

      <section className="relative w-full flex items-center justify-center overflow-hidden">

        {/* Content */}
        <div className="relative z-10">
          <Card
            className={cn(
              "bg-linear-to-tl to-[#0E1421] via-[#08090D] from-[#040404] border rounded-2xl shadow-xl w-[503px] p-6",
              "backdrop-blur-md",
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-2 pt-8 pb-4">
              <h2 className="text-2xl font-bold text-accent">
                Personal <span className="text-primary">Information</span>
              </h2>
              <p className="text-accent text-center text-sm max-w-xs font-normal">
                Tell us about yourself to create your driver profile
              </p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Photo Upload */}
                <div className="flex items-center gap-5 mb-2">
                  <div className="rounded-full border-3 border-primary w-32 h-32 flex items-center justify-center mb-1 overflow-hidden bg-neutral-800">
                    {photoPreview ? (
                      <img
                        src={photoPreview}
                        alt="Profile preview"
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <User className="text-primary" size={56} />
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".jpg,.jpeg,.png,.gif"
                      className="hidden"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      className="border-primary hover:bg-primary text-accent h-12 cursor-pointer transition-colors"
                      onClick={handleFileUpload}
                    >
                      <UploadIcon className="w-4 h-4 mr-2" />
                      Upload Photo
                    </Button>
                    <span className="text-xs text-neutral-400 ">
                      JPG, PNG or GIF. Max 5MB
                    </span>
                  </div>
                </div>

                {/* Full Name */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="name" className="text-[#D3D3D3]">
                    Full Name
                  </Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter your full name"
                    className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                  />
                </div>

                {/* Date of Birth - Using Shadcn Calendar */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Label htmlFor="dob" className="text-[#D3D3D3]">
                      Date of Birth
                    </Label>
                    <span className="text-xs text-accent/60">
                      <CalendarIcon className="w-4 h-4 inline align-middle ml-1 mb-0.5" />
                    </span>
                  </div>

                  {/* Popover Calendar */}
                  <div className="relative flex gap-2">
                    <Input
                      id="dob"
                      value={value}
                      readOnly
                      placeholder="mm/dd/yyyy"
                      className="bg-input border-none rounded-xl text-base text-accent/60 placeholder:text-accent/60 cursor-pointer"
                      onClick={() => setOpen(true)}
                    />
                    <Popover open={open} onOpenChange={setOpen}>
                      <PopoverTrigger asChild>
                        <Button
                          variant="ghost"
                          className="absolute top-1/2 right-2 size-6 -translate-y-1/2"
                        >
                          <CalendarIcon className="size-3.5 text-accent/60" />
                          <span className="sr-only">Select date</span>
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-auto overflow-hidden p-0"
                        align="end"
                        alignOffset={-8}
                        sideOffset={10}
                      >
                        <Calendar
                          mode="single"
                          selected={date}
                          captionLayout="dropdown"
                          month={month}
                          onMonthChange={setMonth}
                          onSelect={(date) => {
                            if (date) {
                              setDate(date);
                              setValue(formatDate(date));
                              setOpen(false);
                            }
                          }}
                          startMonth={new Date(1960, 0)}
                          endMonth={new Date(2015, 11)}
                        />
                      </PopoverContent>
                    </Popover>
                  </div>
                </div>

                {/* Nationality */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="nationality" className="text-[#D3D3D3]">
                    Nationality
                  </Label>
                  <Select onValueChange={setNationality} value={nationality}>
                    <SelectTrigger className="bg-input border-none rounded-[12px] text-base text-accent w-full h-13!">
                      <SelectValue placeholder="Select your nationality" />
                    </SelectTrigger>
                    <SelectContent className="bg-[#0B0E12] border-slate-800 text-accent">
                      <SelectItem value="American">American</SelectItem>
                      <SelectItem value="UK">UK</SelectItem>
                      <SelectItem value="British">British</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="Italian">Italian</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="Japanese">Japanese</SelectItem>
                      {/* Add more as needed */}
                    </SelectContent>
                  </Select>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full h-12 font-semibold bg-linear-to-b from-primary to-black/20 text-sm cursor-pointer text-accent tracking-wide shadow-md disabled:opacity-70"
                  >
                    {isLoading ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <>
                        Continue <ArrowRight className="w-4 h-4 ml-2 mb-0.5" />
                      </>
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
