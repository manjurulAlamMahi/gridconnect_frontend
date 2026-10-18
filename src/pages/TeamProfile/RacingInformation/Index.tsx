import { Card, CardHeader, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { ArrowRight, Upload, Info, Plus } from "lucide-react";
import backgroundImage from "@/assets/images/GetStarted.svg";
import { cn } from "@/lib/utils";
import { useNavigate } from "react-router";
import Icon from "@/components/shared/Icon";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";

const disciplines = [
  "Formula Racing",
  "GT Racing",
  "Touring Car",
  "Rally",
  "Rallycross",
  "Endurance Racing",
  "Prototype / LMP",
  "Historic Racing",
  "Karting",
  "Hill Climb / Time Attack",
  "Drifting",
  "Off-Road / Cross-Country",
  "Esports / Sim Racing",
  "Electric / Sustainable Racing",
];

export default function RacingInfoForm() {
  const navigate = useNavigate();
  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    navigate("/join/driver-profile-setup/verification");
  };

  return (
    <div className="relative min-h-screen">
      <MultiStepProgress currentStep={2} />
      <section className=" w-full flex items-center justify-center overflow-hidden">
        {/* Background Layer */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/90" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-1 my-20">
          <Card
            className={cn(
              "bg-linear-to-tl to-[#0E1421] via-[#08090D] from-[#040404] border rounded-2xl shadow-xl max-w-2xl p-6",
              "backdrop-blur-md",
            )}
          >
            <CardHeader className="flex flex-col items-center justify-center gap-1 pt-8 pb-3">
              <h2 className="text-2xl font-bold text-accent">
                Racing <span className="text-primary">Information</span>
              </h2>
              <p className="text-accent text-center text-sm max-w-xs font-normal">
                Share your racing experience and credentials
              </p>
            </CardHeader>
            <CardContent>
              <form className="flex flex-col gap-7" onSubmit={handleSubmit}>
                {/* License Type */}
                <div className="flex flex-col gap-2">
                  <div className="flex gap-1 items-center">
                    <Label
                      htmlFor="license-type"
                      className="text-[#D3D3D3] font-semibold"
                    >
                      License Type <span className="text-primary">*</span>
                    </Label>
                    <Info className="w-4 h-4 text-accent/60" />
                  </div>
                  <Select>
                    <SelectTrigger className="bg-input border-none rounded-[12px] text-base text-accent h-12! w-full">
                      <SelectValue placeholder="Select license type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="fia">FIA International</SelectItem>
                      <SelectItem value="national">National</SelectItem>
                      <SelectItem value="regional">Regional</SelectItem>
                      {/* Add more as needed */}
                    </SelectContent>
                  </Select>
                </div>

                {/* Preferred Disciplines */}
                <div className="flex flex-col gap-2">
                  <Label className="text-[#D3D3D3] font-semibold">
                    Preferred Disciplines{" "}
                    <span className="text-primary">*</span>
                  </Label>
                  <span className="text-[13px] text-accent/60 mb-2">
                    (Select all that apply)
                  </span>
                  <div className="flex flex-wrap gap-2">
                    {disciplines.map((d) => (
                      <button
                        type="button"
                        key={d}
                        className="px-4 py-[7px] bg-input text-accent/80 rounded-[12px] text-sm border border-accent/14 hover:bg-accent/10 hover:text-accent transition font-medium"
                      >
                        {d}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Upload CV */}
                <div className="flex flex-col gap-2">
                  <Label htmlFor="cv" className="text-[#D3D3D3] font-semibold">
                    Upload CV
                  </Label>
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full h-16 flex justify-center items-center bg-input text-accent/60 rounded-xl border border-accent/14 hover:bg-input/90 hover:text-accent/90 cursor-pointer transition gap-1"
                  >
                    <Upload className="text-accent/70 mr-2" />
                    Upload PDF (Max 10MB)
                  </Button>
                </div>

                {/* Achievements */}
                <div className="flex flex-col gap-2">
                  <div className="flex justify-between  items-center">
                    <Label className="text-[#D3D3D3] font-semibold">
                      Achievements
                    </Label>
                    <Button
                      type="button"
                      variant="link"
                      className="text-primary text-sm flex items-center gap-1 px-0"
                    >
                      <Plus className="w-4 h-4" />
                      Add Achievement
                    </Button>
                  </div>
                  <div className="flex flex-col gap-2 rounded-2xl bg-neutral-900/50 p-4 border border-neutral-800 mt-1">
                    <Input
                      type="text"
                      placeholder="Achievement title (e.g., Championship Winner)"
                      className="bg-input border-none h-12! text-base text-accent placeholder:text-accent/60"
                    />
                    <Input
                      type="text"
                      placeholder="Year (e.g., 2024)"
                      className="bg-input border-none h-12! text-base text-accent placeholder:text-accent/60"
                    />
                    <Input
                      type="text"
                      placeholder="Brief description..."
                      className="bg-input border-none h-12! text-base text-accent placeholder:text-accent/60"
                    />
                  </div>
                </div>

                {/* Continue Button */}
                <div className="pt-2">
                  <Button
                    type="submit"
                    className="w-full h-12 font-semibold bg-linear-to-b from-primary to-black/20 text-sm cursor-pointer text-accent tracking-wide shadow-md"
                  >
                    Continue <ArrowRight className="w-4 h-4 ml-2 mb-0.5" />
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
