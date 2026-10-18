import { motion, type Variants } from "framer-motion";
import { CheckCircle, XCircle } from "lucide-react";
import useModal from "./useModal";

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.8 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

const contentVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { delay: 0.2, duration: 0.3 },
  },
};

type PaymentResultModalProps = {
  type: "success" | "cancel";
  onClose?: () => void;
  onSuccess?: () => void;
  onRetry?: () => void;
  paymentFor?: "subscription" | "token";
};

export default function PaymentResultModal({
  type,
  onClose,
  onSuccess,
  onRetry,
  paymentFor = "subscription",
}: PaymentResultModalProps) {
  const { Modal } = useModal();

  const isSuccess = type === "success";
  const isTokenFlow = paymentFor === "token";

  const title = isSuccess
    ? isTokenFlow
      ? "Token Payment Successful"
      : "Subscription Payment Successful"
    : isTokenFlow
      ? "Token Payment Cancelled"
      : "Subscription Payment Cancelled";

  const description = isSuccess
    ? isTokenFlow
      ? "Your token purchase was completed successfully. You can now use your tokens."
      : "Your subscription has been activated successfully. You can now enjoy all premium features!"
    : isTokenFlow
      ? "Your token purchase was cancelled. No charges have been made to your account."
      : "Your payment was cancelled. No charges have been made to your account.";

  const handleClick = () => {
    if (isSuccess) {
      if (onSuccess) {
        onSuccess();
        return;
      }
      onClose?.();
      return;
    }
    if (onRetry) {
      onRetry();
      return;
    }
    onClose?.();
  };

  return (
    <Modal
      modalId="payment-result"
      openId="payment-result"
      className="w-[95vw] max-w-md bg-[#111114] border border-white/10 rounded-2xl p-0 shadow-2xl"
    >
      <motion.div
        className="p-6 text-center"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
      >
        <motion.div
          className="flex justify-center mb-4"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {isSuccess ? (
            <CheckCircle className="w-16 h-16 text-green-500" />
          ) : (
            <XCircle className="w-16 h-16 text-red-500" />
          )}
        </motion.div>

        <motion.h3
          className="text-xl font-bold text-white mb-2"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {title}
        </motion.h3>

        <motion.p
          className="text-white/60 text-sm mb-6"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
        >
          {description}
        </motion.p>

        <motion.button
          onClick={handleClick}
          className="w-full bg-primary hover:bg-primary/80 text-white font-semibold py-3 px-6 rounded-lg transition-colors"
          variants={contentVariants}
          initial="hidden"
          animate="visible"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          {isSuccess ? "Go to Dashboard" : "Try Again"}
        </motion.button>
      </motion.div>
    </Modal>
  );
}
