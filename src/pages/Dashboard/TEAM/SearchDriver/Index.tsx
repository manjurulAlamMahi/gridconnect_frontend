import { ChevronLeft, ChevronRight } from "lucide-react";
import Search from "@/assets/Icons/Icon - Search.svg";
import Icon from "@/components/shared/Icon";
import { Input } from "@/components/ui/input";
import { useState, useEffect } from "react";
import Filter from "./_components/Filter";
import Products from "./_components/Products";
import { useSearchDriversQuery } from "@/redux/endpoints/team/team.api";
import { useSEO } from "@/hooks/use-seo";

const SearchDriver = () => {
  useSEO({
    title: "Search Drivers",
    description: "Find the best racing drivers for your team.",
  });

  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
  const [filters, setFilters] = useState<{
    discipline_id?: number;
    license_type_id?: number;
    nationality?: string;
  }>({});

  // Debounce search term - wait 500ms after user stops typing
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchTerm);
    }, 500);

    return () => clearTimeout(timer);
  }, [searchTerm]);

  const { data, isLoading, isFetching } = useSearchDriversQuery({
    search: debouncedSearch || undefined,
    ...filters,
  });
  console.log("🚀 ~ SearchDriver ~ data:", data)

  return (
    <div>
      <section>
        <div className="flex gap-4">
          <p className="flex gap-2.5">
            <span>
              <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
            </span>{" "}
            <span>
              {" "}
              <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
            </span>
          </p>
          <p className="text-sm font-medium">Search Drivers</p>
        </div>
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-[22px] gap-4">
          <p className="text-accent/60 text-base">
            Search best drivers for you
          </p>
          <div className="px-5 md:px-0">
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pl-4">
                <Icon src={Search} />
              </div>
              <Input
                placeholder="Search by name"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full md:w-[327px] bg-[#0D0D0D] text-sm placeholder:text-white/50 rounded-full pl-14 border border-primary/30 text-white"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[26%_1fr_1fr] gap-6 mb-24 md:mb-0">
          <Filter onFiltersChange={setFilters} isLoading={isFetching} />
          <Products
            drivers={data?.data?.data || []}
            isLoading={isLoading || isFetching}
          />
        </div>
      </section>
    </div>
  );
};
export default SearchDriver;
