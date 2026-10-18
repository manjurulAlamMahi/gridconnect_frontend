import { XCircle } from "lucide-react";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCancelSubscriptionMutation } from "@/redux/endpoints/subscription/subscription.api";
import { toast } from "sonner";

export function SubscriptionControlsCard() {
  const [cancelSubscription, { isLoading }] = useCancelSubscriptionMutation();

  const handleCancelSubscription = async () => {
    try {
      const result = await cancelSubscription().unwrap();
      toast.success(result.message || "Subscription canceled successfully");
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to cancel subscription");
    }
  };

  return (
    <Card className="rounded-lg border bg-[#1A1A1A] shadow-sm my-5 gap-0 mb-24 md:mb-0">
      <CardHeader className="border-b">
        <CardTitle className="text-slate-100 text-lg font-semibold">
          Subscription Controls
        </CardTitle>
      </CardHeader>

      <CardContent className="p-4 sm:p-6">
        <p className="text-sm text-accent/60 mb-4">
          You can reactivate anytime before your renewal date.
        </p>

        <div className="flex flex-col gap-3 sm:flex-row">
          {/* <Button
            variant="outline"
            className="bg-transparent shadow-sm cursor-pointer hover:bg-primary"
            aria-label="Pause billing"
          >
            <Pause size={14} className="mr-2" />
            Pause Billing
          </Button> */}

          <Button
            variant="outline"
            className="w-full sm:w-auto border border-primary cursor-pointer hover:bg-primary bg-transparent"
            aria-label="Cancel subscription"
            onClick={handleCancelSubscription}
            disabled={isLoading}
          >
            <XCircle size={14} className="mr-2 hover:text-accent!" />
            {isLoading ? "Canceling..." : "Cancel Subscription"}
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
