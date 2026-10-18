import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Eye, EyeOff, Key } from "lucide-react";
import { cn } from "@/lib/utils";
import { useResetTeamPasswordMutation } from "@/redux/endpoints/team/team.api";
import { useResetDriverPasswordMutation } from "@/redux/endpoints/driver/driver.api";
import { toast } from "sonner";

type ChangePasswordModalProps = {
  openId?: string;
  buttonClassName?: string;
  buttonVariant?: React.ComponentProps<typeof Button>["variant"];
};

export default function ChangePasswordModal({
  openId,
  buttonClassName,
  buttonVariant = "destructive",
}: ChangePasswordModalProps) {
  const [open, setOpen] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [formData, setFormData] = useState({
    password: "",
    password_confirmation: "",
  });

  const [resetTeamPassword, { isLoading: isTeamLoading }] =
    useResetTeamPasswordMutation();
  const [resetDriverPassword, { isLoading: isDriverLoading }] =
    useResetDriverPasswordMutation();

  const isTeam = openId?.includes("team");
  const isLoading = isTeam ? isTeamLoading : isDriverLoading;
  const resetPassword = isTeam ? resetTeamPassword : resetDriverPassword;

  const handleInputChange = (field: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    if (formData.password !== formData.password_confirmation) {
      toast.error("Passwords do not match");
      return;
    }

    if (formData.password.length < 8) {
      toast.error("Password must be at least 8 characters long");
      return;
    }

    try {
      const result = await resetPassword({
        password: formData.password,
        password_confirmation: formData.password_confirmation,
      }).unwrap();

      toast.success(result.message || "Password reset successfully");
      setFormData({ password: "", password_confirmation: "" });
      setOpen(false);
    } catch (error: any) {
      toast.error(error?.data?.message || "Failed to reset password");
    }
  };

  const handleOpenChange = (newOpen: boolean) => {
    setOpen(newOpen);
    if (!newOpen) {
      // Reset form when closing
      setFormData({ password: "", password_confirmation: "" });
      setShowNew(false);
      setShowConfirm(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button
          variant={buttonVariant}
          className={cn("w-full h-11", buttonClassName)}
        >
          <Key className="mr-2" />
          Change Password
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg rounded-3xl border border-white/10 bg-[#151515] text-white">
        <DialogHeader className="border-b border-white/10 pb-4">
          <DialogTitle className="text-lg font-semibold">
            Reset Password
          </DialogTitle>
        </DialogHeader>
        <form className="space-y-5 pt-4" onSubmit={handleSubmit}>
          <PasswordField
            label="New Password"
            placeholder="Enter new password"
            value={formData.password}
            onChange={(value) => handleInputChange("password", value)}
            visible={showNew}
            onToggle={() => setShowNew((prev) => !prev)}
          />
          <PasswordField
            label="Confirm New Password"
            placeholder="Confirm new password"
            value={formData.password_confirmation}
            onChange={(value) =>
              handleInputChange("password_confirmation", value)
            }
            visible={showConfirm}
            onToggle={() => setShowConfirm((prev) => !prev)}
          />

          <Button
            type="submit"
            disabled={isLoading}
            className="w-full h-11 rounded-[8px] bg-linear-to-b from-primary to-[#8a0707] text-base font-semibold disabled:opacity-50"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Resetting...
              </>
            ) : (
              "Reset Password"
            )}
          </Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function PasswordField({
  label,
  placeholder,
  value,
  onChange,
  visible,
  onToggle,
}: {
  label: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  visible: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="space-y-2">
      <Label className="text-sm text-white/80">{label}</Label>
      <div className="relative">
        <Input
          type={visible ? "text" : "password"}
          placeholder={placeholder}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="h-12 rounded-xl border border-white/10 bg-black/70 pr-12 text-white placeholder:text-white/50"
        />
        <button
          type="button"
          onClick={onToggle}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white"
        >
          {visible ? (
            <Eye className="h-4 w-4" />
          ) : (
            <EyeOff className="h-4 w-4" />
          )}
        </button>
      </div>
    </div>
  );
}
