import NotFound from "@/components/shared/NotFound";
import HomeLayout from "@/layouts/HomeLayout";
import Home from "@/pages/Home/Home";
import { createBrowserRouter, Navigate } from "react-router";
import SetupLayout from "@/layouts/SetupLayout";
import JoinLayout from "@/layouts/JoinLayout";
import Join from "@/pages/Join/Index";
import SignIn from "@/pages/Auth/SignIn";
import SignUp from "@/pages/Auth/SignUp";
import ResetPassword from "@/pages/Auth/ResetPassword";
import VerifyOTP from "@/pages/Auth/VerifyOTP";
import NewPassword from "@/pages/Auth/NewPassword";
import DriverProfileSetup from "@/pages/DriverProfile/Index";
import RacingInfoForm from "@/pages/DriverProfile/RacingInformation/Index";
import DriverVerificationForm from "@/pages/DriverProfile/Verification/Index";
import PricingPage from "@/pages/DriverProfile/ChoosePlan/Index";
import SuccessPage from "@/pages/DriverProfile/Success/Index";
import DashboardLayout from "@/layouts/DashboardLayout";
import DashboardHome from "@/pages/Dashboard/DRIVER/Home/Index";
import Profile from "@/pages/Dashboard/DRIVER/Profile/Index";
import Messages from "@/pages/Dashboard/DRIVER/Messages/Index";
import SearchTeam from "@/pages/Dashboard/DRIVER/SearchTeam/Index";
import Subscription from "@/pages/Dashboard/DRIVER/Subscription/Index";
import SubscriptionSuccess from "@/pages/Dashboard/DRIVER/Subscription/Success";
import TokenPurchaseSuccess from "@/pages/Dashboard/DRIVER/TokenPurchaseSuccess/Index";
import TokenPurchaseCancel from "@/pages/Dashboard/DRIVER/TokenPurchaseSuccess/Cancel";
import ProtectedRoute from "./ProtectedRoute";
import TeamDashboardHome from "@/pages/Dashboard/TEAM/Home/Index";
import TeamProfile from "@/pages/Dashboard/TEAM/Profile/Index";
import TeamMessages from "@/pages/Dashboard/TEAM/Messages/Index";
import TeamSubscription from "@/pages/Dashboard/TEAM/Subscription/Index";
import TeamSubscriptionSuccess from "@/pages/Dashboard/TEAM/Subscription/Success";
import TeamTokenPurchaseSuccess from "@/pages/Dashboard/TEAM/TokenPurchaseSuccess/Index";
import TeamTokenPurchaseCancel from "@/pages/Dashboard/TEAM/TokenPurchaseSuccess/Cancel";
import TeamAccount from "@/pages/Dashboard/TEAM/Account/Index";
import DashboardRedirect from "./DashboardRedirect";
import SearchDriver from "@/pages/Dashboard/TEAM/SearchDriver/Index";
import TeamDrives from "@/pages/Dashboard/TEAM/Drives/Index";
import TeamProfileSetup from "@/pages/TeamProfile/Index";
import TeamInformationPage from "@/pages/TeamProfile/TeamInformation/Index";
import NewOpportunity from "@/pages/TeamProfile/NewOpportunity/Index";
import TeamVerification from "@/pages/TeamProfile/Verification/Index";
import PricingPageTeam from "@/pages/TeamProfile/ChoosePlan/Index";
import CreateDrive from "@/pages/Dashboard/TEAM/Drives/New/Index";
import EditDrive from "@/pages/Dashboard/TEAM/Drives/Edit/Index";
import AccountPage from "@/pages/Dashboard/DRIVER/Account/Index";
import PersonalInfoForm from "@/pages/DriverProfile/PersonalInformation/Index";
import ContactUs from "@/pages/Contact/Index";
import DynamicPage from "@/pages/DynamicPage/Index";

const driverDashboardChildren = [
  {
    index: true,
    element: <DashboardHome />,
  },
  {
    path: "home",
    element: <DashboardHome />,
  },
  {
    path: "profile",
    element: <Profile />,
  },
  {
    path: "message",
    element: <Messages />,
  },
  {
    path: "search-team",
    element: <SearchTeam />,
  },
  {
    path: "subscription",
    element: <Subscription />,
  },
  {
    path: "stripe/success",
    element: <SubscriptionSuccess />,
  },
  {
    path: "token/success",
    element: <TokenPurchaseSuccess />,
  },
  {
    path: "payment/checkout/success",
    element: <TokenPurchaseSuccess />,
  },
  {
    path: "token/cancel",
    element: <TokenPurchaseCancel />,
  },
  {
    path: "payment/checkout/cancel",
    element: <TokenPurchaseCancel />,
  },
  {
    path: "account",
    element: <AccountPage />,
  },
  {
    path: "contact",
    element: <ContactUs />,
  },
];

const teamDashboardChildren = [
  {
    index: true,
    element: <TeamDashboardHome />,
  },
  {
    path: "home",
    element: <TeamDashboardHome />,
  },
  {
    path: "profile",
    element: <TeamProfile />,
  },
  {
    path: "message",
    element: <TeamMessages />,
  },
  {
    path: "search-driver",
    element: <SearchDriver />,
  },
  {
    path: "drives",
    element: <TeamDrives />,
  },
  {
    path: "drives/new",
    element: <CreateDrive />,
  },
  {
    path: "drives/edit/:id",
    element: <EditDrive />,
  },
  {
    path: "subscription",
    element: <TeamSubscription />,
  },
  {
    path: "stripe/success",
    element: <TeamSubscriptionSuccess />,
  },
  {
    path: "token/success",
    element: <TeamTokenPurchaseSuccess />,
  },
  {
    path: "payment/checkout/success",
    element: <TeamTokenPurchaseSuccess />,
  },
  {
    path: "token/cancel",
    element: <TeamTokenPurchaseCancel />,
  },
  {
    path: "payment/checkout/cancel",
    element: <TeamTokenPurchaseCancel />,
  },
  {
    path: "account",
    element: <TeamAccount />,
  },
];

const router = createBrowserRouter([
  {
    path: "/",
    element: <HomeLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: Home,
      },
      {
        path: "stripe/success",
        Component: Home,
      },
      {
        path: "stripe/cancel",
        Component: Home,
      },
      {
        path: "payment/checkout/success",
        Component: Home,
      },
      {
        path: "payment/checkout/cancel",
        Component: Home,
      },
    ],
  },
  {
    path: "/contact",
    element: <JoinLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: ContactUs,
      },
    ],
  },
  {
    path: "/about-us",
    element: <JoinLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: DynamicPage,
      },
    ],
  },
  {
    path: "/terms-conditions",
    element: <JoinLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: DynamicPage,
      },
    ],
  },
  {
    path: "/privacy-policy",
    element: <JoinLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: DynamicPage,
      },
    ],
  },
  {
    path: "/join",
    element: <JoinLayout />,
    errorElement: <NotFound />,
    children: [
      {
        index: true,
        Component: Join,
      },
      {
        path: "signin",
        Component: SignIn,
      },
      {
        path: "signup",
        Component: SignUp,
      },
      {
        path: "reset-password",
        Component: ResetPassword,
      },
      {
        path: "verify-otp",
        Component: VerifyOTP,
      },
      {
        path: "new-password",
        Component: NewPassword,
      },
      {
        path: "driver-profile-setup",
        element: <SetupLayout />,
        children: [
          {
            index: true,
            Component: DriverProfileSetup,
          },
          {
            path: "personal-information",
            Component: PersonalInfoForm,
          },
          {
            path: "racing-information",
            Component: RacingInfoForm,
          },
          {
            path: "verification",
            Component: DriverVerificationForm,
          },
          {
            path: "choose-plan",
            Component: PricingPage,
          },
          {
            path: "success",
            Component: SuccessPage,
          },
        ],
      },
      {
        path: "team-profile-setup",
        element: <SetupLayout />,
        children: [
          {
            index: true,
            Component: TeamProfileSetup,
          },
          {
            path: "team-information",
            Component: TeamInformationPage,
          },
          {
            path: "new-opportunity",
            Component: NewOpportunity,
          },
          {
            path: "verification",
            Component: TeamVerification,
          },
          {
            path: "choose-plan",
            Component: PricingPageTeam,
          },
          {
            path: "success",
            Component: SuccessPage,
          },
        ],
      },
    ],
  },
  {
    path: "/dashboard",
    element: <DashboardRedirect />,
  },
  {
    path: "/driver",
    element: <ProtectedRoute allowedRoles={["driver"]} />,
    children: [
      {
        index: true,
        element: <Navigate to="dashboard" replace />,
      },
      {
        path: "dashboard",
        element: <DashboardLayout role="driver" />,
        errorElement: <NotFound />,
        children: driverDashboardChildren,
      },
    ],
  },
  {
    path: "/team",
    element: <ProtectedRoute allowedRoles={["team"]} />,
    children: [
      {
        path: "dashboard",
        element: <DashboardLayout role="team" />,
        errorElement: <NotFound />,
        children: teamDashboardChildren,
      },
    ],
  },
]);

export default router;
