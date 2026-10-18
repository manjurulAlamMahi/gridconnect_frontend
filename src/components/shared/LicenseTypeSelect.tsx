import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { useGetLicenceTypesQuery } from "@/redux/endpoints/Licencetype";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

interface LicenseTypeSelectProps {
    value?: string;
    onChange: (value: string) => void;
    className?: string;
    triggerClassName?: string;
    placeholder?: string;
}

export default function LicenseTypeSelect({
    value,
    onChange,
    className,
    triggerClassName,
    placeholder = "Select license type",
}: LicenseTypeSelectProps) {
    const { data, isLoading, error } = useGetLicenceTypesQuery();
    const licenceTypes = data?.data || [];

    if (isLoading) {
        return <Skeleton className={cn("h-12 w-full rounded-lg", className)} />;
    }

    if (error) {
        return <div className="text-red-500 text-xs">Error loading license types</div>;
    }

    return (
        <Select value={value} onValueChange={onChange}>
            <SelectTrigger
                className={cn(
                    "h-12! rounded-lg border-white/10  text-white placeholder:text-white/50 w-full",
                    triggerClassName
                )}
            >
                <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
                {licenceTypes.map((license) => (
                    <SelectItem key={license.id} value={license.id.toString()}>
                        {license.type}
                    </SelectItem>
                ))}
            </SelectContent>
        </Select>
    );
}
