import { Upload, FileCheck, Eye } from "lucide-react";
import VerificationDoc from "@/assets/Icons/verification_dc.svg";
import Icon from "@/components/shared/Icon";
import type { DriverDocument } from "@/types/driver";
import { useRef, useState } from "react";

interface VerificationDocumentProps {
  documents: DriverDocument | null;
}

const VerificationDocument = ({
  documents: userDocuments,
}: VerificationDocumentProps) => {
  const govIdRef = useRef<HTMLInputElement>(null);
  const racingLicenseRef = useRef<HTMLInputElement>(null);
  const [govIdFile, setGovIdFile] = useState<File | null>(null);
  const [racingLicenseFile, setRacingLicenseFile] = useState<File | null>(null);

  const documentsList = [
    {
      id: "govt_id",
      label: "Government-issued ID",
      uploaded: userDocuments?.govt_id,
      verified: userDocuments?.govt_id_verified,
      ref: govIdRef,
      file: govIdFile,
      setFile: setGovIdFile,
    },
    {
      id: "racing_license",
      label: "Racing License",
      uploaded: userDocuments?.racing_license,
      verified: userDocuments?.racing_license_verified,
      ref: racingLicenseRef,
      file: racingLicenseFile,
      setFile: setRacingLicenseFile,
    },
  ];
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6 text-white shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
      <header className="mb-6 flex items-center gap-2">
        <span className="rounded-full border border-white/15 p-1 text-xs text-white">
          <Icon src={VerificationDoc} />
        </span>
        <p className="text-lg font-semibold">Verification Documents</p>
      </header>
      <div className="grid gap-4 md:grid-cols-2">
        {documentsList.map((doc) => (
          <div key={doc.id} className="space-y-3">
            <label className="flex items-center gap-2 text-sm text-white/70">
              {doc.label} *
            </label>

            {doc.uploaded && !doc.file && (
              <div className="flex items-center justify-between rounded-xl bg-green-500/10 p-3 border border-green-500/20">
                <div className="flex items-center gap-3">
                  <FileCheck className="h-5 w-5 text-green-500" />
                  <div>
                    <p className="text-sm font-medium text-green-500">
                      Document Uploaded
                    </p>
                    <p className="text-xs text-white/50">
                      Your {doc.label.toLowerCase()} is on file
                    </p>
                  </div>
                </div>
                <a
                  href={doc.uploaded}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 text-xs text-white/70 hover:text-white bg-white/10 px-2 py-1 rounded-lg transition-colors"
                >
                  <Eye className="h-3 w-3" /> View
                </a>
              </div>
            )}

            <label
              className="flex cursor-pointer flex-col gap-2 rounded-[30px] border border-white/15 bg-black/40 p-4 hover:bg-black/50 transition-colors"
              onClick={() => doc.ref.current?.click()}
            >
              <div className="flex flex-1 flex-col items-center justify-center gap-3 rounded-2xl border border-white/10 bg-black/70 py-6 text-center">
                {doc.file ? (
                  <FileCheck className="h-10 w-10 text-green-500" />
                ) : (
                  <Upload className="h-10 w-10 text-primary" />
                )}
                <p className="font-semibold text-accent/60">
                  {doc.file ? (
                    doc.file.name
                  ) : (
                    <>
                      {doc.uploaded
                        ? "Click to update document"
                        : "Click to upload document"}{" "}
                    </>
                  )}
                </p>
                <p className="text-xs text-white/50">
                  PNG, JPG or PDF (max. 10MB)
                </p>
              </div>
            </label>
            <input
              type="file"
              ref={doc.ref}
              name={doc.id}
              accept="image/*,.pdf"
              onChange={(e) =>
                e.target.files?.[0] && doc.setFile(e.target.files[0])
              }
              className="hidden"
            />
          </div>
        ))}
      </div>
    </section>
  );
};

export default VerificationDocument;
