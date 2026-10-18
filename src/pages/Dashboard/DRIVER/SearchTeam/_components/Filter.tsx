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

const Filter = ({
  onFiltersChange,
}: {
  onFiltersChange: (filters: {
    location?: string;
    discipline?: string;
    license_type_id?: number;
    min_budget?: string;
    max_budget?: string;
  }) => void;
}) => {
  const [discipline, setDiscipline] = useState("all");
  const [country, setCountry] = useState("");
  const [license, setLicense] = useState("any");
  const [budgetRange, setBudgetRange] = useState("any");

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

        {/* Country - Input (h-12) */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[#D3D3D3]">
            Country
          </p>
          <Input
            type="text"
            placeholder="All Countries"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
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

        {/* Budget - Static Range Select */}
        <div className="space-y-2">
          <p className="text-xs font-medium uppercase tracking-widest text-[#D3D3D3]">
            Budget Range (€)
          </p>
          <Select value={budgetRange} onValueChange={setBudgetRange}>
            <SelectTrigger className={fieldStyles}>
              <SelectValue placeholder="All Budgets" />
            </SelectTrigger>
            <SelectContent className="border-white/10 bg-[#1A1A1A] text-white">
              <SelectItem value="any">All Budgets</SelectItem>
              <SelectItem value="0-30000">€ 0 - 30,000</SelectItem>
              <SelectItem value="30000-100000">€ 30,000 - 100,000</SelectItem>
              <SelectItem value="100000-250000">€ 100,000 - 250,000</SelectItem>
              <SelectItem value="250000-500000">€ 250,000 - 500,000</SelectItem>
              <SelectItem value="500000+">€ 500,000+</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="mt-8 space-y-3">
        <Button
          onClick={() => {
            const budgetRangeMap: Record<
              string,
              { min_budget?: string; max_budget?: string }
            > = {
              any: {},
              "0-30000": { min_budget: "0", max_budget: "30000" },
              "30000-100000": { min_budget: "30000", max_budget: "100000" },
              "100000-250000": { min_budget: "100000", max_budget: "250000" },
              "250000-500000": { min_budget: "250000", max_budget: "500000" },
              "500000+": { min_budget: "500000" },
            };

            const selectedBudget = budgetRangeMap[budgetRange] || {};

            const filters = {
              location: country || undefined,
              discipline: discipline === "all" ? undefined : discipline,
              license_type_id:
                license === "any" ? undefined : parseInt(license),
              min_budget: selectedBudget.min_budget,
              max_budget: selectedBudget.max_budget,
            };
            onFiltersChange(filters);
          }}
          className="w-full cursor-pointer bg-linear-to-b from-primary via-primary/80 to-black/30 h-12 py-3 text-sm font-semibold text-white shadow transition hover:brightness-110"
        >
          Apply Filters
        </Button>
        <Button
          variant="ghost"
          onClick={() => {
            setDiscipline("all");
            setCountry("");
            setLicense("any");
            setBudgetRange("any");
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
