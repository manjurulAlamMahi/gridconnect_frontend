import { useEffect } from "react";
import { useNavigate } from "react-router";
import {
  useCancelTokenPaymentMutation,
  useBuyTokenMutation,
} from "@/redux/endpoints/token/token.api";
import PaymentResultModal from "@/components/Modal/PaymentResultModal";
import { useSEO } from "@/hooks/use-seo";
import useModal from "@/components/Modal/useModal";
import { toast } from "sonner";

export default function TeamTokenPurchaseCancel() {
  useSEO({
    title: "Token Purchase Cancelled",
    description: "Your token purchase has been cancelled.",
  });

  const navigate = useNavigate();
  const { open } = useModal();
  const [cancelTokenPayment] = useCancelTokenPaymentMutation();
  const [buyToken] = useBuyTokenMutation();

  useEffect(() => {
    const handleCancel = async () => {
      try {
        await cancelTokenPayment().unwrap();
      } catch (error) {
        console.error("Error cancelling token payment:", error);
      } finally {
        open([{ modalId: "payment-result", openId: "payment-result" }]);
      }
    };

    handleCancel();
  }, [cancelTokenPayment, open]);

  const handleClose = () => {
    navigate("/team/dashboard/subscription");
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

  return (
    <div className="flex items-center justify-center min-h-screen">
      <PaymentResultModal
        type="cancel"
        paymentFor="token"
        onClose={handleClose}
        onRetry={handleRetry}
      />
    </div>
  );
}
