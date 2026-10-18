import { Label } from "@/components/ui/label";
import { useGetDisciplinesQuery } from "@/redux/endpoints/disciplineApi";
import { Skeleton } from "@/components/ui/skeleton";

export default function PreferredDisciplinesSelect({
  selectedDisciplines,
  onChange,
}: {
  selectedDisciplines: number[];
  onChange: (id: number) => void;
}) {
  const { data, isLoading } = useGetDisciplinesQuery();
  const disciplines = data?.data || [];

  return (
    <div className="flex flex-col gap-2">
      <Label className="text-[#D3D3D3] font-semibold">
        Preferred Disciplines <span className="text-primary">*</span>
      </Label>
      <span className="text-[13px] text-accent/60 mb-2">
        (Select all that apply)
      </span>
      <div className="flex flex-wrap gap-2">
        {isLoading
          ? Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-9 w-24 rounded-[12px] bg-input" />
            ))
          : disciplines.map((d) => (
              <button
                type="button"
                key={d.id}
                onClick={() => onChange(d.id)}
                className={`px-4 py-[5px] rounded-full text-sm border transition font-medium ${
                  selectedDisciplines.includes(d.id)
                    ? "bg-primary text-black border-primary"
                    : "bg-input text-accent/80 border-accent/14 hover:bg-accent/10 hover:text-accent"
                }`}
              >
                {d.name}
              </button>
            ))}
      </div>
    </div>
  );
}
