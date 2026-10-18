import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router";
import { MoveRight } from "lucide-react";
import HeroImage from "@/assets/images/pexels-apasaric-4512439.jpg";
import BackLink from "../Join/_components/BackLink";
import { toast } from "sonner";
import { useForgotPasswordMutation } from "@/redux/endpoints/authApi";
import { useSEO } from "@/hooks/use-seo";

const ResetPassword = () => {
  useSEO({
    title: "Reset Password",
    description: "Reset your GridConnect account password.",
    canonical: "https://www.gridconnect.app/join/reset-password",
    ogType: "website",
  });
  const navigate = useNavigate();
  const [forgotPassword, { isLoading }] = useForgotPasswordMutation();
  const [email, setEmail] = useState("");
  const [errors, setErrors] = useState<{
    email?: string;
    form?: string;
  }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setErrors((prev) => ({ ...prev, form: undefined }));

    try {
      const response = await forgotPassword({ email: email.trim() }).unwrap();

      toast.success(
        response.message || "OTP sent successfully! Check your email."
      );
      navigate("/join/verify-otp", { state: { email: email.trim() } });
    } catch (error: any) {
      const message =
        error?.data?.message ?? "Unable to send OTP. Please try again.";
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
                Reset <span className="text-red-600">Password</span>
              </h2>
              <p className="mt-2 text-sm text-accent/60">
                Enter your email address and we'll send you a OTP to reset your
                password
              </p>
            </div>

            <form onSubmit={handleSubmit} className="mt-8 space-y-6">
              {/* Email */}
              <div>
                <label className="text-sm text-[#D3D3D3]">Email Address</label>
                <Input
                  value={email}
                  onChange={(ev) => setEmail(ev.target.value)}
                  placeholder="Enter your email address"
                  className="mt-2 bg-slate-800/60 placeholder:text-accent/60 text-accent rounded-lg px-4 py-3"
                  aria-invalid={!!errors.email}
                  aria-describedby={errors.email ? "email-error" : undefined}
                />
                {errors.email ? (
                  <p id="email-error" className="mt-2 text-xs text-primary">
                    {errors.email}
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
                  <span>{isLoading ? "Sending OTP..." : "Send OTP"}</span>
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
                    Sign in
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResetPassword;
