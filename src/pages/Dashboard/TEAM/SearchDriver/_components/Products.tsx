import { useMemo, useState } from "react";
import ProductsCard from "./ProductsCard";
import { ChevronLeft, ChevronRight, SearchX } from "lucide-react";
import type { SearchedDriver } from "@/types/driver";

type ProductsProps = {
  drivers: SearchedDriver[];
  isLoading: boolean;
};

const PAGE_SIZE = 4;

const Products = ({ drivers, isLoading }: ProductsProps) => {
  const [page, setPage] = useState(1);
  const totalPages = Math.ceil(drivers.length / PAGE_SIZE);

  const visibleDrivers = useMemo(() => {
    const start = (page - 1) * PAGE_SIZE;
    return drivers.slice(start, start + PAGE_SIZE);
  }, [page, drivers]);

  const goToPage = (index: number) => {
    setPage(Math.min(Math.max(index, 1), totalPages));
  };

  if (isLoading) {
    return (
      <div className="col-span-2 flex flex-col gap-6 rounded-4xl">
        <div className="grid gap-5 md:grid-cols-2">
          {Array.from({ length: PAGE_SIZE }).map((_, idx) => (
            <div
              key={idx}
              className="flex flex-col gap-4 p-[25px] rounded-[12px] border border-white/10 bg-[#1A1A1A]"
            >
              {/* Header with avatar and name */}
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-2xl bg-white/10 animate-pulse" />
                <div className="flex-1 space-y-2">
                  <div className="h-5 w-32 rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-20 rounded bg-white/10 animate-pulse" />
                </div>
              </div>

              {/* Info rows */}
              <div className="space-y-2.5">
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-24 rounded bg-white/10 animate-pulse" />
                </div>
                <div className="flex items-center gap-2">
                  <div className="h-4 w-4 rounded bg-white/10 animate-pulse" />
                  <div className="h-4 w-28 rounded bg-white/10 animate-pulse" />
                </div>
                <div className="flex items-start gap-2">
                  <div className="h-4 w-4 rounded bg-white/10 animate-pulse mt-1" />
                  <div className="flex-1 space-y-1">
                    <div className="h-4 w-full rounded bg-white/10 animate-pulse" />
                    <div className="h-4 w-3/4 rounded bg-white/10 animate-pulse" />
                  </div>
                </div>
              </div>

              {/* Footer buttons */}
              <div className="border-t border-white/10 pt-4">
                <div className="flex gap-3">
                  <div className="h-10 flex-1 rounded-lg bg-white/10 animate-pulse" />
                  <div className="h-10 flex-1 rounded-lg bg-white/10 animate-pulse" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="col-span-2 flex flex-col gap-6 rounded-4xl">
      <div className="grid gap-5 md:grid-cols-2">
        {visibleDrivers.length > 0 ? (
          visibleDrivers.map((driver) => (
            <ProductsCard
              key={driver.id}
              name={driver.name}
              country={driver.nationality}
              discipline={driver.disciplines.map((d) => d.name).join(", ")}
              license={driver.license_type.type}
              budget=""
              description={driver.bio || "No bio available"}
              logo={driver.image}
              cv={driver.cv}
              verified={false}
              isDriver={true}
              driver={driver}
            />
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
                No Drivers Found
              </h3>
              <p className="text-white/50 max-w-[300px] mx-auto text-sm leading-relaxed">
                We couldn't find any drivers matching your search criteria. Try
                adjusting your filters.
              </p>
            </div>
          </div>
        )}
      </div>

      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-center gap-2">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page === 1}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition ${
              page === 1 ? "opacity-30" : "hover:border-primary/60"
            }`}
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          {Array.from({ length: totalPages }).map((_, idx) => {
            const pageNumber = idx + 1;
            const isActive = pageNumber === page;
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
            onClick={() => goToPage(page + 1)}
            disabled={page === totalPages}
            className={`flex h-10 w-10 items-center justify-center rounded-xl border border-white/10 text-white transition ${
              page === totalPages ? "opacity-30" : "hover:border-primary/60"
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
