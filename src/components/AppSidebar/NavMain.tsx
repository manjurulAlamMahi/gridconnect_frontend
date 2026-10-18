import { SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";
import { NavLink, useLocation } from "react-router";
import type { TNavMenu } from ".";

export default function NavMain({
  item,
  state,
  isMobile,
}: {
  item: TNavMenu;
  state: "expanded" | "collapsed";
  isMobile: boolean;
}) {
  const location = useLocation();

  // Custom active logic for candidates - active for both candidates and add-candidate pages
  // Custom active logic for open role - active for both open-role and job-posting pages
  const isActive =
    item.title === "Candidates"
      ? location.pathname.includes("candidate")
      : item.title === "Open Role"
      ? location.pathname.includes("open-role") ||
        location.pathname.includes("job-posting")
      : location.pathname === item.url ||
        (!item.end && location.pathname.startsWith(item.url));

  return (
    <SidebarMenuItem>
      <NavLink
        to={item.url}
        end={item.end}
        className={({ isActive: navIsActive }) =>
          `w-full group/item ${navIsActive ? "text-primary" : "text-[#797979]"}`
        }
      >
        {() => (
          <SidebarMenuButton
            tooltip={item.title}
            className={cn(
              "w-full text-foreground hover:bg-secondary/30 relative",
              isActive
                ? "text-primary bg-secondary/40 py-2 rounded-sm"
                : "text-foreground"
            )}
          >
            {isActive && (
              <div className="absolute left-0 top-2 bottom-2 w-1 bg-linear-to-l from-black to-red-300 rounded-r" />
            )}
            <span
              className={cn(
                "size-8 rounded-full text-xl flex items-center justify-center "
              )}
            >
              {item.icon}
            </span>
            <div
              className={
                state === "collapsed" && !isMobile ? "hidden" : "w-full block "
              }
            >
              <h4 className={cn("text-nowrap duration-300 text-base ")}>
                {item.title}
              </h4>
              <div
                className={cn(
                  "w-full origin-left duration-500 scale-0 ",
                  isActive ? "" : ""
                )}
              />
            </div>
          </SidebarMenuButton>
        )}
      </NavLink>
    </SidebarMenuItem>
  );
}
