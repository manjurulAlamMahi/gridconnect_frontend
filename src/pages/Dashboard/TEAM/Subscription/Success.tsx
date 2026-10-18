import { useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router";
import {
  useConfirmPaymentSuccessQuery,
  useCreateCheckoutSessionMutation,
} from "@/redux/endpoints/subscription/subscription.api";
import PaymentResultModal from "@/components/Modal/PaymentResultModal";
import { useSEO } from "@/hooks/use-seo";
import useModal from "@/components/Modal/useModal";
import { toast } from "sonner";

export default function SubscriptionSuccess() {
  useSEO({
    title: "Payment Result",
    description: "Payment confirmation for your subscription.",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { open } = useModal();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading } = useConfirmPaymentSuccessQuery(
    { session_id: sessionId || "" },
    { skip: !sessionId },
  );

  const handleClose = () => {
    navigate("/team/dashboard/subscription");
  };

  const handleSuccess = () => {
    navigate("/team/dashboard");
  };

  const handleRetry = async () => {
    try {
      const planId = localStorage.getItem("last_subscription_plan_id");
      if (!planId) {
        toast.error(
          "No previous subscription plan found. Please select a plan again.",
        );
        navigate("/team/dashboard/subscription");
        return;
      }
      const res = await createCheckoutSession({ plan_id: planId }).unwrap();
      if (res.checkout_url) {
        window.location.href = res.checkout_url;
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start payment");
    }
  };

  useEffect(() => {
    if (!isLoading) {
      open([{ modalId: "payment-result", openId: "payment-result" }]);
    }
  }, [isLoading, open]);

  const modalType = sessionId && data?.success ? "success" : "cancel";

  return (
    <div className="flex items-center justify-center min-h-screen">
      <PaymentResultModal
        type={modalType}
        onClose={handleClose}
        onSuccess={handleSuccess}
        onRetry={handleRetry}
      />
    </div>
  );
}
