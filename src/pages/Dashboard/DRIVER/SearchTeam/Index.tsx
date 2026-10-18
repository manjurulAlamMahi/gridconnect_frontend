import { ChevronLeft, ChevronRight } from "lucide-react";
import Search from "@/assets/Icons/Icon - Search.svg";
import Icon from "@/components/shared/Icon";
import { Input } from "@/components/ui/input";
import { useState } from "react";
import Filter from "./_components/Filter";
import Products from "./_components/Products";
import { useSEO } from "@/hooks/use-seo";

const SearchTeam = () => {
  useSEO({
    title: "Search Opprtunities",
    description: "Search for racing teams and opportunities.",
  });

  const [searchFilters, setSearchFilters] = useState<{
    title?: string;
    location?: string;
    discipline?: string;
    license_type_id?: number;
  }>({
    title: "",
  });

  const handleFiltersChange = (filters: {
    location?: string;
    discipline?: string;
    license_type_id?: number;
  }) => {
    setSearchFilters((prev) => ({ ...prev, ...filters }));
  };

  const handleSearchChange = (title: string) => {
    setSearchFilters((prev) => ({ ...prev, title }));
  };
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
          <p className="text-sm font-medium">Search Opprtunities</p>
        </div>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-[22px]">
          <p className="text-accent/60 text-sm sm:text-base mt-5">
            Search best opportunities for you
          </p>
          <div className="w-full sm:w-auto sm:px-5">
            <div className="relative">
              <div className="absolute left-2 top-1/2 -translate-y-1/2 pl-4">
                <Icon src={Search} />
              </div>
              <Input
                placeholder="Search"
                value={searchFilters.title}
                onChange={(e) => handleSearchChange(e.target.value)}
                className="w-full sm:w-[250px] lg:w-[327px] bg-[#0D0D0D] text-sm placeholder:text-white/50 rounded-full pl-14 border border-primary/30 text-white"
              />
            </div>
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-[26%_1fr_1fr] gap-6">
          <Filter onFiltersChange={handleFiltersChange} />
          <Products searchFilters={searchFilters} />
        </div>
      </section>
    </div>
  );
};
export default SearchTeam;
