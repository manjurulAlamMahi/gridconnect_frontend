import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { cn } from "@/lib/utils";
import type { PropsWithChildren } from "react";
import { useSearchParams } from "react-router";

interface ModalProps {
  modalId: string;
  openId: string;
  closeModals?: string[];
  className?: string;
  showCloseButton?: boolean;
}

export default function Modal({
  openId,
  modalId,
  children,
  closeModals,
  className,
  showCloseButton = true,
}: PropsWithChildren<ModalProps>) {
  const [searchParams, setSearchParams] = useSearchParams();
  const modal = searchParams.get(modalId);

  const handleOpenChange = (open: boolean) => {
    if (open) {
      searchParams.set(modalId, openId);
    } else {
      searchParams.delete(modalId);
      if (closeModals && closeModals.length > 0) {
        closeModals.forEach((id) => searchParams.delete(id));
      }
    }

    setSearchParams(searchParams);
  };

  return (
    <Dialog open={modal === openId} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild hidden />
      <DialogContent
        showCloseButton={showCloseButton}
        className={cn(
          "min-h-auto min-w-fit bg-transparent p-0 shadow-none",
          className
        )}
      >
        <DialogHeader hidden>
          <DialogTitle hidden />
          <DialogDescription hidden />
        </DialogHeader>
        {children}
        <DialogFooter hidden />
      </DialogContent>
    </Dialog>
  );
}
