import Icon from "@/components/shared/Icon";
import DocumentIcon from "@/assets/Icons/verification_user.svg";
import { Upload, Info, FileCheck, Eye } from "lucide-react";
import { useRef, useState } from "react";
import { useFormContext } from "react-hook-form";
import type { TeamProfile } from "@/types/team";

interface VerificationDocumentProps {
  teamProfile: TeamProfile;
}

const VerificationDocument = ({ teamProfile }: VerificationDocumentProps) => {
  const { setValue } = useFormContext();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFileUpload = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setValue("competetion_license", file);
      setFileName(file.name);
    }
  };

  const existingLicense = teamProfile?.competetion_license;

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6 text-white shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
      <header className="mb-6 flex items-center gap-2">
        <span className="h-5 w-5">
          <Icon src={DocumentIcon} />
        </span>
        <p className="text-lg font-semibold">Verification Documents</p>
      </header>

      <div className="space-y-3">
        <label className="flex items-center gap-2 text-sm text-white/70">
          Competition License * <Info className="h-4 w-4 text-white/60" />
        </label>

        {existingLicense && !fileName && (
          <div className="mb-3 flex items-center justify-between rounded-xl bg-green-500/10 p-3 border border-green-500/20">
            <div className="flex items-center gap-3">
              <FileCheck className="h-5 w-5 text-green-500" />
              <div>
                <p className="text-sm font-medium text-green-500">
                  License Uploaded
                </p>
                <p className="text-xs text-white/50">
                  Your competition license is on file
                </p>
              </div>
            </div>
            {typeof existingLicense === "string" && (
              <a
                href={existingLicense}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/10 px-2 py-1 rounded-lg transition-colors"
              >
                <Eye className="h-3 w-3" /> View
              </a>
            )}
          </div>
        )}

        <label
          className="flex cursor-pointer flex-col gap-2 rounded-[30px] border border-white/15 bg-black/40 p-4 hover:bg-black/50 transition-colors"
          onClick={handleFileUpload}
        >
          <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/70 py-6 text-center">
            {fileName ? (
              <FileCheck className="h-10 w-10 text-green-500" />
            ) : (
              <Upload className="h-10 w-10 text-primary" />
            )}
            <p className="font-semibold text-accent/60">
              {fileName ? (
                fileName
              ) : (
                <>
                  {existingLicense
                    ? "Click to update license"
                    : "Click to upload license"}{" "}
                </>
              )}
            </p>
            <p className="text-xs text-white/50">PNG, JPG or PDF (max. 10MB)</p>
          </div>
        </label>
        <input
          ref={fileInputRef}
          type="file"
          accept=".png,.jpg,.jpeg,.pdf"
          onChange={handleFileChange}
          className="hidden"
        />
      </div>
    </section>
  );
};

export default VerificationDocument;
