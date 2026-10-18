import backgroundImage from "@/assets/images/GetStarted.svg";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import Icon from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { ArrowRight, UploadIcon } from "lucide-react";
import { useRef, useState, type ChangeEvent, type FormEvent } from "react";
import { useNavigate, useLocation } from "react-router";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";
import LicenseTypeSelect from "@/components/shared/LicenseTypeSelect";
import PreferredDisciplinesSelect from "@/components/shared/PreferredDisciplinesSelect";
import {
  useGetTeamProfileQuery,
  useSetupTeamPageTwoMutation,
} from "@/redux/endpoints/team/team.api";
import { toast } from "sonner";
import { useEffect } from "react";

const budgetOptions = [
  "Under $50k",
  "$50k - $100k",
  "$100k - $250k",
  "$250k - $500k",
  "$500k+",
  "Sponsorship Dependent",
];

const NewOpportunity = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const hasAppliedPrefill = useRef(false);

  // Skip getTeamProfile for new users in setup flow
  const isSetupFlow = location.pathname.includes("setup");

  const [setupTeamPageTwo, { isLoading }] = useSetupTeamPageTwoMutation();
  const { data: teamProfileResponse } = useGetTeamProfileQuery(undefined, {
    skip: isSetupFlow,
  });

  const [formData, setFormData] = useState({
    title: "",
    license_type_id: "",
    budget_range: "",
    description: "",
    disciplines: [] as number[],
    vehicle_image: null as File | null,
  });

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  useEffect(() => {
    if (hasAppliedPrefill.current) return;

    const team = teamProfileResponse?.data?.team;
    if (!team) return;

    setFormData((prev) => ({
      ...prev,
      // Only auto-fill fields that exist in team/getProfile and this form.
      description: prev.description || team.short_bio || "",
      disciplines:
        prev.disciplines.length > 0
          ? prev.disciplines
          : (team.disciplines || []).map((d) => d.id),
    }));

    hasAppliedPrefill.current = true;
  }, [teamProfileResponse]);

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setFormData((prev) => ({ ...prev, vehicle_image: file }));
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewUrl(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const toggleDiscipline = (id: number) => {
    setFormData((prev) => ({
      ...prev,
      disciplines: prev.disciplines.includes(id)
        ? prev.disciplines.filter((item) => item !== id)
        : [...prev.disciplines, id],
    }));
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (
      !formData.title ||
      !formData.license_type_id ||
      !formData.budget_range ||
      !formData.description ||
      formData.disciplines.length === 0
    ) {
      toast.error("Please fill in all required fields");
      return;
    }

    const payload = new FormData();
    payload.append("title", formData.title);
    payload.append("license_type_id", formData.license_type_id);
    payload.append("budget_range", formData.budget_range);
    payload.append("description", formData.description);
    formData.disciplines.forEach((id) => {
      payload.append("disciplines[]", id.toString());
    });
    if (formData.vehicle_image) {
      payload.append("vehicle_image", formData.vehicle_image);
    }

    try {
      const response = await setupTeamPageTwo(payload).unwrap();
      if (response.status === "success") {
        toast.success(response.message || "Opportunity created successfully");
        navigate("/join/team-profile-setup/verification");
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error: unknown) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to create opportunity");
    }
  };

  const handleSkip = () => {
    navigate("/join/team-profile-setup/verification");
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
      <MultiStepProgress currentStep={2} mode="team" />

      <section className="relative w-full flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-2xl my-16">
          <Card
            className={cn(
              "bg-linear-to-tl to-[#0E1421] via-[#08090D] from-[#040404] border rounded-2xl shadow-xl w-full",
              "backdrop-blur-md",
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-2 pt-4 pb-4">
              <h2 className="text-2xl font-bold text-accent text-center">
                New <span className="text-primary">Opportunities</span>
              </h2>
              <p className="text-accent text-center text-sm max-w-md font-normal">
                Share details about your available seat or opportunities
              </p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <Label htmlFor="title" className="text-[#D3D3D3]">
                    Title
                  </Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) =>
                      setFormData({ ...formData, title: e.target.value })
                    }
                    placeholder="e.g. 2026 FIA F3 Seat Available"
                    className="bg-input border-none rounded-xl text-base text-accent placeholder:text-accent/60"
                    required
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="flex flex-col gap-2 mt-6">
                    <LicenseTypeSelect
                      value={formData.license_type_id}
                      onChange={(val) =>
                        setFormData({ ...formData, license_type_id: val })
                      }
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <Label htmlFor="budget" className="text-[#D3D3D3]">
                      Budget Range
                    </Label>
                    <Select
                      value={formData.budget_range}
                      onValueChange={(val) =>
                        setFormData({ ...formData, budget_range: val })
                      }
                    >
                      <SelectTrigger className="bg-input border-none rounded-xl text-base text-accent h-[52px]! w-full">
                        <SelectValue placeholder="Select budget" />
                      </SelectTrigger>
                      <SelectContent>
                        {budgetOptions.map((budget) => (
                          <SelectItem key={budget} value={budget}>
                            {budget}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="flex flex-col gap-3">
                  <PreferredDisciplinesSelect
                    selectedDisciplines={formData.disciplines}
                    onChange={toggleDiscipline}
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <Label htmlFor="description" className="text-[#D3D3D3]">
                    Description
                  </Label>
                  <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    placeholder="Describe the opportunity, requirements, and what you're looking for in a driver..."
                    className="bg-input border-none rounded-xl text-sm text-accent placeholder:text-accent/60 min-h-[120px]"
                    required
                  />
                </div>

                <div className="flex flex-col md:flex-row items-center gap-5">
                  <div className="w-32 h-32 rounded-2xl border border-dashed border-primary/70 flex items-center justify-center bg-black/40 overflow-hidden">
                    {previewUrl ? (
                      <img
                        src={previewUrl}
                        alt="Vehicle preview"
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
                      id="vehicle_image"
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
                      Upload Your Vehicle Image
                    </Button>
                    <span className="text-xs text-neutral-400">
                      JPG, PNG or GIF. Max 5MB
                    </span>
                  </div>
                </div>

                <div className="flex flex-col gap-4 pt-2 md:flex-row md:items-stretch md:justify-between">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full md:flex-1 h-12 font-semibold bg-white/5 text-accent border-white/10 hover:border-primary/80"
                    onClick={handleSkip}
                  >
                    Skip
                  </Button>

                  <Button
                    type="submit"
                    disabled={isLoading}
                    className="w-full md:flex-1 h-12 font-semibold bg-linear-to-b from-primary to-primary/60
             text-sm cursor-pointer text-accent tracking-wide shadow-md disabled:opacity-50"
                  >
                    {isLoading ? "Submitting..." : "Continue"}{" "}
                    {!isLoading && (
                      <ArrowRight className="w-4 h-4 ml-2 mb-0.5" />
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

export default NewOpportunity;
