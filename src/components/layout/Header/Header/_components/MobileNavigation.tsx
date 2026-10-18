import { Link, NavLink, useNavigate } from "react-router";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { LogOut, Menu } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/slices/authSlice";
import { useGetProfileQuery } from "@/redux/endpoints/driver/driver.api";
import { useGetTeamProfileQuery } from "@/redux/endpoints/team/team.api";

const menuItems = [
  { name: "Home", link: "/" },
  { name: "How It Works", link: "/#how-it-works" },
  { name: "Features", link: "/#features" },
  { name: "Pricing", link: "/#pricing" },
  { name: "Contact", link: "/#contact" },
];

export default function MobileNavigation() {
  const { isAuthenticated, user } = useAuth();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  // Fetch profile data to get image
  const isDriver = user?.role === "driver";
  const isTeam = user?.role === "team";

  const { data: driverProfileData } = useGetProfileQuery(undefined, {
    skip: !isAuthenticated || !isDriver,
  });

  const { data: teamProfileData } = useGetTeamProfileQuery(undefined, {
    skip: !isAuthenticated || !isTeam,
  });

  // Get image from profile API
  const userImage = isDriver
    ? driverProfileData?.data?.user?.image
    : teamProfileData?.data?.team?.team_logo;

  // Get display name - team_name for team, firstName for driver
  const displayName = isTeam
    ? teamProfileData?.data?.team?.team_name || user?.firstName
    : user?.firstName;

  const dashboardPath =
    user?.role === "team"
      ? "/team/dashboard"
      : user?.role === "driver"
        ? "/driver/dashboard"
        : "/dashboard";

  const userInitials = (() => {
    const names = [user?.firstName, user?.lastName].filter(
      (name): name is string => Boolean(name),
    );

    if (names.length) {
      return names.map((name) => name.charAt(0).toUpperCase()).join("");
    }

    const emailInitials = user?.email?.slice(0, 2)?.toUpperCase();
    return emailInitials || "U";
  })();

  const handleLogout = () => {
    dispatch(removeUserInfo());
    navigate("/join/signin");
  };

  return (
    <Sheet>
      {/* hamburger trigger */}
      <SheetTrigger asChild>
        <Menu />
      </SheetTrigger>

      <SheetContent className="h-full p-6 border-l border">
        <nav className="mt-8">
          <ul className="flex flex-col gap-6">
            {menuItems.map((item) => (
              <li key={item.link}>
                <SheetClose asChild>
                  <NavLink
                    to={item.link}
                    className={({ isActive }: { isActive: boolean }) =>
                      `block text-lg font-medium ${
                        isActive
                          ? "text-accent"
                          : "text-accent-foreground hover:text-secondary"
                      }`
                    }
                  >
                    {item.name}
                  </NavLink>
                </SheetClose>
              </li>
            ))}
          </ul>
        </nav>

        <div className="mt-auto flex flex-col gap-3">
          {isAuthenticated ? (
            <>
              {/* User Profile Section */}
              <div className="flex items-center gap-3 mb-4 pb-4 border-b border-border">
                <Avatar className="h-10 w-10">
                  {userImage && (
                    <AvatarImage
                      src={userImage}
                      alt={user?.firstName || "User"}
                      className="object-cover"
                    />
                  )}
                  <AvatarFallback className="text-sm font-medium uppercase">
                    {userInitials}
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium">Hi, {displayName}</span>
              </div>

              <SheetClose asChild>
                <Link to={dashboardPath}>
                  <Button className="w-full rounded-full py-5">
                    Dashboard
                  </Button>
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Button
                  variant="destructive"
                  className="w-full rounded-full py-5 bg-transparent border border-red-600 text-red-600 hover:bg-red-600 hover:text-white flex items-center justify-center"
                  onClick={handleLogout}
                >
                  <LogOut
                    className="
                                          h-5 w-5 mr-2
                                          transition-colors
                                          group-hover:stroke-white
                                        "
                  />
                  Logout
                </Button>
              </SheetClose>
            </>
          ) : (
            <>
              <SheetClose asChild>
                <Link
                  to="/join"
                  className="text-center text-sm text-foreground hover:text-accent"
                >
                  Sign Up
                </Link>
              </SheetClose>

              <SheetClose asChild>
                <Link to="/join/signin">
                  <Button className="w-full rounded-full py-5">Sign In</Button>
                </Link>
              </SheetClose>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}
