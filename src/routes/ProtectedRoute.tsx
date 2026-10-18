import { Navigate, Outlet, useLocation } from "react-router";
import { useAppSelector } from "@/redux/hooks";
import type { TUserRole } from "@/redux/slices/authSlice";
import { useSEO } from "@/hooks/use-seo";

type ProtectedRouteProps = {
  allowedRoles?: TUserRole[];
  redirectTo?: string;
};

export default function ProtectedRoute({
  allowedRoles,
  redirectTo = "/join/signin",
}: ProtectedRouteProps) {
  useSEO({ noIndex: true });
  const { token, user } = useAppSelector((state) => state.auth);
  const location = useLocation();

  if (!token) {
    return (
      <Navigate to={redirectTo} state={{ from: location.pathname }} replace />
    );
  }

  const isDriverProfileRoute = location.pathname.includes(
    "/join/driver-profile-setup/choose-plan",
  );

  if (allowedRoles && allowedRoles.length > 0 && user?.role) {
    const isAllowed = allowedRoles.includes(user.role);
    if (!isAllowed) {
      if (
        user.role === "driver" &&
        user.hasAccess === false &&
        !isDriverProfileRoute
      ) {
        return <Navigate to="/join/driver-profile-setup/choose-plan" replace />;
      }
      const fallback =
        user.role === "team" ? "/team/dashboard" : "/driver/dashboard";
      return <Navigate to={fallback} replace />;
    }
  }

  // Enforce driver plan access check for all driver routes
  if (
    user?.role === "driver" &&
    user?.hasAccess === false &&
    !isDriverProfileRoute
  ) {
    return <Navigate to="/join/driver-profile-setup/choose-plan" replace />;
  }

  return <Outlet />;
}
