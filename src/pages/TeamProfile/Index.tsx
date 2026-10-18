import backgroundImage from "@/assets/images/GetStarted.svg";
import Icon from "@/components/shared/Icon";
import VerifiedIcon from "@/assets/Icons/verifiedbedge.svg";
import MessageIcon from "@/assets/Icons/message_2.svg";
import MultiUser from "@/assets/Icons/user_mul.svg";
import SparkIcon from "@/assets/Icons/spark.svg";
import { Card, CardHeader } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import Car from "@/assets/Icons/car.svg";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Link } from "react-router";

export default function TeamProfileSetup() {
  const data = [
    {
      title: "Verified Driver",
      description: "Connect with professional, licensed drivers.",
      icon: <Icon src={VerifiedIcon} />,
    },
    {
      title: "Post Drives",
      description: "List available seats for upcoming seasons.",
      icon: <Icon src={MultiUser} />,
    },
    {
      title: "Smart Messaging",
      description: "Chat directly with drivers and manage conversations.",
      icon: <Icon src={MessageIcon} />,
    },
    {
      title: "Analytics & Visibility",
      description: "See who's engaging with your drives.",
      icon: <Icon src={SparkIcon} />,
    },
  ];

  return (
    <div>
      <section className="relative w-full flex items-center justify-center ">
        {/* Background Layer */}
        {/* <MultiStepProgress currentStep={1} /> */}
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${backgroundImage})` }}
          aria-hidden="true"
        />
        <div className="absolute inset-0 bg-black/87" aria-hidden="true" />

        {/* Content */}
        <div className="relative z-10 w-full max-w-6xl mx-auto text-center px-4 md:px-6 mt-10">
          <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-extrabold bg-linear-to-b from-primary via-primary/90 to-black/20 bg-clip-text text-transparent leading-tight">
            Welcome to GridConnect!
          </h1>

          <p className="mt-4 max-w-xl mx-auto text-[#C0C0C0] text-base sm:text-xl md:text-2xl">
            Find verified racing drivers, manage your drives, and grow your
            team's presence.
          </p>
          <div className="w-full flex items-center justify-center">
            <div className="relative flex items-center justify-center">
              {/* Left line */}
              <span className="absolute -left-20 top-[60%] -translate-y-1/2 w-12 h-[3px] bg-white/50 rounded" />
              <span className="absolute -left-26 top-1/2 -translate-y-1/2 w-18 h-0.5 bg-accent/70 rounded" />
              <span className="absolute -left-20 top-[40%] -translate-y-1/2 w-12 h-0.5 bg-white/50 rounded" />
              {/* The car icon on red circle */}
              <div className="bg-primary w-40 h-40 rounded-full flex items-center justify-center shadow-xl mt-6">
                <Icon src={Car} className="mx-auto w-24 h-24 text-white" />
              </div>
              {/* Right line */}
              <span className="absolute -right-20 top-[40%] -translate-y-1/2 w-12 h-0.5 bg-white/50 rounded" />
              <span className="absolute -right-26 top-1/2 -translate-y-1/2 w-18 h-0.5 bg-accent/70 rounded" />
              <span className="absolute -right-20 top-[60%] -translate-y-1/2 w-12 h-[3px] bg-white/50 rounded" />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-8">
            {data.map((item) => (
              <Card
                key={item.title}
                className={cn(
                  "bg-neutral-900/80 border rounded-xl shadow-lg min-h-[142px] text-left group",
                  "transition-all duration-200 hover:border-primary/70 hover:shadow-2xl hover:-translate-y-1"
                )}
              >
                <CardHeader className="flex flex-row items-start gap-4 pt-4 pb-2!">
                  <span className="flex h-12 w-12 items-center justify-center rounded-md bg-primary/10 group-hover:bg-primary/20 transition">
                    <span className="text-primary">{item.icon}</span>
                  </span>
                  <div className="max-w-xs">
                    <h3 className="text-lg font-semibold text-white">
                      {item.title}
                    </h3>
                    <p className="text-sm text-neutral-400 leading-relaxed">
                      {item.description}
                    </p>
                  </div>
                </CardHeader>
              </Card>
            ))}
          </div>
          <Link to="team-information">
            <Button className="w-full my-12 h-13 cursor-pointer text-base font-semibold bg-linear-to-b from-primary via-primary/90 to-black/20">
              Start Complete the Profile{" "}
              <span>
                <MoveRight />
              </span>
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
