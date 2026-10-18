import React, { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { Link, useNavigate } from "react-router";
import { Eye, MoveRight } from "lucide-react";
import HideIcon from "@/assets/Icons/Hide.svg";
import Icon from "@/components/shared/Icon";
import HeroImage from "@/assets/images/pexels-apasaric-4512439.jpg";
import BackLink from "../Join/_components/BackLink";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";
import { useUserLoginMutation } from "@/redux/endpoints/authApi";
import { toast } from "sonner";
import { useSEO } from "@/hooks/use-seo";

export default function SignIn({
  onSubmit,
}: {
  onSubmit?: (v: {
    email: string;
    password: string;
    remember: boolean;
  }) => void;
}) {
  useSEO({
    title: "Sign In",
    description:
      "Welcome back to GridConnect! Sign in to access your dashboard.",
    canonical: "https://www.gridconnect.app/join/signin",
    ogType: "website",
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [userLogin, { isLoading }] = useUserLoginMutation();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState<{
    email?: string;
    password?: string;
    form?: string;
  }>({});

  function validate() {
    const e: typeof errors = {};
    if (!email.trim()) e.email = "Email is required";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))
      e.email = "Enter a valid email";
    if (!password) e.password = "Password is required";
    else if (password.length < 6)
      e.password = "Password must be at least 6 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    const values = { email: email.trim(), password, remember };
    if (onSubmit) {
      onSubmit(values);
      return;
    }
    setErrors((prev) => ({ ...prev, form: undefined }));

    try {
      const response = await userLogin({
        email: values.email,
        password: values.password,
      }).unwrap();

      const { user, token, access_status } = response.data;
      const nameParts = user.name?.split(" ") || [];

      dispatch(
        setCredentials({
          token: token,
          user: {
            id: String(user.user_id),
            role: user.role as "driver" | "team",
            firstName: nameParts[0] || "",
            lastName: nameParts.slice(1).join(" ") || "",
            email: user.email,
            image: user.image || user.team_logo || null,
            hasAccess: access_status?.has_access,
          },
        }),
      );

      if (user.role === "driver" && access_status?.has_access === false) {
        toast.error(
          access_status.reason === "expired"
            ? "Your subscription has expired. Please choose a plan."
            : "Free trial finished. Please choose a plan.",
        );
        navigate("/join/driver-profile-setup/choose-plan", { replace: true });
        return;
      }

      toast.success(response.message || "Login successful!");

      const destination =
        user.role === "team" ? "/team/dashboard" : "/driver/dashboard";
      navigate(destination, { replace: true });
    } catch (error: unknown) {
      const message =
        (error as { data?: { message?: string } })?.data?.message ??
        "Unable to sign in. Please try again.";
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
                Welcome <span className="text-red-600">Back</span>
              </h2>
              <p className="mt-2 text-sm text-accent/60">
                Sign in to your GridConnect account
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

              {/* Password */}
              <div>
                <label className="text-sm text-[#D3D3D3]">Password</label>
                <div className="relative mt-2">
                  <Input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(ev) => setPassword(ev.target.value)}
                    placeholder="Enter your password"
                    className="bg-slate-800/60 placeholder:text-accent/60 text-accent rounded-lg px-4 py-3 pr-12"
                    aria-invalid={!!errors.password}
                    aria-describedby={
                      errors.password ? "password-error" : undefined
                    }
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((s) => !s)}
                    aria-label={
                      showPassword ? "Hide password" : "Show password"
                    }
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-accent/60 hover:text-slate-200"
                  >
                    {showPassword ? (
                      <Icon src={HideIcon} />
                    ) : (
                      <Eye className="w-5 h-5" />
                    )}
                  </button>
                </div>
                {errors.password ? (
                  <p id="password-error" className="mt-2 text-xs text-primary">
                    {errors.password}
                  </p>
                ) : null}
              </div>

              <div className="flex items-center justify-between mt-2">
                <div className="flex items-center space-x-2">
                  <Checkbox
                    checked={remember}
                    onCheckedChange={(val) => setRemember(!!val)}
                  />
                  <label className="text-sm text-accent/60">Remember me</label>
                </div>

                <div>
                  <Link
                    to="/join/reset-password"
                    className="text-sm text-primary! underline!"
                  >
                    Forgot password?
                  </Link>
                </div>
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
                  <span>{isLoading ? "Signing In..." : "Sign In"}</span>
                  {!isLoading && <MoveRight className="w-4 h-4" />}
                </Button>
              </div>

              <div className="mt-6">
                <Separator className="my-4 border-slate-800/60" />
                <div className="text-center text-sm text-accent">
                  Don't have an account?{" "}
                  <Link
                    to="/join"
                    className="text-primary! underline! font-medium"
                  >
                    Create one
                  </Link>
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </section>
  );
}
