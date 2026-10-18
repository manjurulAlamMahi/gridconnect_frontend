import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useGetDisciplinesQuery } from "@/redux/endpoints/disciplineApi";
import { useGetLicenceTypesQuery } from "@/redux/endpoints/Licencetype";
import { Loader2 } from "lucide-react";

const Filter = ({
  onFiltersChange,
  isLoading = false,
}: {
  onFiltersChange: (filters: {
    discipline_id?: number;
    license_type_id?: number;
    nationality?: string;
  }) => void;
  isLoading?: boolean;
}) => {
  const [discipline, setDiscipline] = useState("all");
  const [nationality, setNationality] = useState("");
  const [license, setLicense] = useState("any");

  // Fetch disciplines from centralized API
  const { data: disciplinesData } = useGetDisciplinesQuery();
  const disciplines = disciplinesData?.data || [];

  // Fetch licence types
  const { data: licenceTypesData } = useGetLicenceTypesQuery();
  const licenceTypes = licenceTypesData?.data || [];

  // Common styling for consistency: Height h-12 and dark theme colors
  const fieldStyles =
    "!h-13 w-full rounded-2xl border-white/10 bg-[#050505] px-4 text-[#9CA4AB] transition hover:border-primary focus:ring-0 focus:ring-offset-0 focus-visible:ring-0 focus-visible:ring-offset-0";

  return (
    <aside className="w-full rounded-2xl border border-white/10 bg-[#1A1A1A] p-4 md:p-6 shadow-[0_35px_80px_-40px_rgba(0,0,0,0.85)]">
      <div className="mb-6">
        <p className="text-lg font-semibold text-white">Filter Results</p>
      </div>

      <div className="space-y-6 text-sm text-white/70">
        {/* Discipline - Shadcn Select (h-12) */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[#D3D3D3]">
            Discipline
          </p>
          <Select value={discipline} onValueChange={setDiscipline}>
            <SelectTrigger className={fieldStyles}>
              <SelectValue placeholder="All Disciplines" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1A1A1A] text-white">
              <SelectItem value="all">All Disciplines</SelectItem>
              {disciplines.map((disc) => (
                <SelectItem key={disc.id} value={disc.id.toString()}>
                  {disc.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {/* Nationality - Input (h-12) */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[#D3D3D3]">
            Nationality
          </p>
          <Input
            type="text"
            placeholder="All Nationalities"
            value={nationality}
            onChange={(e) => setNationality(e.target.value)}
            className={fieldStyles}
          />
        </div>

        {/* License Required - Shadcn Select (h-12) */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[#D3D3D3]">
            License Type
          </p>
          <Select value={license} onValueChange={setLicense}>
            <SelectTrigger className={fieldStyles}>
              <SelectValue placeholder="Any License" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1A1A1A] text-white">
              <SelectItem value="any">Any License</SelectItem>
              {licenceTypes.map((licence) => (
                <SelectItem key={licence.id} value={licence.id.toString()}>
                  {licence.type}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          disabled={isLoading}
          onClick={() => {
            const filters = {
              discipline_id:
                discipline === "all" ? undefined : parseInt(discipline),
              license_type_id:
                license === "any" ? undefined : parseInt(license),
              nationality: nationality || undefined,
            };
            onFiltersChange(filters);
          }}
          className="w-full cursor-pointer bg-linear-to-b from-primary via-primary/80 to-black/30 h-12 py-3 text-sm font-semibold text-white shadow transition hover:brightness-110 disabled:opacity-70"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Filtering...
            </>
          ) : (
            "Apply Filters"
          )}
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setDiscipline("all");
            setNationality("");
            setLicense("any");
            onFiltersChange({});
          }}
          className="w-full border h-12 bg-transparent py-3 text-sm font-semibold text-white/80 transition hover:text-white hover:bg-accent/10 cursor-pointer"
        >
          Reset Filters
        </Button>
      </div>
    </aside>
  );
};

export default Filter;
