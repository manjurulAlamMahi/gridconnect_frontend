import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useFormContext, Controller } from "react-hook-form";
import LicenseTypeSelect from "@/components/shared/LicenseTypeSelect";

export default function CreateDriveForm() {
  const { register, control } = useFormContext();

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <Label className="text-white/80" htmlFor="title">
          Title *
        </Label>
        <Input
          id="title"
          placeholder='e.g. "2026 FIA F3 Seat Available"'
          className="h-12 rounded-lg border-white/10 bg-black/40 text-white placeholder:text-white/50"
          {...register("title", { required: true })}
        />
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="space-y-2">
          <Label className="text-white/80" htmlFor="license_type_id">
            License Required *
          </Label>
          <Controller
            name="license_type_id"
            control={control}
            render={({ field }) => (
              <LicenseTypeSelect
                value={field.value?.toString()}
                onChange={field.onChange}
                placeholder='e.g. "International"'
              />
            )}
          />
        </div>

        <div className="space-y-2">
          <Label className="text-white/80" htmlFor="currency">
            Currency *
          </Label>
          <select
            id="currency"
            className="h-12 w-full rounded-lg border border-white/10 bg-black/40 px-3 text-white outline-none"
            {...register("currency", { required: true })}
          >
            <option value="$">USD ($)</option>
            <option value="EUR">EUR</option>
            <option value="GBP">GBP</option>
          </select>
        </div>

        <div className="space-y-2 md:col-span-2">
          <Label className="text-white/80" htmlFor="budget">
            Budget Range *
          </Label>
          <div className="flex gap-2">
            
            <Input
              id="min_budget"
              placeholder="Min"
              className="h-12 rounded-lg border-white/10 bg-black/40 text-white placeholder:text-white/50"
              {...register("min_budget", { required: true })}
            />
            <Input
              id="max_budget"
              placeholder="Max"
              className="h-12 rounded-lg border-white/10 bg-black/40 text-white placeholder:text-white/50"
              {...register("max_budget", { required: true })}
            />
          </div>
        </div>
      </div>

      <div className="space-y-2">
        <Label className="text-white/80" htmlFor="description">
          Description
        </Label>
        <Textarea
          id="description"
          rows={4}
          placeholder="Describe the opportunity, history, and expectations."
          className="rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/50"
          {...register("description")}
        />
      </div>

      <div className="space-y-2">
        <Label className="text-white/80" htmlFor="team_support">
          Team Support Provided
        </Label>
        <Textarea
          id="team_support"
          rows={4}
          placeholder="Mention factory support, sponsorship, logistics, or technical backing offered."
          className="rounded-2xl border-white/10 bg-black/40 text-white placeholder:text-white/50"
          {...register("team_support")}
        />
      </div>
    </div>
  );
}
