import { useState } from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import ChangePasswordModal from "@/components/Modal/ChangePasswordModal";
import {
  AlertDialog,
  AlertDialogTrigger,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogAction,
  AlertDialogCancel,
} from "@/components/ui/alert-dialog";
import { Clock, Key, Trash, AlertTriangle } from "lucide-react";
import { useDeleteDriverAccountMutation } from "@/redux/endpoints/driver/driver.api";
import { useAppDispatch } from "@/redux/hooks";
import { removeUserInfo } from "@/redux/slices/authSlice";
import { useNavigate } from "react-router";
import { toast } from "sonner";

export default function AccountSettings() {
  const [timeout, setTimeout] = useState<string>("30");
  const [openDelete, setOpenDelete] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState("");
  const [deleteDriverAccount, { isLoading: isDeleting }] =
    useDeleteDriverAccountMutation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();

  const handleDeleteAccount = async () => {
    try {
      await deleteDriverAccount({}).unwrap();
      dispatch(removeUserInfo());
      navigate("/login");
      toast.success("Account deleted successfully");
    } catch (err: any) {
      toast.error(err?.data?.message || "Failed to delete account");
    } finally {
      setOpenDelete(false);
      setDeleteConfirmation("");
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Session Timeout */}
        <Card className="border bg-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Clock size={16} />
              Session Timeout
            </CardTitle>
            <CardDescription>
              Automatically log out after inactivity
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label className="mb-2">Timeout Duration</Label>
              <Select value={timeout} onValueChange={(v) => setTimeout(v)}>
                <SelectTrigger className="w-full h-11! bg-[#000000] text-white">
                  <SelectValue placeholder="30 minutes" />
                </SelectTrigger>
                <SelectContent className="bg-[#1A1A1A] text-white">
                  <SelectItem value="5">5 minutes</SelectItem>
                  <SelectItem value="15">15 minutes</SelectItem>
                  <SelectItem value="30">30 minutes</SelectItem>
                  <SelectItem value="60">60 minutes</SelectItem>
                </SelectContent>
              </Select>
              <p className="text-sm text-zinc-400 mt-2">
                Your session will automatically end after {timeout} min of
                inactivity
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Password Security */}
        <Card className="border bg-[#1A1A1A]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Key size={16} />
              Password Security
            </CardTitle>
            <CardDescription>
              Update your password to keep your account secure
            </CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-zinc-400 mb-4">
              We recommend changing your password regularly and using a strong,
              unique password that you do not use for other accounts.
            </p>
          </CardContent>
          <CardFooter>
            <ChangePasswordModal openId="driver-account" />
          </CardFooter>
        </Card>
      </div>

      {/* Delete Account (full width) */}
      <Card className="rounded-2xl border border-primary bg-[#080808] text-white shadow-[0_35px_60px_rgba(0,0,0,0.45)]">
        <CardHeader className="border-b border-white/5">
          <CardTitle className="text-xl">Delete Account</CardTitle>
          <CardDescription className="text-accent/60">
            Permanently remove your account and all data
          </CardDescription>
        </CardHeader>

        <CardContent>
          <div className="rounded-2xl border bg-[] p-5">
            <div className="flex items-start gap-4">
              <div className="text-red-500">
                <AlertTriangle className="h-5 w-5" />
              </div>
              <div className="space-y-2 text-sm">
                <p className="font-semibold text-accent">
                  Warning: Deleting your account is permanent and cannot be
                  undone.
                </p>
                <p className="text-accent/60">
                  All your personal data, messages, verification status, and
                  subscription history will be permanently deleted from our
                  servers.
                </p>
              </div>
            </div>
          </div>
        </CardContent>

        <CardFooter className="mt-2 flex w-full flex-col gap-3 pb-16 md:pb-0">
          <AlertDialog open={openDelete} onOpenChange={setOpenDelete}>
            <AlertDialogTrigger asChild>
              <Button className="bg-gradient-to-b from-primary to-primary/60 h-12 w-full items-center justify-center gap-2 text-base font-semibold text-white  transition ">
                <Trash className="h-4 w-4" />
                Delete My Account
              </Button>
            </AlertDialogTrigger>

            <AlertDialogContent className="border border-white/5 bg-[#111111] text-white">
              <AlertDialogHeader>
                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                <AlertDialogDescription className="text-zinc-400">
                  This action cannot be undone. This will permanently delete
                  your account and remove your data from our servers. Please
                  type "DELETE" to confirm.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <div className="mt-4 space-y-4">
                <div>
                  <Label
                    htmlFor="delete-confirm"
                    className="text-sm font-medium text-white"
                  >
                    Type "DELETE" to confirm:
                  </Label>
                  <Input
                    id="delete-confirm"
                    value={deleteConfirmation}
                    onChange={(e) => setDeleteConfirmation(e.target.value)}
                    placeholder="Type DELETE here"
                    className="mt-2 bg-[#1A1A1A] border-white/20 text-white placeholder:text-zinc-500"
                  />
                </div>
                <div className="flex gap-2 justify-end">
                  <AlertDialogCancel asChild>
                    <Button
                      variant="outline"
                      onClick={() => {
                        setDeleteConfirmation("");
                        setOpenDelete(false);
                      }}
                    >
                      Cancel
                    </Button>
                  </AlertDialogCancel>
                  <AlertDialogAction asChild>
                    <Button
                      variant="destructive"
                      disabled={deleteConfirmation !== "DELETE" || isDeleting}
                      onClick={(e) => {
                        e.preventDefault();
                        handleDeleteAccount();
                      }}
                    >
                      {isDeleting ? "Deleting..." : "Yes, delete account"}
                    </Button>
                  </AlertDialogAction>
                </div>
              </div>
            </AlertDialogContent>
          </AlertDialog>
        </CardFooter>
      </Card>
    </div>
  );
}
