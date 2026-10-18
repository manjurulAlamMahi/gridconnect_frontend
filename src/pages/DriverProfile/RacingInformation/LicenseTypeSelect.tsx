import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Info } from "lucide-react";
import { useGetLicenceTypesQuery } from "@/redux/endpoints/Licencetype";
import { Skeleton } from "@/components/ui/skeleton";

export default function LicenseTypeSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (val: string) => void;
}) {
  const { data, isLoading, error } = useGetLicenceTypesQuery();
  const licenceTypes = data?.data || [];

  return (
    <div className="flex flex-col gap-2">
      <div className="flex gap-1 items-center">
        <Label htmlFor="license-type" className="text-[#D3D3D3] font-semibold">
          License Type <span className="text-primary">*</span>
        </Label>
        <Info className="w-4 h-4 text-accent/60" />
      </div>
      {isLoading ? (
        <Skeleton className="h-12 w-full rounded-[12px] bg-input" />
      ) : error ? (
        <div className="text-red-500">Error loading license types</div>
      ) : licenceTypes.length === 0 ? (
        <div className="text-accent/60">No license types available</div>
      ) : (
        <Select value={value} onValueChange={onChange}>
          <SelectTrigger className="bg-input border-none rounded-[12px] text-base text-accent h-12! w-full">
            <SelectValue placeholder="Select license type" />
          </SelectTrigger>
          <SelectContent>
            {licenceTypes.map((licence) => (
              <SelectItem key={licence.id} value={licence.id.toString()}>
                {licence?.type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      )}
    </div>
  );
}
