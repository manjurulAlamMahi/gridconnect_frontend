import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/shared/Icon";
import UserIcon from "@/assets/Icons/user_icon.svg";
import type { DriverUser } from "@/types/driver";

interface PersonalInformationProps {
  data: DriverUser;
}

const PersonalInformation = ({ data }: PersonalInformationProps) => {
  return (
    <section className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6 text-white shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
      <header className="mb-6 flex items-center gap-2">
        <span className="rounded-full border border-white/15 p-1 text-xs text-white">
          <Icon src={UserIcon} />
        </span>
        <p className="text-lg font-semibold">Personal Information</p>
      </header>
      <div className="grid gap-5 md:grid-cols-2">
        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/70">Full Name</label>
          <Input
            name="name"
            defaultValue={data.name}
            placeholder="Enter your full name"
            className="rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2">
          <label className="text-sm text-white/70">Date of Birth</label>
          <Input
            name="date_of_birth"
            defaultValue={data.date_of_birth}
            type="date"
            placeholder="mm/dd/yyyy"
            className="rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
          />
        </div>
        <div className="space-y-2">
          <label className="text-sm text-white/70">Nationality</label>
          <Input
            name="nationality"
            defaultValue={data?.nationality ?? ""}
            placeholder="Enter your nationality"
            className="rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
          />
        </div>

        <div className="space-y-2 md:col-span-2">
          <label className="text-sm text-white/70">Professional Bio</label>
          <Textarea
            name="bio"
            defaultValue={data.bio || ""}
            placeholder="Share your experience, goals, and achievements..."
            className="min-h-[120px] rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/40"
          />
        </div>
      </div>
    </section>
  );
};
export default PersonalInformation;
