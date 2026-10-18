import RiderImage from "@/assets/images/corefeature_image.svg";
import Icon from "@/components/shared/Icon";
import ShieldIcon from "@/assets/Icons/sheild.svg";
import ChatIcon from "@/assets/Icons/message_2.svg";
import FilterIcon from "@/assets/Icons/funnels.svg";
import DeviceIcon from "@/assets/Icons/devices.svg";
import TouchPadIcon from "@/assets/Icons/touchpad.svg";
import CheckmarkIcon from "@/assets/Icons/circle_mark.svg";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetCoreFeaturesQuery } from "@/redux/endpoints/home/home.api";
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

const imageVariants: Variants = {
  hidden: { scale: 1.05, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: { duration: 0.8, ease: "easeOut" },
  },
};

const IconWrapper: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <motion.div
    whileHover={{ scale: 1.1, rotate: 5 }}
    className="flex h-16 w-16 items-center justify-center rounded-full bg-[#0F1113] border border-[#182025] shadow-lg shrink-0"
  >
    <div className="w-5 h-5 text-primary">{children}</div>
  </motion.div>
);

const featureIcons = [
  <Icon src={ShieldIcon} />,
  <Icon src={TouchPadIcon} />,
  <Icon src={CheckmarkIcon} />,
  <Icon src={ChatIcon} />,
  <Icon src={FilterIcon} />,
  <Icon src={DeviceIcon} />,
];

export default function Features() {
  const { data: coreFeaturesResponse, isLoading } = useGetCoreFeaturesQuery({});

  if (isLoading) {
    return (
      <section
        id="features"
        className="bg-[#040609] py-16 text-accent min-h-[800px]"
      >
        <div className="container mx-auto px-6">
          <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
            <div className="space-y-10">
              <div className="space-y-4">
                <Skeleton className="h-6 w-32" />
                <Skeleton className="h-10 w-full" />
                <Skeleton className="h-10 w-3/4" />
              </div>
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                {[...Array(6)].map((_, i) => (
                  <div key={i} className="flex items-start gap-4">
                    <Skeleton className="h-16 w-16 rounded-full shrink-0" />
                    <div className="mt-2 flex-1 space-y-2">
                      <Skeleton className="h-4 w-full" />
                      <Skeleton className="h-4 w-5/6" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Skeleton className="h-[619px] w-full rounded-2xl hidden lg:block" />
          </div>
        </div>
      </section>
    );
  }

  const featureData = coreFeaturesResponse?.data?.[0];
  const featureList = featureData?.description
    ? featureData.description
        .split("<br>")
        .map((item: string) => item.replace(/[\n\r]/g, "").trim())
        .filter((item: string) => item.length > 0)
    : [];

  return (
    <section
      id="features"
      className="bg-[#040609] py-16 text-accent overflow-hidden min-h-[800px]"
    >
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 items-center gap-8 lg:grid-cols-2">
          {/* Left: Heading + Feature List */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, margin: "-100px" }}
            variants={containerVariants}
            className="space-y-10"
          >
            <motion.div variants={itemVariants}>
              <span className="inline-flex items-center gap-2 text-lg">
                <span className="text-accent">Core</span>
                <span className="font-medium text-red-500">Features</span>
              </span>

              <h1 className="mt-4 max-w-3xl text-2xl font-extrabold leading-tight md:text-3xl lg:text-4xl xl:text-[40px]">
                {featureData?.title ||
                  "Everything you need to build meaningful motorsport connections"}
              </h1>
            </motion.div>

            <motion.div
              className="grid grid-cols-1 gap-6 sm:grid-cols-2"
              variants={containerVariants}
            >
              {featureList.map((desc: string, idx: number) => (
                <motion.div
                  key={idx}
                  variants={itemVariants}
                  className="flex items-start gap-4 group"
                >
                  <IconWrapper>
                    {featureIcons[idx % featureIcons.length]}
                  </IconWrapper>

                  <p className="mt-2 text-[16px] text-accent group-hover:text-white transition-colors duration-300">
                    <span dangerouslySetInnerHTML={{ __html: desc }} />
                  </p>
                </motion.div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right: Image Section */}
          <motion.div
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true }}
            variants={imageVariants}
            className="relative"
          >
            <div className="overflow-hidden rounded-2xl shadow-2xl border border-white/5">
              <img
                src={featureData?.image || RiderImage}
                alt="Motorsport rider"
                className="h-[619px] w-full object-center object-cover hidden lg:block transition-transform duration-700 hover:scale-105"
              />
              <div className="absolute inset-0 bg-le bg-linear-to-r from-black via-black/80 to-transparent lg:from-[#040609] lg:via-black/80 lg:to-transparent" />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
