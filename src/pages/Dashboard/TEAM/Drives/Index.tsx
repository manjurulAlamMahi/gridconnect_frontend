import {
  ChevronLeft,
  ChevronRight,
  MoveRight,
  Plus,
  ChevronFirst,
  ChevronLast,
} from "lucide-react";
import { useMemo, useState } from "react";
import DriveCard, { type DriveOpportunity } from "./_components/DriveCard";
// import DriveRequestCard from "./_components/DriveRequestCard";
import { Link, useNavigate, useSearchParams } from "react-router";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  useGetTeamOpportunitiesQuery,
} from "@/redux/endpoints/team/team.api";
import {
  useDeleteTeamOpportunityMutation,
  useGetDriversRequestsQuery,
} from "@/redux/endpoints/team/drives.api";
import { Skeleton } from "@/components/ui/skeleton";
import type { DriverRequest } from "@/types/drive-request";
// import type { DriverRequest } from "@/types/drive-request";
import { useSEO } from "@/hooks/use-seo";

const tabs = [
  "Active Opportunities",
  // "Drive Requests",
] as const;

type TabKey = (typeof tabs)[number];

const Drives = () => {
  useSEO({
    title: "Drives",
    description: "Manage your active opportunities and driver requests.",
  });

  const [searchParams, setSearchParams] = useSearchParams();
  const tabParam = searchParams.get("tab") as TabKey | null;
  const pageParam = searchParams.get("page");
  const currentPage = pageParam ? parseInt(pageParam, 10) : 1;

  const activeTab = (
    tabParam && tabs.includes(tabParam as TabKey)
      ? tabParam
      : "Active Opportunities"
  ) as TabKey;
  const navigate = useNavigate();

  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [itemToDelete, setItemToDelete] = useState<{
    id: string;
    name: string;
  } | null>(null);
  const [deletingItemId, setDeletingItemId] = useState<string | null>(null);

  const { data: opportunitiesResponse, isLoading: opportunitiesLoading } =
    useGetTeamOpportunitiesQuery();
  const { data: driveRequestsResponse, isLoading: driveRequestsLoading } =
    useGetDriversRequestsQuery();
  const [deleteTeamOpportunity, { isLoading: isDeleting }] =
    useDeleteTeamOpportunityMutation();

  const isLoading =
    opportunitiesLoading || driveRequestsLoading;

  const handleTabChange = (tab: TabKey) => {
    setSearchParams({ tab, page: "1" }); // Reset to page 1 when changing tabs
  };

  const handlePageChange = (page: number) => {
    setSearchParams({ tab: activeTab, page: page.toString() });
  };

  const handleDeleteOpportunity = (id: string, name: string) => {
    setItemToDelete({ id, name });
    setDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!itemToDelete) return;

    setDeletingItemId(itemToDelete.id);
    try {
      await deleteTeamOpportunity(itemToDelete.id).unwrap();
      setDeleteDialogOpen(false);
      setItemToDelete(null);
    } catch (error) {
      console.error("Failed to delete opportunity:", error);
      alert("Failed to delete opportunity. Please try again.");
    } finally {
      setDeletingItemId(null);
    }
  };

  const mappedOpportunities = useMemo(() => {
    if (
      !opportunitiesResponse?.data ||
      !Array.isArray(opportunitiesResponse.data)
    )
      return [];

    return opportunitiesResponse.data.map(
      (opportunity): DriveOpportunity & { tab: TabKey } => ({
        id: opportunity.id.toString(),
        team: opportunity.title, // Using title as team name since team name isn't in the response
        location: opportunity.location || "Not specified",
        status: opportunity.status === "active" ? "Active" : "Inactive",
        license: "International", // Default value since not in API
        discipline: opportunity.disciplines.map((d) => d.name).join(", "),
        contract: opportunity.contract_duration || "Not specified",
        budget: opportunity.budget_display,
        image:
          opportunity.vehicle_image ||
          "https://images.unsplash.com/photo-1525609004556-c46c7d6cf023?w=300&auto=format&fit=crop",
        tab: "Active Opportunities", // For now, all go to Active Opportunities
      }),
    );
  }, [opportunitiesResponse?.data]);

  const mappedDriveRequests = useMemo(() => {
    if (!driveRequestsResponse?.data) return [];
    return driveRequestsResponse.data.map((item: DriverRequest) => ({
      ...item,
      tab: "Drive Requests",
    }));
  }, [driveRequestsResponse?.data]);

  const allItems = useMemo(() => {
    return [...mappedOpportunities, ...mappedDriveRequests];
  }, [mappedOpportunities, mappedDriveRequests]);

  const filteredOpportunities = useMemo(
    () => allItems.filter((item) => item.tab === activeTab),
    [allItems, activeTab],
  );

  // Pagination logic
  const itemsPerPage = 12;
  const totalItems = filteredOpportunities.length;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  // Reset to page 1 if current page is out of bounds
  const validCurrentPage =
    currentPage > totalPages || currentPage < 1 ? 1 : currentPage;

  const startIndex = (validCurrentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentItems = filteredOpportunities.slice(startIndex, endIndex);

  return (
    <section className="space-y-4">
      <div className="flex gap-4">
        <p className="flex gap-2.5">
          <span>
            <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>
          <span>
            <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>
        </p>
        <p className="text-sm font-medium">Drives</p>
      </div>

      <div className="flex flex-wrap items-center justify-between gap-6">
        <div>
          <p className="text-sm text-white/70">
            Manage your current, upcoming and past driver opportunities
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <Button
            onClick={() => navigate("/team/dashboard/drives/new")}
            className="inline-flex items-center gap-2 bg-linear-to-b from-primary to-primary/60 px-5 py-2 text-sm font-medium text-white"
          >
            <Plus className="h-4 w-4" />
            Create New Drive
          </Button>
        </div>
      </div>

      <div className="flex items-center justify-between gap-4 pb-2">
        <div className="flex gap-4 text-sm font-medium overflow-x-auto md:flex-wrap md:overflow-x-visible">
          {tabs.map((tab) => {
            const isActive = tab === activeTab;
            return (
              <button
                key={tab}
                className={`relative cursor-pointer px-4 py-2 outline-none! transition ${
                  isActive ? "text-white" : "text-white/60 hover:text-white"
                }`}
                onClick={() => handleTabChange(tab)}
              >
                {tab}
                {isActive && (
                  <span className="absolute inset-x-3 -bottom-[9px] h-px outline-none! bg-primary" />
                )}
              </button>
            );
          })}
        </div>

        {/* <div className="relative">
          <div className="pointer-events-none absolute left-0 top-1/2 -translate-y-1/2 pl-4">
            <Icon src={Search} />
          </div>
          <Input
            placeholder="Search..."
            className="w-full md:w-[260px] rounded-full h-11 border border-white/15 bg-[#120C0C] pl-12 text-sm text-white placeholder:text-white/50"
          />
        </div> */}
      </div>

      <div className="grid gap-4 lg:grid-cols-3 md:grid-cols-2 mt-6">
        {isLoading ? (
          <>
            {[...Array(12)].map((_, index) => (
              <div
                key={index}
                className="rounded-[28px] border border-white/10 bg-[#1A1A1A] p-6"
              >
                <div className="flex items-start justify-between gap-4 mb-4">
                  <div className="flex items-center gap-3">
                    <Skeleton className="h-12 w-12 rounded-2xl bg-white/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-4 w-32 bg-white/10" />
                      <Skeleton className="h-3 w-20 bg-white/10" />
                    </div>
                  </div>
                  <Skeleton className="h-6 w-16 rounded-full bg-white/10" />
                </div>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 bg-white/10" />
                    <Skeleton className="h-3 w-20 bg-white/10" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-20 bg-white/10" />
                    <Skeleton className="h-3 w-24 bg-white/10" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-18 bg-white/10" />
                    <Skeleton className="h-3 w-16 bg-white/10" />
                  </div>
                  <div className="flex justify-between">
                    <Skeleton className="h-3 w-16 bg-white/10" />
                    <Skeleton className="h-3 w-22 bg-white/10" />
                  </div>
                </div>
                <div className="mt-6 flex gap-2">
                  <Skeleton className="h-9 flex-1 rounded-lg bg-white/10" />
                  <Skeleton className="h-9 w-20 rounded-lg bg-white/10" />
                </div>
              </div>
            ))}
          </>
        ) : (
          currentItems.map((item) =>
            <DriveCard
              key={item.id}
              opportunity={item as DriveOpportunity}
              tab={activeTab}
              onDelete={
                activeTab === "Active Opportunities"
                  ? (id) => handleDeleteOpportunity(id, item.team)
                  : undefined
              }
              isDeleting={deletingItemId === item.id}
            />
          )
        )}
      </div>

      {filteredOpportunities.length === 0 && !isLoading && (
        <div className="relative overflow-hidden rounded-4xl border border-white/5 bg-linear-to-b from-[#1A1212] to-[#0C0808] p-12 text-center animate-in fade-in zoom-in-95 duration-700 min-h-[70vh] flex items-center justify-center">
          {/* Background Decorative Glows */}
          <div className="absolute -top-24 -left-24 h-64 w-64 rounded-full bg-primary/10 blur-[80px]" />
          <div className="absolute -bottom-24 -right-24 h-64 w-64 rounded-full bg-primary/5 blur-[80px]" />

          {/* Subtle Grid Overlay */}
          <div className="absolute inset-0 opacity-[0.03] mask-[radial-gradient(ellipse_at_center,black,transparent)] bg-[grid-white_20px]" />

          <div className="relative z-10 flex flex-col items-center max-w-sm">
            {/* Visual Icon Holder */}
            <div className="relative mb-8 flex h-24 w-24 items-center justify-center rounded-3xl border border-white/10 bg-white/2 backdrop-blur-sm">
              <div className="absolute inset-0 rounded-3xl bg-linear-to-br from-primary/20 to-transparent opacity-50" />
              <div className="relative h-12 w-12 text-white/20">
                {/* Replace with your specific icon (e.g. Car, Database, Inbox) */}
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="h-full w-full rotate-90"
                >
                  <circle cx="12" cy="12" r="10" />
                  <path d="M16 12h-4m-4 0h.01" />
                </svg>
              </div>
              {/* Animated Rings around icon */}
              <div className="absolute h-full w-full animate-[ping_3s_infinite] rounded-3xl border border-primary/20 opacity-30" />
            </div>

            {/* Main Text Content */}
            <h3 className="text-2xl font-bold text-white tracking-tight">
              No{" "}
              <span className="bg-linear-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                {activeTab}
              </span>{" "}
              Found
            </h3>

            <p className="mt-3 text-base text-white/50 leading-relaxed">
              We couldn't find any opportunities here. Try adjusting your
              filters or creating a new entry to get started.
            </p>

            {/* CTA Button */}

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <Link to="/team/dashboard/drives/new">
                <button className="group relative flex h-11 items-center justify-center gap-2 overflow-hidden rounded-full bg-primary px-8 py-2 text-sm font-semibold text-white transition-all hover:bg-primary/90 cursor-pointer active:scale-95">
                  Create New Drive
                </button>
              </Link>
              <Link to="/team/dashboard/search-driver">
                <button className="group flex h-11 items-center justify-center gap-2 rounded-full border border-white/10 bg-white/5 px-6 py-2 text-sm font-medium text-white transition-all hover:bg-white/10 hover:border-white/20 active:scale-95 cursor-pointer">
                  Search All
                  <MoveRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                </button>
              </Link>
            </div>
          </div>

          {/* Racing line accent at bottom */}
          <div className="absolute bottom-0 h-0.5 w-full bg-linear-to-r from-transparent via-primary/40 to-transparent" />
        </div>
      )}

      {filteredOpportunities.length > 0 && totalPages > 1 && (
        <div className="flex flex-col items-center gap-4 mt-8">
          <div className="text-sm text-white/60">
            Showing {startIndex + 1}-{Math.min(endIndex, totalItems)} of{" "}
            {totalItems} entries
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(1)}
              disabled={validCurrentPage === 1}
              className="border-white/20 text-white/60 hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronFirst className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(validCurrentPage - 1)}
              disabled={validCurrentPage === 1}
              className="border-white/20 text-white/60 hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>

            <div className="flex items-center gap-1">
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                const pageNumber =
                  Math.max(1, Math.min(totalPages - 4, validCurrentPage - 2)) +
                  i;
                if (pageNumber > totalPages) return null;

                return (
                  <Button
                    key={pageNumber}
                    variant={
                      pageNumber === validCurrentPage ? "default" : "outline"
                    }
                    size="sm"
                    onClick={() => handlePageChange(pageNumber)}
                    className={
                      pageNumber === validCurrentPage
                        ? "bg-primary text-white"
                        : "border-white/20 text-white/60 hover:bg-white/5"
                    }
                  >
                    {pageNumber}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(validCurrentPage + 1)}
              disabled={validCurrentPage === totalPages}
              className="border-white/20 text-white/60 hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handlePageChange(totalPages)}
              disabled={validCurrentPage === totalPages}
              className="border-white/20 text-white/60 hover:bg-white/5 disabled:opacity-50"
            >
              <ChevronLast className="h-4 w-4" />
            </Button>
          </div>
        </div>
      )}

      <AlertDialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <AlertDialogContent className="bg-[#1A1A1A] border-white/10">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete Opportunity
            </AlertDialogTitle>
            <AlertDialogDescription className="text-white/70">
              Are you sure you want to delete "{itemToDelete?.name}"? This
              action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="border-white/20 text-white hover:bg-white/5">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmDelete}
              disabled={isDeleting}
              className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </section>
  );
};

export default Drives;
