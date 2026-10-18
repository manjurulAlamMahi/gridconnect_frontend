import { useEffect, useMemo, useState } from "react";
import ProductsCard from "./ProductsCard";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import {
  useGetMatchedOpportunitiesQuery,
  useFilterOpportunitiesQuery,
} from "@/redux/endpoints/driver/searchteam.api";

interface ProductsProps {
  searchFilters?: {
    location?: string;
    discipline?: string;
    license_type_id?: number;
    min_budget?: string;
    max_budget?: string;
  };
}

const Products = ({ searchFilters }: ProductsProps) => {
  const [currentPage, setCurrentPage] = useState(1);

  // Use filter API if filters are applied, otherwise use matched opportunities
  const hasFilters =
    searchFilters &&
    Object.values(searchFilters).some((value) => value && value !== "");

  // Correctly use hooks at the top level with 'skip' option
  const matchedQuery = useGetMatchedOpportunitiesQuery(
    { page: currentPage, per_page: 4 },
    { skip: hasFilters },
  );

  const filteredQuery = useFilterOpportunitiesQuery(
    { ...searchFilters, page: currentPage, per_page: 4 },
    { skip: !hasFilters },
  );

  // Combine query states
  const { data, isLoading, isFetching, error } = hasFilters
    ? filteredQuery
    : matchedQuery;

    
  // Reset page to 1 when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchFilters]);

  // console.log("🚀 ~ Products ~ data:", data);
  // Transform API data to match component props
  const opportunities = useMemo(() => {
    if (!data?.data?.data) return [];
    return data.data.data;
  }, [data]);

  const pagination = data?.data;

  // Derive lastPage defensively - if the backend incorrectly reports more items than exist
  const lastPage = useMemo(() => {
    if (!pagination) return 1;

    // STRICT GUARDRAIL: If we are on page 1 and the current items count is 6 or less,
    // we assume it's one page, even if the backend says total is 8.
    // This handles the specific bug where Backend reports total: 8 for 4 items.
    // if (currentPage === 1 && opportunities.length <= 6) return 1;

    // If we are on page 1 and the total reported is less than or equal to what we have, it's 1 page.
    if (currentPage === 1 && pagination.total <= opportunities.length) return 1;

    // If the backend says we have a next page but didn't give us a next_page_url, it's a lie.
    if (!pagination.next_page_url && currentPage === 1) return 1;

    // If we have fewer items than per_page, we are definitely on the last page.
    if (opportunities.length < (pagination.per_page || 4)) return currentPage;

    return pagination.last_page;
  }, [pagination, opportunities.length, currentPage]);

  const goToPage = (page: number) => {
    setCurrentPage(page);
  };

  if (isLoading) {
    return (
      <div className="col-span-2 flex flex-col gap-6 rounded-4xl">
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: 4 }).map((_, idx) => (
            <div
              key={idx}
              className="h-64 bg-white/5 rounded-lg animate-pulse"
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="col-span-2 flex flex-col gap-6 rounded-4xl">
        <div className="flex items-center justify-center h-64 text-white/60">
          Failed to load opportunities
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col gap-6 rounded-4xl relative min-h-[500px]">
      {isFetching && (
        <div className="absolute inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm rounded-4xl">
          <div className="flex items-center justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
          </div>
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2">
        {opportunities.length > 0 ? (
          opportunities.map((opportunity) => (
            <ProductsCard key={opportunity.id} opportunity={opportunity} />
          ))
        ) : (
          <div className="col-span-2 flex flex-col items-center justify-center h-96 text-center gap-6">
            <div className="relative">
              <div className="absolute inset-0 bg-primary/20 blur-2xl rounded-full animate-pulse" />
              <div className="bg-white/5 p-6 rounded-full border border-white/10 relative backdrop-blur-sm">
                <SearchX className="h-12 w-12 text-primary/80" />
              </div>
            </div>
            <div className="space-y-2 animate-in fade-in slide-in-from-bottom-4 duration-700">
              <h3 className="text-xl font-semibold text-white">
                No Opportunities Found
              </h3>
              <p className="text-white/50 max-w-[300px] mx-auto text-sm leading-relaxed">
                We couldn't find any teams matching your search criteria. Try
                adjusting your filters.
              </p>
            </div>
          </div>
        )}
      </div>

      {pagination && lastPage > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(currentPage - 1)}
            disabled={currentPage === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition ${
              currentPage === 1 ? "opacity-30" : "hover:border-primary/60"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: lastPage }).map((_, idx) => {
            const pageNumber = idx + 1;
            const isActive = pageNumber === currentPage;
            return (
              <button
                key={pageNumber}
                onClick={() => goToPage(pageNumber)}
                className={`h-10 min-w-10 rounded-xl border px-3 text-sm font-semibold transition ${
                  isActive
                    ? "border-transparent bg-primary text-white shadow-[0_10px_25px_-15px_rgba(255,81,47,0.8)]"
                    : "border-white/10 text-white/60 hover:border-primary/60 hover:text-white"
                }`}
              >
                {pageNumber}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(currentPage + 1)}
            disabled={currentPage === lastPage}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition ${
              currentPage === lastPage
                ? "opacity-30"
                : "hover:border-primary/60"
            }`}
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
};
export default Products;
