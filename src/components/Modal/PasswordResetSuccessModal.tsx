import React, { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { CheckCircle, X } from "lucide-react";
import { useNavigate } from "react-router";

interface PasswordResetSuccessModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const PasswordResetSuccessModal: React.FC<PasswordResetSuccessModalProps> = ({
  isOpen,
  onClose,
}) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (isOpen) {
      // Auto redirect after 5 seconds
      const timer = setTimeout(() => {
        navigate("/join/signin");
      }, 5000);

      return () => clearTimeout(timer);
    }
  }, [isOpen, navigate]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/80 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 max-w-md w-full mx-4">
        <div className="bg-gradient-to-br from-black/90 to-red-900/20 rounded-2xl border border-red-800/50 shadow-2xl overflow-hidden backdrop-blur-sm">
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-slate-400 hover:text-red-400 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Content */}
          <div className="p-8 text-center">
            {/* Success Icon */}
            <div className="flex justify-center mb-6">
              <div className="w-20 h-20 bg-red-500/20 rounded-full flex items-center justify-center border border-red-500/30">
                <CheckCircle className="w-12 h-12 text-red-400" />
              </div>
            </div>

            {/* Title */}
            <h2 className="text-2xl font-bold text-white mb-3">
              Password Reset Successful!
            </h2>

            {/* Description */}
            <p className="text-slate-300 mb-8 leading-relaxed">
              Your password has been successfully changed. You can now sign in
              with your new password.
            </p>

            {/* Progress indicator */}
            <div className="mb-6">
              <div className="w-full bg-slate-800 rounded-full h-2">
                <div className="bg-red-500 h-2 rounded-full animate-pulse" />
              </div>
              <p className="text-xs text-slate-400 mt-2">
                Redirecting to sign in page in a few seconds...
              </p>
            </div>

            {/* Action Button */}
            <Button
              onClick={() => navigate("/join/signin")}
              className="w-full bg-gradient-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white font-semibold py-3 rounded-xl transition-all duration-200 transform hover:scale-105 shadow-lg"
            >
              Continue to Sign In
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PasswordResetSuccessModal;
