import AppSidebarDesign from "@/components/AppSidebar";
import { SidebarInset, SidebarProvider } from "@/components/ui/sidebar";
import { Outlet, ScrollRestoration } from "react-router";
import type { TUserRole } from "@/redux/slices/authSlice";
import useSessionTimeout from "@/hooks/useSessionTimeout";
import { TeamProfileProvider } from "@/providers/TeamProfileProvider";
import { DriverProfileProvider } from "@/providers/DriverProfileProvider";

type DashboardLayoutProps = {
  role?: TUserRole;
};

export default function DashboardLayout({
  role = "driver",
}: DashboardLayoutProps) {
  useSessionTimeout();

  const content = (
    <div className="[--header-height:calc(--spacing(14))] min-h-screen w-full overflow-x-hidden md:my-6">
      <ScrollRestoration />
      <SidebarProvider className="flex h-full w-full min-h-0">
        <div className="flex h-full w-full min-h-0 min-w-0">
          <div className="h-full shrink-0">
            <AppSidebarDesign role={role} />
          </div>
          <div className="mt-16 m-0 flex h-full min-h-0 min-w-0 flex-1 flex-col md:m-6 md:mt-0">
            <SidebarInset
              className="container mx-auto mb-0 flex min-h-0 min-w-0 flex-1 rounded-t-2xl p-5 pt-6 pb-5 md:overflow-auto md:border md:border-primary/30 md:bg-[#1A1616]"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              <style>{`::-webkit-scrollbar { display: none; }`}</style>
              <Outlet context={{ role }} />
            </SidebarInset>
          </div>
        </div>
      </SidebarProvider>
    </div>
  );

  if (role === "team") {
    return <TeamProfileProvider>{content}</TeamProfileProvider>;
  }

  if (role === "driver") {
    return <DriverProfileProvider>{content}</DriverProfileProvider>;
  }

  return content;
}
