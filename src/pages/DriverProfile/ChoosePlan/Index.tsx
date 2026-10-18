import backgroundImage from "@/assets/images/GetStarted.svg";
import { useEffect, useMemo, useState } from "react";
import { PricingCard } from "./components/PricingCard";
// import { BoostProfile } from "./components/BoostProfile";
// import TotalSection from "./components/Total";
import { useNavigate } from "react-router";
import Icon from "@/components/shared/Icon";
import BackIcon from "@/assets/Icons/arrow_back_round.svg";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { MultiStepProgress } from "@/components/shared/MultiStepProgress";
import {
  useCreateCheckoutSessionMutation,
  useGetPlansQuery,
} from "@/redux/endpoints/subscription/subscription.api";
import { toast } from "sonner";

const basicFeatures = [
  { text: "Complete profile access" },
  { text: "View and contact teams" },
  { text: "Smart matching algorithm" },
  { text: "Message teams directly" },
  { text: "Profile analytics" },
  { text: "Free until January 2026" },
];

const premiumFeatures = [
  { text: "Everything in Free Trial" },
  { text: "Priority in team searches" },
  { text: "Advanced analytics" },
  { text: "Featured profile badge" },
  { text: "Early access to new features" },
  { text: "Cancel anytime" },
];

export default function PricingPage() {
  const [selectedPlan, setSelectedPlan] = useState("");
  const { data: plansResponse } = useGetPlansQuery();
  const [createCheckoutSession] = useCreateCheckoutSessionMutation();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const parseFeaturePoints = (html: string) =>
    html
      .replace(/<\/?p>/gi, "")
      .split(/<br\s*\/?>/gi)
      .map((point) => point.trim())
      .filter(Boolean);

  const plans = useMemo(() => {
    const apiPlans =
      plansResponse?.data?.plans?.map((plan, index) => {
        const numericPrice = Number.parseFloat(plan.price || "0");

        return {
          id: String(plan.id),
          key: `${plan.id}-${index}`,
          title: plan.name,
          price: `£${Number.isFinite(numericPrice) ? numericPrice.toFixed(0) : "0"}`,
          description: plan.description || "Full access to all features",
          features: parseFeaturePoints(plan.features).map((text) => ({ text })),
        };
      }) || [];

    if (apiPlans.length > 0) {
      return apiPlans;
    }

    return [
      {
        id: "basic",
        key: "basic-0",
        title: "Driver Basic",
        price: "£15",
        description: "Full access to all features",
        features: basicFeatures,
      },
      {
        id: "premium",
        key: "premium-1",
        title: "Driver Premium",
        price: "£35",
        description: "Enhanced visibility and features",
        features: premiumFeatures,
      },
    ];
  }, [plansResponse?.data?.plans]);

  useEffect(() => {
    if (!plans.length) return;

    const selectedExists = plans.some((plan) => plan.id === selectedPlan);
    if (!selectedPlan || !selectedExists) {
      setSelectedPlan(plans[0].id);
    }
  }, [plans, selectedPlan]);

  const submitHandler = async (e: React.FormEvent) => {
    e.preventDefault();

    if (plans.length === 0) {
      navigate("/driver/dashboard");
      return;
    }

    const selectedApiPlan = plansResponse?.data?.plans?.find(
      (plan) => String(plan.id) === selectedPlan,
    );

    if (!selectedApiPlan) {
      toast.error("Plan is not ready yet. Please try again.");
      return;
    }

    setIsSubmitting(true);

    try {
      localStorage.setItem("last_subscription_plan_id", String(selectedApiPlan.id));
      const res = await createCheckoutSession({
        plan_id: selectedApiPlan.id,
      }).unwrap();

      if (res.checkout_url) {
        window.location.href = res.checkout_url;
        return;
      }

      toast.error("Unable to start payment session.");
      setIsSubmitting(false);
    } catch (error) {
      const err = error as { data?: { message?: string } };
      toast.error(err?.data?.message || "Failed to start payment");
      setIsSubmitting(false);
    }
  };
  return (
    <div className="relative min-h-screen">
      {/* Background Layer - covers entire page including stepper */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/90" aria-hidden="true" />

      {/* Stepper - on top of background */}
      <MultiStepProgress currentStep={4} mode="driver" />

      <section className="relative w-full flex items-center justify-center overflow-hidden">
        {/* Content */}
        <div className="relative z-10 container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            {/* Header */}
            <div className="text-center mb-12">
              <h1 className="text-4xl font-bold text-accent mb-4">
                Choose <span className="text-primary">Your Plan</span>
              </h1>
              <p className="text-xl text-neutral-300 max-w-2xl mx-auto">
                Start with our free trial and upgrade anytime
              </p>
            </div>
            <div className="bg-linear-to-tl to-[#0E1421] via-[#080A11] from-[#030101] p-8 rounded-[12px] border">
              <form onSubmit={submitHandler}>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                  {plans.map((plan, index) => (
                    <PricingCard
                      key={plan.key}
                      title={plan.title}
                      price={plan.price}
                      description={plan.description}
                      features={plan.features}
                      popular={index === 1}
                      variant={index === 1 ? "premium" : "default"}
                      value={plan.id}
                      selectedValue={selectedPlan}
                      onValueChange={setSelectedPlan}
                    />
                  ))}
                </div>
                {/* <div className="grid grid-cols-1 gap-8">
                <BoostProfile />
                <TotalSection result={result} />
              </div> */}
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full mt-6 h-12 font-semibold bg-linear-to-b from-primary to-black/30 text-sm cursor-pointer text-accent tracking-wide shadow-md"
                >
                  {isSubmitting
                    ? "Redirecting to payment..."
                    : "Active Your Account"}{" "}
                  <span>
                    {" "}
                    <MoveRight />
                  </span>
                </Button>
              </form>
              <div className="text-center mt-8 border-t border-primary/30 flex flex-col items-center gap-4 pt-6">
                <button
                  type="button"
                  onClick={() => navigate("/driver/dashboard")}
                  className="text-sm text-neutral-400 hover:text-accent cursor-pointer transition-colors duration-300 underline underline-offset-4"
                >
                  Skip for now
                </button>
                <button
                  type="button"
                  onClick={() => navigate(-1)}
                  className="group flex cursor-pointer items-center gap-2 mx-auto text-base text-accent transition"
                >
                  {/* Icon with hover effect */}
                  <Icon
                    src={BackIcon}
                    className="group-hover:text-primary transition-all"
                  />
                  <span className="group-hover:text-primary transition-color duration-300">
                    Back to the previous page
                  </span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
