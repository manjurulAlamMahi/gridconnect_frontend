import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Eye, EyeOff, MoveRight } from "lucide-react";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useTeamRegisterMutation } from "@/redux/endpoints/userApi";
import { useUserLoginMutation } from "@/redux/endpoints/authApi";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";

const schema = z
  .object({
    contact_name: z.string().min(1, "Contact name is required"),
    team_name: z.string().min(1, "Team name is required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
    website: z.url("Enter a valid URL").optional().or(z.literal("")),
    keyAchievements: z.string().optional(),
    agree: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Terms & Privacy"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function TeamForm({
  onSubmit,
}: {
  onSubmit?: (values: FormValues) => void;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [registerTeam, { isLoading }] = useTeamRegisterMutation();
  // console.log("🚀 ~ TeamForm ~ registerTeam:", registerTeam)
  const [userLogin] = useUserLoginMutation();
  // console.log("🚀 ~ TeamForm ~ userLogin:", userLogin)

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      contact_name: "",
      team_name: "",
      email: "",
      password: "",
      password_confirmation: "",
      website: "",
      keyAchievements: "",
      agree: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    if (onSubmit) {
      onSubmit(values);
      return;
    }

    try {
      const { website, ...payload } = values;
      const trimmedWebsite = website?.trim();
      const requestBody = {
        role: "team",
        email: payload.email.trim(),
        name: payload.contact_name.trim(),
        password: payload.password,
        password_confirmation: payload.password_confirmation,
        contact_name: payload.contact_name.trim(),
        team_name: payload.team_name.trim(),
        ...(trimmedWebsite ? { website: trimmedWebsite } : {}),
      };

      const response = await registerTeam(requestBody).unwrap();
      let token = response?.data?.token;
      let user = response?.data?.user;

      if (!token || !user) {
        try {
          const loginResponse = await userLogin({
            email: payload.email,
            password: payload.password,
          }).unwrap();
          token = loginResponse?.data?.token;
          user = loginResponse?.data?.user;
        } catch (loginErr) {
          console.error("Auto-login failed", loginErr);
        }
      }

      if (token && user) {
        const { user, token } = response.data;
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
              teamName: user.team_name || values.team_name || "",
            },
          }),
        );
      }

      toast.success("Team account created successfully!");
      navigate("/join/team-profile-setup");
    } catch (err: unknown) {
      const typedError = err as { data?: { message?: string } };
      const errorMessage =
        typedError?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Team registration error:", err);
    }
  };

  return (
    <div className="rounded-2xl bg-[#0B0E12]/60 border border-slate-800/60 backdrop-blur-md p-8 shadow-2xl max-w-lg mx-auto">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-1">
        Create <span className="text-primary">Team Account</span>
      </h2>
      <p className="text-center text-sm text-accent/60 mb-6">
        Join the GridConnect community
      </p>

      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="space-y-4 text-left"
        >
          <FormItem>
            <FormLabel className="text-sm text-accent/60">
              Contact Name
            </FormLabel>
            <FormControl>
              <Input
                {...form.register("contact_name")}
                placeholder="Enter your full name"
                className="mt-2 bg-input text-accent rounded-lg placeholder:text-accent/60"
              />
            </FormControl>
            {form.formState.errors.contact_name?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.contact_name.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60">Team Name</FormLabel>
            <FormControl>
              <Input
                {...form.register("team_name")}
                placeholder="Enter your team name"
                className="mt-2 bg-input text-accent rounded-lg placeholder:text-accent/60"
              />
            </FormControl>
            {form.formState.errors.team_name?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.team_name.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60">
              Email Address
            </FormLabel>
            <FormControl>
              <Input
                {...form.register("email")}
                placeholder="Enter your email address"
                className="mt-2 bg-input text-accent rounded-lg placeholder:text-accent/60"
              />
            </FormControl>
            {form.formState.errors.email?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.email.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60">Password</FormLabel>
            <FormControl>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password")}
                  placeholder="Create a strong password"
                  className="bg-input text-accent rounded-lg placeholder:text-accent/60 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showPassword ? <Eye size={18} /> : <EyeOff size={18} />}
                </button>
              </div>
            </FormControl>
            {form.formState.errors.password?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.password.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60">
              Confirm Password
            </FormLabel>
            <FormControl>
              <div className="relative mt-2">
                <Input
                  type={showPassword ? "text" : "password"}
                  {...form.register("password_confirmation")}
                  placeholder="Confirm your password"
                  className="bg-input text-accent rounded-lg placeholder:text-accent/60 pr-12"
                />
              </div>
            </FormControl>
            {form.formState.errors.password_confirmation?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60">
              Website (optional)
            </FormLabel>
            <FormControl>
              <Input
                {...form.register("website")}
                placeholder="https://name.domain"
                className="mt-2 bg-input text-accent rounded-lg placeholder:text-accent/60"
              />
            </FormControl>
            {form.formState.errors.website?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.website.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60">
              Key Achievements (Optional)
            </FormLabel>
            <FormControl>
              <Input
                {...form.register("keyAchievements")}
                placeholder="e.g. Championship wins, notable races"
                className="mt-2 bg-input text-accent rounded-lg placeholder:text-accent/60"
              />
            </FormControl>
            {form.formState.errors.keyAchievements?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.keyAchievements.message}
              </p>
            )}
          </FormItem>

          <div className="pt-4">
            <div className="flex items-start gap-3">
              <Controller
                control={form.control}
                name="agree"
                render={({ field }) => (
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                )}
              />
              <div className="text-sm text-accent">
                I agree to the{" "}
                <Link to="/terms-conditions" className="text-red-500 underline">
                  <span className="text-primary">
                    Terms &amp; Conditions
                  </span>{" "}
                </Link>{" "}
                and{" "}
                <Link to="/privacy-policy" className="text-red-500 underline">
                  <span className="text-primary">Privacy &amp; Policy</span>
                </Link>
              </div>
            </div>
            {form.formState.errors.agree && (
              <p className="text-xs text-red-400 mt-2">
                {form.formState.errors.agree.message}
              </p>
            )}
          </div>

          <div>
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full mt-4 bg-linear-to-b from-primary via-primary to-black/30 text-white h-12 py-3 shadow-lg flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Get Started as Team"}{" "}
              <MoveRight />
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-accent/60">
            Already have an account?{" "}
            <Link to="/join/signin" className="text-red-500 underline">
              Sign In
            </Link>
          </div>
        </form>
      </Form>
    </div>
  );
}
