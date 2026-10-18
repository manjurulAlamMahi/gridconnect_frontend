import {
  Card,
  CardContent,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import Icon from "@/components/shared/Icon";
import UserIcon from "@/assets/Icons/user.svg";
import SearchIcon from "@/assets/Icons/search.svg";
import MessageIcon from "@/assets/Icons/messagebubble.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetConnectCompeteQuery } from "@/redux/endpoints/home/home.api";
import { motion, type Variants } from "framer-motion";

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const cardIcons = [
  <Icon src={UserIcon} />,
  <Icon src={SearchIcon} />,
  <Icon src={MessageIcon} />,
];

const HowItWorks = () => {
  const { data: connectCompeteResponse, isLoading } = useGetConnectCompeteQuery(
    {},
  );

  if (isLoading) {
    return (
      <section
        id="how-it-works"
        className="w-full max-w-7xl mx-auto px-4 py-12"
      >
        <header className="text-center mb-8">
          <Skeleton className="h-6 w-32 mx-auto mb-4" />
          <Skeleton className="h-10 w-64 mx-auto" />
        </header>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[...Array(3)].map((_, i) => (
            <Card
              key={i}
              className="border rounded-2xl overflow-hidden shadow-sm"
            >
              <CardContent className="px-6 py-8">
                <div className="flex flex-col items-start gap-4">
                  <Skeleton className="h-12 w-12 rounded-full" />
                  <div className="w-full space-y-2">
                    <Skeleton className="h-5 w-1/3" />
                    <Skeleton className="h-4 w-full" />
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </section>
    );
  }

  const cards = connectCompeteResponse?.data || [];

  return (
    <motion.section
      id="how-it-works"
      className="w-full max-w-7xl mx-auto px-4 py-12 min-h-[400px]"
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "-100px" }}
      variants={containerVariants}
    >
      <motion.header className="text-center mb-8" variants={itemVariants}>
        <p className="text-accent font-medium">
          How It <span className="text-primary">Works</span>
        </p>
        <h2 className="text-2xl md:text-3xl lg:text-4xl xl:text-[40px] font-bold text-accent">
          {connectCompeteResponse?.message || "Connect. Compete. Collaborate"}
        </h2>
      </motion.header>

      <motion.div
        className="grid grid-cols-1 md:grid-cols-3 gap-6 "
        variants={containerVariants}
      >
        {cards.map((c: any, idx: number) => (
          <motion.div key={c.id} variants={itemVariants}>
            <Card className=" border rounded-2xl overflow-hidden shadow-sm transform transition-transform hover:-translate-y-1">
              <CardContent className="px-6">
                <div className="flex flex-col items-start gap-4">
                  <Avatar className="h-12 w-12">
                    <AvatarFallback className="flex items-center justify-center bg-primary text-white rounded-full">
                      {cardIcons[idx % cardIcons.length]}
                    </AvatarFallback>
                  </Avatar>

                  <div className="min-w-0">
                    <CardTitle className="text-sm text-white font-semibold">
                      {c.title}
                    </CardTitle>
                    <CardDescription className="text-xs text-gray-300 mt-2">
                      {c.short_description}
                    </CardDescription>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </motion.section>
  );
};

export default HowItWorks;
