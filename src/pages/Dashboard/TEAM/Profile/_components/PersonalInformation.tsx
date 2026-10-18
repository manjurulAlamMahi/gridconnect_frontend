import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import Icon from "@/components/shared/Icon";
import UserMul from "@/assets/Icons/user_tri.svg";
import { useFormContext } from "react-hook-form";

const PersonalInformation = () => {
  const { register } = useFormContext();

  return (
    <section className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6 text-white shadow-[0_30px_80px_-45px_rgba(0,0,0,0.8)]">
      <header className="mb-6 flex items-center gap-2">
        <span className="h-5 w-5">
          <Icon src={UserMul} />
        </span>
        <p className="text-lg font-semibold">Team Information</p>
      </header>

      <div className="grid gap-5 md:grid-cols-2">
        <Field
          label="Team Name"
          placeholder="Enter team name"
          name="team_name"
          register={register}
        />
        <Field
          label="Location"
          placeholder="Select your location"
          name="location"
          register={register}
        />
        <Field
          label="Official Website"
          placeholder="Enter url"
          name="website"
          register={register}
        />
        <Field
          label="Contact Name"
          placeholder="Enter contact name"
          name="contact_name"
          register={register}
        />
        <div className="md:col-span-2">
          <label className="mb-2 block text-sm text-white/70">
            Professional Bio
          </label>
          <Textarea
            {...register("short_bio")}
            placeholder="Experienced single-seater driver with 5 years in Formula 4 and Formula 3."
            className="min-h-[110px] rounded-2xl border border-white/10 bg-black/50 text-white placeholder:text-white/40"
          />
        </div>
      </div>
    </section>
  );
};

function Field({
  label,
  placeholder,
  type = "text",
  name,
  register,
}: {
  label: string;
  placeholder: string;
  type?: string;
  name: string;
  register: any;
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm text-white/70">{label}</label>
      <Input
        type={type}
        placeholder={placeholder}
        {...register(name)}
        className="h-12 rounded-2xl border border-white/10 bg-black/50 text-white placeholder:text-white/40"
      />
    </div>
  );
}

export default PersonalInformation;
