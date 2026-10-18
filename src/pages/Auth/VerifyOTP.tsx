import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { useNavigate, useLocation } from "react-router";
import { MoveRight } from "lucide-react";
import HeroImage from "@/assets/images/pexels-apasaric-4512439.jpg";
import BackLink from "../Join/_components/BackLink";
import { toast } from "sonner";
import { useVerifyOTPPasswordMutation } from "@/redux/endpoints/authApi";
import { useSEO } from "@/hooks/use-seo";

const VerifyOTP = () => {
  useSEO({
    title: "Verify OTP",
    noIndex: true,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [verifyOTP, { isLoading }] = useVerifyOTPPasswordMutation();
  const [otp, setOtp] = useState("");
  const [errors, setErrors] = useState<{
    otp?: string;
    form?: string;
  }>({});
  const [resendTimer, setResendTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);

  const email = location.state?.email || "";

  useEffect(() => {
    if (!email) {
      navigate("/join/reset-password");
      return;
    }

    // Start countdown timer for resend
    const timer = setInterval(() => {
      setResendTimer((prev) => {
        if (prev <= 1) {
          setCanResend(true);
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [email, navigate]);

  function validate() {
    const e: typeof errors = {};
    if (!otp.trim()) e.otp = "OTP is required";
    else if (otp.length !== 6) e.otp = "OTP must be 6 digits";
    else if (!/^\d{6}$/.test(otp)) e.otp = "OTP must contain only numbers";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setErrors((prev) => ({ ...prev, form: undefined }));

    try {
      const response = await verifyOTP({
        email,
        otp: otp.trim(),
      }).unwrap();

      toast.success(response.message || "OTP verified successfully!");
      navigate("/join/new-password", { state: { email, otp: otp.trim() } });
    } catch (error: any) {
      const message = error?.data?.message ?? "Invalid OTP. Please try again.";
      setErrors((prev) => ({ ...prev, form: message }));
      toast.error(message);
    }
  }

  async function handleResendOTP() {
    if (!canResend) return;

    setCanResend(false);
    setResendTimer(30);

    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));

      toast.success("OTP sent again! Check your email.");
    } catch (error: any) {
      const message =
        error?.data?.message ?? "Failed to resend OTP. Please try again.";
      toast.error(message);
      setCanResend(true);
      setResendTimer(0);
    }
  }

  return (
    <section className="relative w-screen min-h-screen flex items-center justify-center overflow-hidden">
      <BackLink
        label="Back"
        className="mb-6 inline-block fixed top-15 left-20 z-20"
      />
      {/* Background */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${HeroImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/80" />

      {/* Foreground */}
      <div className="relative z-10 w-full flex items-center justify-center px-6">
        <div className="max-w-md w-full mx-auto">
          <div className="rounded-2xl overflow-hidden bg-linear-to-b from-black/65 to-black/45 border shadow-2xl p-8">
            <div className="text-center">
              <h2 className="text-3xl md:text-4xl font-extrabold text-accent">
                Verify <span className="text-red-600">OTP</span>
              </h2>
              <p className="mt-2 text-sm text-accent/60">
                We've sent a 6-digit code to {email}
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* OTP Input */}
              <div>
                {/* <label className="text-sm text-[#D3D3D3]">Enter OTP</label>  */}
                <div className="mt-2 flex justify-center">
                  <InputOTP
                    maxLength={6}
                    value={otp}
                    onChange={(value) => setOtp(value)}
                  >
                    <InputOTPGroup>
                      <InputOTPSlot index={0} />
                      <InputOTPSlot index={1} />
                      <InputOTPSlot index={2} />
                    </InputOTPGroup>
                    <InputOTPSeparator />
                    <InputOTPGroup>
                      <InputOTPSlot index={3} />
                      <InputOTPSlot index={4} />
                      <InputOTPSlot index={5} />
                    </InputOTPGroup>
                  </InputOTP>
                </div>
                {errors.otp ? (
                  <p
                    id="otp-error"
                    className="mt-2 text-xs text-primary text-center"
                  >
                    {errors.otp}
                  </p>
                ) : null}
              </div>

              {errors.form ? (
                <p className="text-sm text-primary mt-2">{errors.form}</p>
              ) : null}

              <div>
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-4 bg-linear-to-r from-red-600 to-red-500 hover:from-red-700 hover:to-red-600 text-white rounded-full py-3 shadow-lg flex items-center justify-center gap-2 disabled:opacity-70"
                >
                  <span>{isLoading ? "Verifying..." : "Verify OTP"}</span>
                  {!isLoading && <MoveRight className="w-4 h-4" />}
                </Button>
              </div>

              <div className="text-center">
                <button
                  type="button"
                  onClick={handleResendOTP}
                  disabled={!canResend}
                  className="text-sm cursor-pointer text-accent/60 hover:text-primary disabled:text-accent/40 disabled:cursor-not-allowed"
                >
                  {canResend
                    ? "Didn't receive code? Resend OTP"
                    : `Resend OTP in ${resendTimer}s`}
                </button>
              </div>

              <div className="mt-6">
                <Separator className="my-4 border-slate-800/60" />
                <div className="text-center text-sm text-accent">
                  Wrong email?{" "}
                  <button
                    type="button"
                    onClick={() => navigate("/join/reset-password")}
                    className="text-primary! underline! font-medium"
                  >
                    Try another email
                  </button>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VerifyOTP;
