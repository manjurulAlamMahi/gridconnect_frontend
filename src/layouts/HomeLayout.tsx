import Footer from "@/components/layout/Footer/Footer";
import Header from "@/components/layout/Header/Header";
import {
  Outlet,
  useLocation,
  useNavigate,
  useSearchParams,
  ScrollRestoration,
} from "react-router";
import { useEffect } from "react";
import useModal from "@/components/Modal/useModal";
import PaymentResultModal from "@/components/Modal/PaymentResultModal";
import {
  useConfirmPaymentSuccessQuery,
  useCreateCheckoutSessionMutation,
} from "@/redux/endpoints/subscription/subscription.api";
import {
  useConfirmTokenPaymentQuery,
  useBuyTokenMutation,
} from "@/redux/endpoints/token/token.api";
import { toast } from "sonner";

const HomeLayout = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { open } = useModal();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [buyToken] = useBuyTokenMutation();

  const sessionId = searchParams.get("session_id");
  const type = searchParams.get("type");
  const isTokenType = type === "token";
  const hasTokenSession = !!(sessionId && (isTokenType || !type));
  const hasSubSession = !!(sessionId && (!isTokenType || !type));

  const isCheckoutPath =
    location.pathname === "/stripe/success" ||
    location.pathname === "/stripe/cancel" ||
    location.pathname === "/payment/checkout/success" ||
    location.pathname === "/payment/checkout/cancel";

  const isCancel =
    location.pathname === "/stripe/cancel" ||
    location.pathname === "/payment/checkout/cancel" ||
    searchParams.get("status") === "cancel";

  const {
    data: subData,
    isFetching: isSubFetching,
    isUninitialized: isSubUninit,
  } = useConfirmPaymentSuccessQuery(
    { session_id: sessionId || "" },
    { skip: !hasSubSession },
  );

  const {
    data: tokenData,
    isFetching: isTokenFetching,
    isUninitialized: isTokenUninit,
  } = useConfirmTokenPaymentQuery(
    { session_id: sessionId || "" },
    { skip: !hasTokenSession },
  );

  const isVerifying = hasSubSession
    ? isSubFetching || isSubUninit
    : hasTokenSession && (isTokenFetching || isTokenUninit);

  const isVerifiedSuccess = !!(
    (hasSubSession && subData?.success) ||
    (hasTokenSession && tokenData?.success)
  );

  const showPaymentModal =
    isCancel || !!(sessionId && !isVerifying && isVerifiedSuccess);

  const handleClose = () => {
    if (isCheckoutPath) {
      navigate("/", { replace: true });
      return;
    }
    navigate({ pathname: location.pathname, search: "" }, { replace: true });
  };

  const handleSuccess = () => {
    navigate("/dashboard", { replace: true });
  };

  const handleRetry = async () => {
    try {
      if (isTokenType) {
        const packageId = localStorage.getItem("last_token_package_id");
        if (!packageId) {
          toast.error(
            "No previous token package found. Please select a package again.",
          );
          navigate("/", { replace: true });
          return;
        }
        const res = await buyToken({ package_id: packageId }).unwrap();
        if (res.data?.checkout_url) {
          window.location.href = res.data.checkout_url;
          return;
        }
        toast.error("Checkout URL not found.");
        return;
      }

      const planId = localStorage.getItem("last_subscription_plan_id");
      if (!planId) {
        toast.error(
          "No previous subscription plan found. Please select a plan again.",
        );
        navigate("/", { replace: true });
        return;
      }
      const res = await createCheckoutSession({ plan_id: planId }).unwrap();
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }
      toast.error("Checkout URL not found.");
    } catch (err: any) {
      toast.error(
        err?.data?.message || "Failed to start checkout. Please try again.",
      );
    }
  };

  useEffect(() => {
    if (showPaymentModal) {
      if (isCancel) {
        open([{ modalId: "payment-result", openId: "payment-result" }]);
        return;
      }
      if (sessionId && !isVerifying) {
        open([{ modalId: "payment-result", openId: "payment-result" }]);
      }
    }
  }, [showPaymentModal, isCancel, sessionId, isVerifying, open]);

  const modalType = isCancel ? "cancel" : "success";

  useEffect(() => {
    if (!location.hash) {
      window.scrollTo(0, 0);
    }
  }, [location.hash, location.pathname]);

  useEffect(() => {
    if (location.hash) {
      setTimeout(() => {
        const element = document.getElementById(location.hash.substring(1));
        if (element) {
          element.scrollIntoView({ behavior: "smooth" });
        }
      }, 100);
    }
  }, [location.hash]);

  return (
    <main>
      <ScrollRestoration />
      <Header />
      <Outlet />
      <Footer />
      {showPaymentModal && (
        <PaymentResultModal
          type={modalType}
          paymentFor={
            isTokenType || tokenData?.success ? "token" : "subscription"
          }
          onClose={handleClose}
          onSuccess={handleSuccess}
          onRetry={handleRetry}
        />
      )}
    </main>
  );
};
export default HomeLayout;
