import { Navigate } from "react-router";
import useAuth from "@/hooks/useAuth";

export default function DashboardRedirect() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/join/signin" replace />;
  }

  if (user?.role === "driver" && user?.hasAccess === false) {
    return <Navigate to="/join/driver-profile-setup/choose-plan" replace />;
  }

  const destination =
    user?.role === "team" ? "/team/dashboard" : "/driver/dashboard";

  return <Navigate to={destination} replace />;
}
