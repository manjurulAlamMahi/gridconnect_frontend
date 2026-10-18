import backgroundImage from "@/assets/images/GetStarted.svg";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import Icon from "@/components/shared/Icon";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import Shield from "@/assets/Icons/sheild.svg";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { ArrowRight, Info, UploadIcon } from "lucide-react";
import {
  useRef,
  useState,
  type ChangeEvent,
  type DragEvent,
  type FormEvent,
} from "react";
import { useNavigate } from "react-router";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";
import { useSetupTeamPageThreeMutation } from "@/redux/endpoints/team/team.api";
import { toast } from "sonner";

const Verification = () => {
  const navigate = useNavigate();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [setupTeamPageThree, { isLoading }] = useSetupTeamPageThreeMutation();

  const [file, setFile] = useState<File | null>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const handleFileUpload = () => fileInputRef.current?.click();

  const handleFileSelect = (event: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = event.target.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const validateAndSetFile = (selectedFile?: File) => {
    if (selectedFile) {
      if (selectedFile.size > 10 * 1024 * 1024) {
        toast.error("File size must be less than 10MB");
        return;
      }
      setFile(selectedFile);
    }
  };

  const handleDrop = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    setIsDragOver(false);
    const selectedFile = event.dataTransfer.files?.[0];
    validateAndSetFile(selectedFile);
  };

  const handleDrag = (event: DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    if (event.type === "dragenter" || event.type === "dragover") {
      setIsDragOver(true);
    } else if (event.type === "dragleave") {
      setIsDragOver(false);
    }
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!file) {
      toast.error("Please select a competition license to upload");
      return;
    }

    const payload = new FormData();
    payload.append("competetion_license", file);

    try {
      const response = await setupTeamPageThree(payload).unwrap();
      if (response.status === "success") {
        toast.success(response.message || "License uploaded successfully");
        navigate("/join/team-profile-setup/choose-plan");
      } else {
        toast.error(response.message || "Something went wrong");
      }
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload license");
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
      <MultiStepProgress currentStep={3} mode="team" />

      <section className="relative w-full flex items-center justify-center overflow-hidden">
        <div className="relative z-10 w-full max-w-2xl px-4 my-16">
          <Card
            className={cn(
              "bg-linear-to-tl to-[#0E1421] via-[#08090D] from-[#040404] border rounded-2xl shadow-xl w-full p-6 md:p-8",
              "backdrop-blur-md",
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-2 pt-4 pb-4">
              <h2 className="text-2xl font-bold text-accent text-center">
                Verification
              </h2>
              <p className="text-accent text-center text-sm max-w-md font-normal">
                Verify your team&apos;s authenticity and credentials
              </p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                <div className="flex flex-col gap-2">
                  <Label className="text-[#D3D3D3] flex items-center gap-1">
                    Competition License *
                    <Info className="w-4 h-4 text-primary" />
                  </Label>
                  <div
                    onClick={handleFileUpload}
                    onDrop={handleDrop}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    className={cn(
                      "rounded-2xl bg-[#1E2939] px-6 py-10 text-center transition-all cursor-pointer border-2 border-transparent",
                      isDragOver && "border-primary bg-primary/10",
                      file && !isDragOver && "border-primary/50",
                    )}
                  >
                    <UploadIcon className="w-10 h-10 mx-auto text-primary mb-4" />
                    <p className="text-accent font-semibold">
                      {file ? file.name : "Click to upload or drag and drop"}
                    </p>
                    <p className="text-xs text-accent/70 mt-1">
                      PNG, JPG or PDF (max. 10MB)
                    </p>
                    <input
                      ref={fileInputRef}
                      type="file"
                      id="competetion_license"
                      accept=".png,.jpg,.jpeg,.pdf"
                      className="hidden"
                      onChange={handleFileSelect}
                    />
                  </div>
                </div>

                <div className="rounded-2xl border border-white/10 bg-black/30 p-4 flex gap-3 items-start">
                  <div className="rounded-full p-2 text-[#00C950]">
                    <Icon src={Shield} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-accent mb-1">
                      Why verification matters
                    </p>
                    <p className="text-xs text-accent/70 leading-relaxed">
                      Your verification helps build trust with drivers.
                      Documents are reviewed within 24-48 hours. Verified teams
                      receive a badge and appear higher in search results.
                    </p>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full h-12 font-semibold bg-linear-to-b from-primary to-black/20 text-sm cursor-pointer text-accent tracking-wide shadow-md disabled:opacity-50"
                >
                  {isLoading ? "Submitting..." : "Continue"}
                  {!isLoading && <ArrowRight className="w-4 h-4 ml-2 mb-0.5" />}
                </Button>
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

export default Verification;
