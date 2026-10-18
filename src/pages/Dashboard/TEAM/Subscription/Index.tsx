import { ChevronLeft, ChevronRight } from "lucide-react";
import Plans from "./_components/Plans";
import PaymentHistory from "./_components/PaymentHistory";
import { useSEO } from "@/hooks/use-seo";

const Subscription = () => {
  useSEO({
    title: "Subscription",
    description: "Manage your subscription plan and billing history.",
  });

  return (
    <main>
      <div className="flex gap-4">
        <p className="flex gap-2.5">
          <span>
            <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>{" "}
          <span>
            {" "}
            <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>
        </p>
        <p className="text-sm font-medium">Subscription</p>
      </div>
      <p className="text-accent/60 text-sm sm:text-base mt-5">
        Manage your plan, tokens, and billing information
      </p>
      <div className="mb-24 md:mb-0">
        {/* Subscription management content goes here */}
        <Plans />
        <PaymentHistory />
      </div>
    </main>
  );
};

export default Subscription;
