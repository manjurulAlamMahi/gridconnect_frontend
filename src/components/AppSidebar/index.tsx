import * as React from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useIsMobile } from "@/hooks/use-mobile";
import { useNavigate, useLocation } from "react-router";
import Search from "@/assets/Icons/search_white.svg";
import Home from "@/assets/Icons/Home.svg";
import User from "@/assets/Icons/user_dash.svg";
import Messages from "@/assets/Icons/message_dash.svg";
import SubscriptionIcon from "@/assets/Icons/touch.svg";
import AccountIcon from "@/assets/Icons/settings.svg";
import SteeringIcon from "@/assets/Icons/StearingIcons.svg";
import Facebook from "@/assets/Icons/Facebook Icon.svg";
import Blog from "@/assets/Icons/Blogger Icon.svg";
import Messenger from "@/assets/Icons/Messenger Icon.svg";
import Youtube from "@/assets/Icons/Youtube Icon.svg";
import Whatsapp from "@/assets/Icons/Whatsapp Icon.svg";
import Instagram from "@/assets/Icons/instagram.svg";
import Twitter from "@/assets/Icons/X.svg";
import Icon from "../shared/Icon";
import Logo from "../shared/Logo";
import LogoIcon from "@/assets/Icons/Logo.svg";
import Profile from "./Profile";
import type { TUserRole } from "@/redux/slices/authSlice";
import { removeUserInfo } from "@/redux/slices/authSlice";
import { useAppDispatch } from "@/redux/hooks";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Globe, LogOut, Menu } from "lucide-react";
import { useGetSocialMediaQuery } from "@/redux/endpoints/home/home.api";

const socialIcons: Record<string, string> = {
  Facebook: Facebook,
  Instagram: Instagram,
  Twitter: Twitter,
  LinkedIn: "", // no icon, will use text
  Blogger: Blog,
  Messenger: Messenger,
  Youtube: Youtube,
  Whatsapp: Whatsapp,
};

export type TNavMenu = {
  title: string;
  url: string;
  icon: React.ReactNode;
  end?: boolean;
};

type AppSidebarProps = {
  role?: TUserRole;
};

export default function AppSidebarDesign({ role = "driver" }: AppSidebarProps) {
  const { state } = useSidebar();
  const isMobile = useIsMobile();
  const navigate = useNavigate();
  const location = useLocation();
  const { data: socialMediaResponse } = useGetSocialMediaQuery();

  const dispatch = useAppDispatch();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = React.useState(false);
  const baseDashboardPath = `/${role}/dashboard`;
  const searchTitle = role === "team" ? "Search Driver" : "Search Opprtunities";
  const isCollapsedState = state === "collapsed";
  const showCollapsedUI = !isMobile && isCollapsedState;

  const getMenuButtonClasses = (url: string) => {
    const isActive = location.pathname === url;

    return cn(
      "flex items-center py-2.5 md:py-3 rounded-lg text-white/90 cursor-pointer transition-colors duration-150",
      showCollapsedUI ? "justify-center px-0" : "gap-3 px-2 md:px-3",
      isActive
        ? showCollapsedUI
          ? "bg-primary text-white border border-primary h-10 shadow-md"
          : "bg-linear-to-r from-[#0D0D0D] to-primary border h-10 shadow-md"
        : "hover:bg-white/5",
    );
  };

  const menu = [
    {
      title: "Home",
      url: baseDashboardPath,
      icon: <Icon src={Home} />,
    },
    {
      title: "Profile",
      url: `${baseDashboardPath}/profile`,
      icon: <Icon src={User} />,
    },
    {
      title: "Messages",
      url: `${baseDashboardPath}/message`,
      icon: <Icon src={Messages} />,
    },
    ...(role === "team"
      ? [
          {
            title: "Drives",
            url: `${baseDashboardPath}/drives`,
            icon: <Icon src={SteeringIcon} />,
          },
        ]
      : []),
    {
      title: searchTitle,
      url: `${baseDashboardPath}/${
        role === "team" ? "search-driver" : "search-team"
      }`,
      icon: <Icon src={Search} />,
    },
  ];

  const bottomMenu = [
    {
      title: "Subscription",
      url: `${baseDashboardPath}/subscription`,
      icon: <Icon src={SubscriptionIcon} />,
    },
    {
      title: "Account Control",
      url: `${baseDashboardPath}/account`,
      icon: <Icon src={AccountIcon} />,
    },
  ];

  const mobileSheetItems = [...menu, ...bottomMenu];

  return (
    <>
      {/* Mobile Top Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 z-50 bg-[#0D0D0D] border-b border-white/10 flex items-center justify-between h-16 px-4 shadow-sm">
        <button
          type="button"
          onClick={() => navigate("/")}
          className="cursor-pointer"
          aria-label="Go to home"
        >
          <Logo />
        </button>
        <Button
          variant="ghost"
          size="icon"
          className="text-white/90 hover:text-primary hover:bg-white/5"
          onClick={() => setIsMobileMenuOpen(true)}
          aria-label="Open menu"
        >
          <Menu className="w-5 h-5" />
        </Button>

        <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
          <SheetContent
            side="right"
            className="w-[85vw] max-w-xs border-l border-white/10 bg-[#0D0D0D] text-white p-0"
          >
            <SheetHeader className="border-b border-white/10 px-4 py-4">
              <SheetTitle className="text-white">Menu</SheetTitle>
              <SheetDescription className="text-white/60">
                Navigate your dashboard
              </SheetDescription>
            </SheetHeader>

            <div className="flex flex-col gap-1 p-3">
              {mobileSheetItems.map((m) => {
                const isActive = location.pathname === m.url;

                return (
                  <Button
                    key={m.title}
                    variant="ghost"
                    className={cn(
                      "h-11 w-full justify-start gap-3 rounded-lg px-3 text-white hover:bg-white/10",
                      isActive &&
                        "bg-primary/20 text-primary hover:bg-primary/25",
                    )}
                    onClick={() => {
                      navigate(m.url);
                      setIsMobileMenuOpen(false);
                    }}
                  >
                    <span className="flex h-5 w-5 items-center justify-center [&_svg]:h-4 [&_svg]:w-4">
                      {m.icon}
                    </span>
                    <span className="text-sm">{m.title}</span>
                  </Button>
                );
              })}
            </div>

            <div className="mt-auto border-t border-white/10 p-3">
              <Button
                variant="ghost"
                className="h-11 w-full justify-start gap-3 rounded-lg px-3 text-white hover:bg-white hover:text-primary"
                onClick={() => {
                  dispatch(removeUserInfo());
                  navigate("/join/signin");
                  setIsMobileMenuOpen(false);
                }}
              >
                <LogOut className="h-4 w-4" />
                <span className="text-sm">Logout</span>
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <div className="relative hidden md:flex flex-col h-full md:h-screen">
        <Sidebar
          collapsible="icon"
          className="flex-1 flex flex-col border-none!"
        >
          {/* collapse toggle for desktop only */}
          {!isMobile && (
            <SidebarTrigger
              className={cn(
                "absolute right-8 z-50 size-8 text-white hover:text-white rounded-sm shrink-0 transition-all duration-200 border bg-dark/80 hover:bg-dark/90",
                showCollapsedUI
                  ? "border border-gray-700 shadow top-3"
                  : "top-6",
              )}
              style={{
                right: showCollapsedUI ? "-28px" : "20px",
                boxShadow: showCollapsedUI
                  ? "0 2px 8px rgba(0,0,0,0.08)"
                  : undefined,
              }}
            />
          )}

          <SidebarContent
            className={cn(
              "flex-1 border-none! overflow-y-auto no-scrollbar border-r bg-transparent",
              // padding responsive
              state === "collapsed" && !isMobile
                ? "px-2 py-4"
                : "px-3 md:px-4 py-4 md:py-6",
            )}
          >
            <SidebarMenu>
              <div
                className={cn(
                  "mb-3 md:mb-4",
                  showCollapsedUI ? "flex justify-center" : "",
                )}
              >
                <button
                  type="button"
                  onClick={() => navigate("/")}
                  className="cursor-pointer"
                  aria-label="Go to home"
                >
                  {showCollapsedUI ? (
                    <img
                      src={LogoIcon}
                      alt="GridConnect logo icon"
                      className="h-8 w-8"
                    />
                  ) : (
                    <Logo />
                  )}
                </button>
              </div>

              {/* profile card – same design, just width control */}
              <Profile role={role} isCollapsed={showCollapsedUI} />

              {/* Main menu */}
              <div className="mt-4 md:mt-6">
                <div className="space-y-2 md:space-y-3 px-0 md:px-1">
                  {menu.map((m) => (
                    <SidebarMenuItem key={m.title}>
                      <SidebarMenuButton
                        className={getMenuButtonClasses(m.url)}
                        onClick={() => navigate(m.url)}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-5 h-5 md:w-6 md:h-6 shrink-0",
                            showCollapsedUI && "mx-auto",
                          )}
                        >
                          {m.icon}
                        </div>
                        {!showCollapsedUI && (
                          <span className="text-xs md:text-sm truncate">
                            {m.title}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              </div>

              {/* Separator dotted */}
              <div className="mt-4 md:mt-5 border-t border-dashed border-white/10 mx-2 md:mx-4" />

              {/* Bottom menu */}
              <div className="mt-3 md:mt-4 px-0 md:px-1">
                <div className="space-y-2">
                  {bottomMenu.map((m) => (
                    <SidebarMenuItem key={m.title}>
                      <SidebarMenuButton
                        className={getMenuButtonClasses(m.url)}
                        onClick={() => navigate(m.url)}
                      >
                        <div
                          className={cn(
                            "flex items-center justify-center w-5 h-5 md:w-6 md:h-6 shrink-0",
                            showCollapsedUI && "mx-auto",
                          )}
                        >
                          {m.icon}
                        </div>
                        {!showCollapsedUI && (
                          <span className="text-xs md:text-sm truncate">
                            {m.title}
                          </span>
                        )}
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  ))}
                </div>
              </div>

              {/* Footer links + social */}
              <div className="mt-5 md:mt-6 px-2 md:px-3 pb-4 md:pb-2 z-10">
                {!showCollapsedUI && (
                  <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] md:text-xs text-white/60 mb-3">
                    <div>Terms</div>
                    <div>Help &amp; Support</div>
                  </div>
                )}

                <div
                  className={cn(
                    "flex items-center",
                    showCollapsedUI ? "justify-center" : "justify-start",
                  )}
                >
                  {showCollapsedUI ? (
                    <Popover>
                      <PopoverTrigger asChild>
                        <Button
                          size="sm"
                          className="h-10 w-10 p-0 hover:bg-white/10 text-white/60 hover:text-white"
                        >
                          <Globe className="h-6 w-6" />
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent
                        className="w-64 p-3 bg-[#1A1A1A] border border-white/10"
                        side="top"
                        align="start"
                      >
                        <div className="space-y-2">
                          <p className="text-sm font-medium text-white mb-3">
                            Follow Us
                          </p>
                          <div className="grid grid-cols-4 gap-2">
                            {socialMediaResponse?.data?.map((social) => {
                              const iconSrc = socialIcons[social.name];
                              return (
                                <a
                                  key={social.id}
                                  href={social.url}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="flex items-center justify-center p-2 rounded-md hover:bg-white/10 transition-colors"
                                  title={social.name}
                                >
                                  {social.image || iconSrc ? (
                                    <img
                                      src={social.image || iconSrc}
                                      alt={social.name}
                                      className="h-5 w-5"
                                    />
                                  ) : (
                                    <Globe className="h-5 w-5 text-white/60" />
                                  )}
                                </a>
                              );
                            })}
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  ) : (
                    <div className="flex items-center gap-2 md:gap-3">
                      {socialMediaResponse?.data?.map((social) => {
                        const iconSrc = socialIcons[social.name];
                        return (
                          <a
                            key={social.id}
                            href={social.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="hover:opacity-100 transition-opacity"
                          >
                            {social.image || iconSrc ? (
                              <img
                                src={social.image || iconSrc}
                                alt={social.name}
                                className="h-4 w-4 md:h-5 md:w-5 opacity-90"
                              />
                            ) : (
                              <span>
                                <Globe className="h-4 w-4 md:h-5 md:w-5 opacity-90" />
                              </span>
                            )}
                          </a>
                        );
                      })}
                    </div>
                  )}
                </div>
              </div>
            </SidebarMenu>
          </SidebarContent>

          {/* Logout - pinned to bottom */}
          <SidebarFooter
            className={cn(
              "border-t border-white/10 z-10",
              state === "collapsed" && !isMobile
                ? "px-2 py-3"
                : "px-3 md:px-4 py-3",
            )}
          >
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className={cn(
                    "flex items-center py-2.5 md:py-3 rounded-lg text-white/90 cursor-pointer transition-colors duration-150 hover:bg-white hover:text-primary",
                    showCollapsedUI
                      ? "justify-center px-0"
                      : "gap-3 px-2 md:px-3",
                  )}
                  onClick={() => {
                    dispatch(removeUserInfo());
                    navigate("/join/signin");
                  }}
                >
                  <div
                    className={cn(
                      "flex items-center justify-center w-5 h-5 md:w-6 md:h-6 shrink-0",
                      showCollapsedUI && "mx-auto",
                    )}
                  >
                    <LogOut className="w-5 h-5" />
                  </div>
                  {!showCollapsedUI && (
                    <span className="text-xs md:text-sm truncate">Logout</span>
                  )}
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarFooter>

          <span
            aria-hidden
            className="
              pointer-events-none
              absolute
              hidden md:block
              h-80 w-80
              -left-24 -bottom-24
              rounded-full
              bg-primary
              blur-3xl
              opacity-40
              z-1 
            "
          />
        </Sidebar>
      </div>
    </>
  );
}
