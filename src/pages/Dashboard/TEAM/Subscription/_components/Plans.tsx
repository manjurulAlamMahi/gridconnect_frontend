import type { Plan } from "./Card";
import CardChild from "./Card";
import { useGetPlansQuery } from "@/redux/endpoints/subscription/subscription.api";
import { Skeleton } from "@/components/ui/skeleton";
import { useCreateCheckoutSessionMutation, useGetCurrentSubscriptionQuery, useUpgradeSubscriptionMutation } from "@/redux/endpoints/subscription/subscription.api";
import { toast } from "sonner";
import { useState } from "react";
import type { ISubscriptionPlan } from "@/types/subscription";

const parseFeaturePoints = (html: string) =>
  html
    .replace(/<\/?p>/gi, "")
    .split(/<br\s*\/?>/gi)
    .map((point) => point.trim())
    .filter(Boolean);

export default function Plans() {
  const { data, isLoading } = useGetPlansQuery();
  const { data: currentSubData } = useGetCurrentSubscriptionQuery();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [upgradeSubscription] = useUpgradeSubscriptionMutation();
  const [loadingPlanId, setLoadingPlanId] = useState<string | null>(null);

  const currentPlanId = currentSubData?.data?.subscription?.plan_id;
  const hasActivePlan = currentSubData?.data?.subscription?.status === "active";

  const plans: Plan[] =
    data?.data?.plans?.map((p: ISubscriptionPlan) => ({
      id: p.id.toString(),
      title: p.name,
      price: `£${parseFloat(p.price).toFixed(0)}`,
      period: `/${p.duration}`,
      renewalDate: null,
      tokensRemaining: hasActivePlan && currentPlanId === p.id ? currentSubData?.data?.total_tokens : p.included_tokens,
      features: parseFeaturePoints(p.features),
      isActive: hasActivePlan && currentPlanId === p.id,
      isPopular: false,
    })) || [];

  const handleBuyTokens = (planId: string) => {
    // wire real flow here
    console.log("Buy tokens clicked for", planId);
    alert(`Buy tokens for ${planId}`);
  };

  const handlePrimary = async (planId: string) => {
    setLoadingPlanId(planId);
    try {
      if (hasActivePlan) {
        // Upgrade existing subscription
        const res = await upgradeSubscription({ plan_id: planId }).unwrap();
        toast.success(res.message || "Plan upgraded successfully");
        setLoadingPlanId(null);
      } else {
        // Create new subscription
        localStorage.setItem("last_subscription_plan_id", String(planId));
        const res = await createCheckoutSession({ plan_id: planId }).unwrap();
        if (res.checkout_url) {
          window.location.href = res.checkout_url;
        }
      }
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to process request");
      setLoadingPlanId(null);
    }
  };

  return (
    <section className="py-5">
      <div className="grid max-w-5xl gap-6 md:grid-cols-2">
        {isLoading
          ? [1, 2].map((i) => (
              <div key={i} className="rounded-lg border bg-card p-6">
                <div className="flex items-center justify-between mb-4">
                  <Skeleton className="h-6 w-32" />
                  <Skeleton className="h-6 w-16" />
                </div>
                <Skeleton className="h-8 w-24 mb-2" />
                <Skeleton className="h-4 w-20 mb-4" />
                <div className="space-y-2 mb-6">
                  {[1, 2, 3].map((j) => (
                    <Skeleton key={j} className="h-4 w-full" />
                  ))}
                </div>
                <div className="flex gap-2">
                  <Skeleton className="h-10 flex-1" />
                  <Skeleton className="h-10 w-24" />
                </div>
              </div>
            ))
          : plans.map((plan) => (
              <CardChild
                key={plan.id}
                plan={plan}
                onBuyTokens={handleBuyTokens}
                onPrimary={handlePrimary}
                isLoading={loadingPlanId === plan.id}
                hasActivePlan={hasActivePlan}
              />
            ))}
      </div>
    </section>
  );
}

