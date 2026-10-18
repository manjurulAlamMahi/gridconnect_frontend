import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { CalendarIcon, Eye, EyeOff, MoveRight } from "lucide-react";
import { format } from "date-fns";
import { Link, useNavigate } from "react-router";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Form, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { useUserRegisterMutation } from "@/redux/endpoints/userApi";
import { useUserLoginMutation } from "@/redux/endpoints/authApi";
import { useGetLicenceTypesQuery } from "@/redux/endpoints/Licencetype";
import { toast } from "sonner";
import { useAppDispatch } from "@/redux/hooks";
import { setCredentials } from "@/redux/slices/authSlice";

const schema = z
  .object({
    name: z.string().min(1, "Full name is required"),
    email: z.email("Enter a valid email"),
    password: z.string().min(8, "Password must be at least 8 characters"),
    password_confirmation: z.string().min(1, "Please confirm your password"),
    date_of_birth: z.string().min(1, "Date of birth is required"),
    license_type_id: z.string().min(1, "Select your racing license type"),
    agree: z
      .boolean()
      .refine((val) => val === true, "You must agree to the Terms & Privacy"),
  })
  .refine((data) => data.password === data.password_confirmation, {
    message: "Passwords do not match",
    path: ["password_confirmation"],
  });

type FormValues = z.infer<typeof schema>;

export default function DriverForm({
  onSubmit,
}: {
  onSubmit?: (values: FormValues) => void;
}) {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [driverCreate, { isLoading }] = useUserRegisterMutation();
  const [userLogin] = useUserLoginMutation();
  const { data: licenceTypesData } = useGetLicenceTypesQuery();

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      password_confirmation: "",
      date_of_birth: "",
      license_type_id: "",
      agree: false,
    },
  });

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const handleSubmit = async (values: FormValues) => {
    if (onSubmit) {
      onSubmit(values);
      return;
    }

    try {
      const { agree, ...payload } = values;
      const requestBody = {
        role: "driver",
        name: payload.name.trim(),
        email: payload.email.trim(),
        password: payload.password,
        password_confirmation: payload.password_confirmation,
        date_of_birth: payload.date_of_birth,
        license_type_id: payload.license_type_id,
      };

      const response = await driverCreate(requestBody).unwrap();
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
              image: user.image || null,
              dateOfBirth: user.date_of_birth || undefined,
            },
          }),
        );
      }

      toast.success("Driver account created successfully!");
      navigate("/join/driver-profile-setup");
    } catch (err: any) {
      const errorMessage =
        err?.data?.message || "Registration failed. Please try again.";
      toast.error(errorMessage);
      console.error("Driver registration error:", err);
    }
  };

  // const handleSubmit = (values: FormValues) => {
  //   if (onSubmit) onSubmit(values);
  //   else console.log("Driver signup:", values);

  //   navigate("/join/driver-profile-setup");
  // };

  return (
    <div className="rounded-2xl bg-[#0B0E12]/60 border border-slate-800/60 backdrop-blur-md p-4 md:p-8 shadow-2xl max-w-lg mx-auto">
      <h2 className="text-2xl md:text-3xl font-extrabold text-white text-center mb-1">
        Create <span className="text-primary">Driver Account</span>
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
            <FormLabel className="text-sm text-accent/60">Full Name</FormLabel>
            <FormControl>
              <Input
                {...form.register("name")}
                placeholder="Enter your full name"
                className="mt-2 bg-input text-accent rounded-lg placeholder:text-accent/60"
              />
            </FormControl>
            {form.formState.errors.name?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.name.message}
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
                  {showPassword ? <Eye /> : <EyeOff />}
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
                  type={showConfirm ? "text" : "password"}
                  {...form.register("password_confirmation")}
                  placeholder="Confirm your password"
                  className="bg-input text-accent rounded-lg placeholder:text-accent/60 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm((s) => !s)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-200"
                >
                  {showConfirm ? <Eye /> : <EyeOff />}
                </button>
              </div>
            </FormControl>
            {form.formState.errors.password_confirmation?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.password_confirmation.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60 flex items-center gap-2">
              Date of Birth
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="date_of_birth"
                render={({ field }) => (
                  <Popover>
                    <PopoverTrigger asChild>
                      <button
                        type="button"
                        className="w-full mt-2 text-accent rounded-lg placeholder:text-accent/60 px-4 py-3 flex items-center justify-between border border-slate-700 bg-input transition-colors"
                      >
                        {field.value ? (
                          <span>{format(new Date(field.value), "PPP")}</span>
                        ) : (
                          <span className="text-slate-400">
                            Select your birth date
                          </span>
                        )}
                        <CalendarIcon className="w-5 h-5 text-slate-400" />
                      </button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0 bg-[#0B0E12] border border-slate-800 rounded-xl">
                      <Calendar
                        mode="single"
                        selected={
                          field.value ? new Date(field.value) : undefined
                        }
                        onSelect={(date) => {
                          if (date) {
                            const year = date.getFullYear();
                            const month = String(date.getMonth() + 1).padStart(
                              2,
                              "0",
                            );
                            const day = String(date.getDate()).padStart(2, "0");
                            const iso = `${year}-${month}-${day}`;
                            field.onChange(iso);
                          }
                        }}
                        captionLayout="dropdown"
                        startMonth={new Date(1976, 0)}
                        endMonth={new Date(2016, 11)}
                      />
                    </PopoverContent>
                  </Popover>
                )}
              />
            </FormControl>
            {form.formState.errors.date_of_birth?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.date_of_birth.message}
              </p>
            )}
          </FormItem>

          <FormItem>
            <FormLabel className="text-sm text-accent/60">
              Racing license
            </FormLabel>
            <FormControl>
              <Controller
                control={form.control}
                name="license_type_id"
                render={({ field }) => (
                  <Select
                    onValueChange={field.onChange}
                    value={field.value || undefined}
                  >
                    <SelectTrigger className="w-full mt-2 h-[52px]! bg-input text-accent rounded-lg placeholder:text-accent">
                      <SelectValue
                        placeholder="Select your license"
                        className="text-accent!"
                      />
                    </SelectTrigger>
                    <SelectContent className="w-full bg-gray-900 text-accent border rounded-xl">
                      {licenceTypesData?.data?.map((license) => (
                        <SelectItem
                          key={license.id}
                          value={license.id.toString()}
                        >
                          {license.type}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                )}
              />
            </FormControl>
            {form.formState.errors.license_type_id?.message && (
              <p className="text-xs text-red-400 mt-1">
                {form.formState.errors.license_type_id.message}
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
                <Link to="terms" className="text-primary! underline!">
                  Terms &amp; Conditions
                </Link>{" "}
                and{" "}
                <Link to="privacy" className="text-primary! underline!">
                  Privacy &amp; Policy
                </Link>
              </div>
            </div>
            {form.formState.errors.agree && (
              <p className="text-xs text-red-400 mt-2">
                {form.formState.errors.agree.message}
              </p>
            )}
          </div>

          <div className="mt-4 flex flex-col gap-3">
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-b from-primary via-primary to-black/30 text-white h-12 py-3 shadow-lg flex items-center justify-center gap-2 text-base cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "Creating Account..." : "Get Started as Driver"}{" "}
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
