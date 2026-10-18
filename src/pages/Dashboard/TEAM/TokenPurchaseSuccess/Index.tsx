import { useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router";
import {
  useConfirmTokenPaymentQuery,
  useBuyTokenMutation,
} from "@/redux/endpoints/token/token.api";
import PaymentResultModal from "@/components/Modal/PaymentResultModal";
import { useSEO } from "@/hooks/use-seo";
import useModal from "@/components/Modal/useModal";
import { toast } from "sonner";

export default function TeamTokenPurchaseSuccess() {
  useSEO({
    title: "Token Purchase Result",
    description: "Payment confirmation for your token purchase.",
  });

  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { open } = useModal();
  const [buyToken] = useBuyTokenMutation();
  const sessionId = searchParams.get("session_id");

  const { data, isLoading } = useConfirmTokenPaymentQuery(
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
      const packageId = localStorage.getItem("last_token_package_id");
      if (!packageId) {
        toast.error(
          "No previous token package found. Please select a package again.",
        );
        navigate("/team/dashboard/subscription");
        return;
      }
      const res = await buyToken({ package_id: packageId }).unwrap();
      if (res.data?.checkout_url) {
        window.location.href = res.data.checkout_url;
      }
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to start token purchase");
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
        paymentFor="token"
        onClose={handleClose}
        onSuccess={handleSuccess}
        onRetry={handleRetry}
      />
    </div>
  );
}
