import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import { ArrowRight, Info } from "lucide-react";
import { useNavigate } from "react-router";
import backgroundImage from "@/assets/images/GetStarted.svg";
import ShieldCheck from "@/assets/Icons/sheild.svg";
import { cn } from "@/lib/utils";
import { useRef, useState } from "react";
import UploadIcon from "@/assets/Icons/upload.svg";
import Icon from "@/components/shared/Icon";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";
import { useSetupDriverPageThreeMutation } from "@/redux/endpoints/driver/driver.api";
import { toast } from "sonner";

export default function VerificationForm() {
  const govIdInputRef = useRef<HTMLInputElement>(null);
  const racingLicenseInputRef = useRef<HTMLInputElement>(null);
  const navigate = useNavigate();
  const [setupDriverPageThree, { isLoading }] =
    useSetupDriverPageThreeMutation();

  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [racingLicenseFile, setRacingLicenseFile] = useState<File | null>(null);

  const handleFileUpload = (
    fileInputRef: React.RefObject<HTMLInputElement | null>,
  ) => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    type: string,
  ) => {
    const file = event.target.files?.[0];
    if (file) {
      console.log(`Selected ${type} file:`, file.name);

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should not exceed 10MB");
        return;
      }

      if (type === "government ID") {
        setGovIdFile(file);
      } else if (type === "racing license") {
        setRacingLicenseFile(file);
      }
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>, type: string) => {
    event.preventDefault();
    const files = event.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      console.log(`Dropped ${type} file:`, file.name);

      // Validate file size (max 10MB)
      if (file.size > 10 * 1024 * 1024) {
        toast.error("File size should not exceed 10MB");
        return;
      }

      if (type === "government ID") {
        setGovIdFile(file);
      } else if (type === "racing license") {
        setRacingLicenseFile(file);
      }
    }
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (!govIdFile || !racingLicenseFile) {
      toast.error("Please upload both Government ID and Racing License");
      return;
    }

    const formData = new FormData();
    formData.append("govt_id", govIdFile);
    formData.append("racing_license", racingLicenseFile);

    try {
      await setupDriverPageThree(formData).unwrap();
      toast.success("Documents uploaded successfully!");
      navigate("/join/driver-profile-setup/choose-plan");
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to upload documents");
      console.error("Setup Page Three Error:", error);
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
      <MultiStepProgress currentStep={3} mode="driver" />

      <section className="relative w-full flex items-center justify-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10">
          <Card
            className={cn(
              "bg-linear-to-tl to-[#0E1421] via-[#08090D] from-[#040404] border rounded-2xl shadow-xl p-6",
              "backdrop-blur-md",
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-2 pt-8 pb-4">
              <h2 className="text-2xl font-bold text-accent">Verification</h2>
              <p className="text-[#BCBFC3] text-center text-sm max-w-sm font-normal">
                Upload your documents to verify your identity and racing
                credentials
              </p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-6" onSubmit={handleSubmit}>
                {/* Government ID */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Label
                      htmlFor="gov-id"
                      className="text-[#D3D3D3] font-semibold"
                    >
                      Government-Issued ID{" "}
                      <span className="text-primary">*</span>
                    </Label>
                    <Info className="w-4 h-4 text-accent/60" />
                  </div>
                  <input
                    type="file"
                    ref={govIdInputRef}
                    onChange={(e) => handleFileChange(e, "government ID")}
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    id="gov-id"
                  />
                  <div
                    className="bg-input rounded-[12px] p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "government ID")}
                    onClick={() => handleFileUpload(govIdInputRef)}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="bg-primary/15 p-5 rounded-full">
                        <Icon src={UploadIcon} />
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-accent text-sm">
                          {govIdFile
                            ? govIdFile.name
                            : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-accent/60">
                          PNG, JPG or PDF (max. 10MB)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Racing License */}
                <div className="flex flex-col gap-2">
                  <div className="flex items-center gap-1">
                    <Label
                      htmlFor="racing-license"
                      className="text-[#D3D3D3] font-semibold"
                    >
                      Racing License <span className="text-primary">*</span>
                    </Label>
                    <Info className="w-4 h-4 text-accent/60" />
                  </div>
                  <input
                    type="file"
                    ref={racingLicenseInputRef}
                    onChange={(e) => handleFileChange(e, "racing license")}
                    accept=".png,.jpg,.jpeg,.pdf"
                    className="hidden"
                    id="racing-license"
                  />
                  <div
                    className="bg-input rounded-[12px] p-6 flex flex-col items-center justify-center cursor-pointer hover:border-primary/50 transition-colors"
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, "racing license")}
                    onClick={() => handleFileUpload(racingLicenseInputRef)}
                  >
                    <div className="flex flex-col items-center gap-3 text-center">
                      <span className="bg-primary/15 p-5 rounded-full">
                        <Icon src={UploadIcon} />
                      </span>
                      <div className="flex flex-col gap-1">
                        <span className="font-medium text-accent text-sm">
                          {racingLicenseFile
                            ? racingLicenseFile.name
                            : "Click to upload or drag and drop"}
                        </span>
                        <span className="text-xs text-accent/60">
                          PNG, JPG or PDF (max. 10MB)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Security Info */}
                <div className="bg-neutral-900/60 rounded-xl border border-neutral-700 p-4 text-[#99A1AF] text-xs flex flex-col gap-2 mb-1 shadow">
                  <div className="flex items-center gap-2">
                    <Icon
                      src={ShieldCheck}
                      className="w-5 h-5 text-[#00C950]"
                    />
                    <span className="text-accent font-medium text-sm ml-2">
                      Your documents are secure
                    </span>
                  </div>
                  <ul className="pl-10 list-disc text-xs">
                    <li>All files are encrypted and stored securely</li>
                    <li>
                      Only authorized verification staff can access your
                      documents
                    </li>
                    <li>
                      Documents are automatically deleted after verification
                      (14-30 days)
                    </li>
                    <li>
                      We never share your personal information with third
                      parties
                    </li>
                  </ul>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    disabled={isLoading || !govIdFile || !racingLicenseFile}
                    className="w-full h-12 font-semibold bg-linear-to-b from-primary to-black/20 text-sm cursor-pointer text-accent tracking-wide shadow-md disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {isLoading ? "Uploading..." : "Continue"}{" "}
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
