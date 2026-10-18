import { Link, NavLink, useNavigate } from "react-router";
import { Button } from "@/components/ui/button";
import Logo from "@/components/shared/Logo";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import useAuth from "@/hooks/useAuth";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/slices/authSlice";
import { useGetProfileQuery } from "@/redux/endpoints/driver/driver.api";
import { useGetTeamProfileQuery } from "@/redux/endpoints/team/team.api";
import { LogOut } from "lucide-react";

const menuItems = [
  { name: "Home", link: "#home" },
  { name: "How It Works", link: "#how-it-works" },
  { name: "Features", link: "#features" },
  { name: "Pricing", link: "#pricing" },
  { name: "Contact", link: "/contact" },
];

const handleMenuClick = (link: string) => {
  if (link.includes("#")) {
    const hash = link.split("#")[1];
    const element = document.getElementById(hash);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  }
};

export default function Navigation() {
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
    <nav className="container mx-auto bg-transparent relative flex items-center">
      <div className="flex items-center">
        <Link
          to="/"
          className="text-accent text-xl font-semibold hover:text-accent-foreground transition-colors"
        >
          <Logo />
        </Link>
      </div>

      {/* Center Navigation */}
      <ul className="hidden md:flex items-center gap-8 justify-center flex-1">
        {menuItems.map((item) => (
          <li key={item.link}>
            <NavLink
              to={item.link}
              onClick={() => handleMenuClick(item.link)}
              className={({ isActive }: { isActive: boolean }) =>
                `text-sm font-medium transition-colors ${
                  isActive
                    ? "text-primary hover:text-primary!"
                    : "text-gray-300 "
                }`
              }
            >
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>

      {/* Right-hand CTAs */}
      <div className="flex items-center gap-4">
        {isAuthenticated ? (
          <>
            <h1>Hi, {displayName}</h1>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className="border border-border rounded-full p-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60 transition-colors"
                  aria-label="Open profile menu"
                >
                  <Avatar className="h-10 w-10 object-cover">
                    {userImage && (
                      <AvatarImage
                        src={userImage}
                        alt={user?.firstName || "User"}
                        className="object-cover object-center"
                      />
                    )}
                    <AvatarFallback className="text-sm font-medium uppercase">
                      {userInitials}
                    </AvatarFallback>
                  </Avatar>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem
                  className="hover:bg-primary! hover:text-white! cursor-pointer"
                  onSelect={() => navigate(dashboardPath)}
                >
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem
                  variant="destructive"
                  className="group cursor-pointer hover:bg-primary! hover:text-white!"
                  onSelect={handleLogout}
                >
                  <LogOut
                    className="
                        h-5 w-5 mr-2
                        transition-colors
                        group-hover:stroke-white
                      "
                  />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        ) : (
          <>
            <Link to="/join" className="hidden sm:inline-block">
              Sign Up
            </Link>

            <Link to="/join/signin">
              <Button className="px-5 py-3 cursor-pointer">Sign In</Button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
