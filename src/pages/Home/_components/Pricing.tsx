import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import "@/styles/pricing.css";
// import Icon from "@/components/shared/Icon";
// import SparkIcon from "@/assets/Icons/spark.svg";
import { useGetDriverPlanQuery } from "@/redux/endpoints/home/home.api";
import type { IDriverPlan } from "@/types/driverplan";
import { motion, type Variants } from "framer-motion";
import { useNavigate } from "react-router";
import useAuth from "@/hooks/useAuth";
import { toast } from "sonner";

const CheckIcon = ({ className = "" }: { className?: string }) => (
  <svg
    className={className}
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    aria-hidden
  >
    <path
      d="M20 6L9 17l-5-5"
      stroke="currentColor"
      strokeWidth="2.2"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

export default function Pricing() {
  const navigate = useNavigate();
  const { user, isAuthenticated } = useAuth();

  const handlePurchase = async () => {
    if (!isAuthenticated) {
      navigate("/join/signin");
      return;
    }

    if (user?.role === "driver") {
      navigate("/driver/dashboard/subscription");
    } else if (user?.role === "team") {
      navigate("/team/dashboard/subscription");
    } else {
      toast.error("Invalid user role");
    }
  };

  const { data: driverPlansResponse, isLoading } = useGetDriverPlanQuery();

  const parseFeaturePoints = (html: string) =>
    html
      .replace(/<\/?p>/gi, "")
      .split(/<br\s*\/?>/gi)
      .map((point) => point.trim())
      .filter(Boolean);

  const plans =
    driverPlansResponse?.data?.map((p: IDriverPlan, index: number) => ({
      id: p.id,
      key: `${p.type}-${p.id}-${index}`,
      targetRole: p.type,
      title: p.name,
      subtitle: p.description,
      price: `$ ${parseFloat(p.price).toFixed(0)}`,
      freq: `/${p.duration === "monthly" ? "month" : "year"}`,
      features: parseFeaturePoints(p.features),
      includedTokens: p.included_tokens,
      cta: "Get Started Free",
      variant: index === 1 ? "highlight" : "muted",
      badge: (p as IDriverPlan & { most_popular?: number }).most_popular
        ? "Most Popular"
        : undefined,
    })) || [];

  return (
    <section
      id="pricing"
      className="pt-16 pb-16 md:pb-28 lg:pb-[130px] xl:pb-[146px]"
    >
      <div className="max-w-7xl mx-auto px-6 text-center">
        <motion.p
          className="text-lg text-accent mb-3"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          Simple Pricing for Every <span className="text-primary">Racer</span>
        </motion.p>
        <motion.h2
          className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-accent max-w-5xl mx-auto leading-tight mb-8"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={itemVariants}
        >
          Transparent pricing with no hidden fees. Start for free and upgrade
          when you&apos;re ready.
        </motion.h2>

        <div className="mt-[130px] grid grid-cols-1 md:grid-cols-2 gap-12 items-stretch min-h-[600px]">
          {isLoading
            ? [1, 2].map((i) => (
                <div key={i} className="relative">
                  <Card className="h-full rounded-2xl overflow-hidden border border-border/50">
                    <CardHeader className="px-8 pt-8">
                      <Skeleton className="h-8 w-48 mb-2" />
                      <Skeleton className="h-4 w-full" />
                    </CardHeader>
                    <CardContent className="px-8 pt-4 pb-6">
                      <div className="flex justify-center items-baseline gap-3 mb-4">
                        <Skeleton className="h-12 w-24" />
                      </div>
                      <Skeleton className="h-4 w-64 mx-auto mb-6" />
                      <div className="flex flex-col gap-4">
                        {[1, 2, 3, 4].map((j) => (
                          <div key={j} className="flex items-start gap-3">
                            <Skeleton className="h-8 w-8 rounded-full shrink-0" />
                            <Skeleton className="h-6 w-full" />
                          </div>
                        ))}
                      </div>
                    </CardContent>
                    <CardFooter className="px-8 pb-8">
                      <Skeleton className="h-[42px] w-full rounded-md" />
                    </CardFooter>
                  </Card>
                </div>
              ))
            : plans.map((p) => (
                <div key={p.key} className="relative">
                  {/* {p.badge ? (
                    <div className="absolute left-1/2 -top-10 transform -translate-x-1/2 z-10">
                      <div className="neon-badge inline-flex items-center gap-2 px-6 py-3 rounded-full bg-primary text-accent text-sm">
                        <Icon src={SparkIcon} />
                        <span>{p.badge}</span>
                      </div>
                    </div>
                  ) : null} */}

                  <Card
                    className={
                      "relative rounded-2xl overflow-hidden transition-all duration-300 " +
                      (p.variant === "highlight"
                        ? "border border-primary h-full transform scale-[1.05] shadow-2xl shadow-primary/20 red-blur-shadow"
                        : "h-full hover:border-primary hover:border hover:transform hover:scale-[1.05] hover:shadow-2xl hover:shadow-primary/20 hover:red-blur-shadow")
                    }
                  >
                    {p.targetRole && (
                      <div className="absolute top-0 right-0 bg-primary/10 border-b border-l border-primary/20 text-primary px-4 py-1.5 rounded-bl-[14px] text-[10px] font-bold uppercase tracking-widest z-10">
                        {p.targetRole === "team" ? "For Teams" : "For Drivers"}
                      </div>
                    )}
                    <CardHeader className="px-8 pt-8">
                      <CardTitle className="text-2xl text-accent mb-2 mt-2">
                        {p.title}
                      </CardTitle>
                      <p className="text-sm text-[#99A1AF] max-w-xl">
                        {p.subtitle}
                      </p>
                    </CardHeader>

                    <CardContent className="px-8 pt-4 pb-6">
                      <div className="flex justify-center items-baseline gap-3 mb-4">
                        <div className="price text-primary font-extrabold text-4xl sm:text-5xl leading-none">
                          {p.price}
                        </div>
                        <div className="text-sm text-accent/60 mt-1">
                          {p.freq}
                        </div>
                      </div>

                      <p className="text-xs text-accent/60 mb-6">
                        Includes {p.includedTokens} tokens
                      </p>

                      <ul className="flex flex-col gap-4">
                        {p.features.map((f) => (
                          <li key={f} className="flex items-start gap-3">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full">
                              <CheckIcon className="text-green-400" />
                            </div>
                            <span className="text-[18px] text-accent/60">
                              {f}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>

                    <CardFooter className="px-8 pb-8">
                      <Button
                        onClick={() => handlePurchase()}
                        className={
                          "w-full rounded-md cursor-pointer h-[42px] py-1" +
                          (p.variant === "highlight"
                            ? " text-white bg-linear-to-b from-primary via-primary/80 to-black/30"
                            : "text-white bg-linear-to-b from-primary via-primary/80 to-black/30")
                        }
                      >
                        {p.cta}
                      </Button>
                    </CardFooter>
                  </Card>
                </div>
              ))}
        </div>
      </div>
    </section>
  );
}
