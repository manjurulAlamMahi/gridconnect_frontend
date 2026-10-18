import React, { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate, useLocation } from "react-router";
import { MoveRight, Eye, EyeOff } from "lucide-react";
import HeroImage from "@/assets/images/pexels-apasaric-4512439.jpg";
import BackLink from "../Join/_components/BackLink";
import { toast } from "sonner";
import PasswordResetSuccessModal from "@/components/Modal/PasswordResetSuccessModal";
import { useResetPasswordMutation } from "@/redux/endpoints/authApi";
import { useSEO } from "@/hooks/use-seo";

const NewPassword = () => {
  useSEO({
    title: "Set New Password",
    noIndex: true,
  });
  const navigate = useNavigate();
  const location = useLocation();
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [errors, setErrors] = useState<{
    password?: string;
    confirmPassword?: string;
    form?: string;
  }>({});

  const email = location.state?.email || "";
  const otp = location.state?.otp || "";

  useEffect(() => {
    if (!email || !otp) {
      navigate("/join/reset-password");
      return;
    }
  }, [email, otp, navigate]);

  function validate() {
    const e: typeof errors = {};
    if (!password.trim()) e.password = "Password is required";
    else if (password.length < 8)
      e.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(password))
      e.password = "Password must contain uppercase, lowercase, and number";

    if (!confirmPassword.trim())
      e.confirmPassword = "Please confirm your password";
    else if (password !== confirmPassword)
      e.confirmPassword = "Passwords do not match";

    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setErrors((prev) => ({ ...prev, form: undefined }));

    try {
      await resetPassword({
        email,
        otp,
        password: password.trim(),
      }).unwrap();

      setShowSuccessModal(true);
    } catch (error: any) {
      const message =
        error?.data?.message ?? "Failed to reset password. Please try again.";
      setErrors((prev) => ({ ...prev, form: message }));
      toast.error(message);
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
                Set New <span className="text-red-600">Password</span>
              </h2>
              <p className="mt-2 text-sm text-accent/60">
                Enter your new password below
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Password Input */}
              <div>
                <label htmlFor="password" className="text-sm text-[#D3D3D3]">
                  New Password
                </label>
                <div className="mt-2 relative">
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter new password"
                    className="pr-10 bg-black/30 border text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p className="mt-2 text-xs text-primary">{errors.password}</p>
                ) : null}
              </div>

              {/* Confirm Password Input */}
              <div>
                <label
                  htmlFor="confirmPassword"
                  className="text-sm text-[#D3D3D3]"
                >
                  Confirm Password
                </label>
                <div className="mt-2 relative">
                  <Input
                    id="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    placeholder="Confirm new password"
                    className="pr-10 bg-black/30 text-white placeholder:text-slate-400 focus:border-red-500 focus:ring-red-500"
                  />
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-white"
                  >
                    {showConfirmPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
                {errors.confirmPassword ? (
                  <p className="mt-2 text-xs text-primary">
                    {errors.confirmPassword}
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
                  <span>{isLoading ? "Resetting..." : "Reset Password"}</span>
                  {!isLoading && <MoveRight className="w-4 h-4" />}
                </Button>
              </div>

              <div className="mt-6">
                <Separator className="my-4 border-slate-800/60" />
                <div className="text-center text-sm text-accent">
                  Remember your password?{" "}
                  <Link
                    to="/join/signin"
                    className="text-primary! underline! font-medium"
                  >
                    Sign In
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Success Modal */}
      <PasswordResetSuccessModal
        isOpen={showSuccessModal}
        onClose={() => setShowSuccessModal(false)}
      />
    </section>
  );
};

export default NewPassword;
