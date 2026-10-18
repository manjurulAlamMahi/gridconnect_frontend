// import HeroImage from "@/assets/images/hero.svg";
import { Button } from "@/components/ui/button";
import { MoveRight } from "lucide-react";
import { Link } from "react-router";
import { motion, type Variants } from "framer-motion";
import { Swiper, SwiperSlide } from "swiper/react";
import { Pagination, Autoplay, EffectFade } from "swiper/modules";
import { useMemo, useState } from "react";
import { useGetHomeBannersQuery } from "@/redux/endpoints/home/home.api";

// Import Swiper styles
import "swiper/css";
import "swiper/css/pagination";
import "swiper/css/effect-fade";

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

type HeroSlide = {
  id: number;
  image: string;
  title: string;
  subtitle: string;
  description: string;
  buttonText: string;
  buttonLink: string;
};

const fallbackSlides: HeroSlide[] = [
  {
    id: 1,
    image:
      "https://i.ibb.co.com/1GqVCX0m/Gemini-Generated-Image-n8zp6pn8zp6pn8zp.png",
    title: "The Ultimate Elite Racing",
    subtitle: "Drivers & Teams Network",
    description:
      "GridConnect helps drivers and racing teams find each other — verified, connected, and ready to race.",
    buttonText: "Join as Driver",
    buttonLink: "/join/signup?role=driver",
  },
  {
    id: 2,
    image:
      "https://i.ibb.co.com/Hf1PPP6S/Gemini-Generated-Image-93wfot93wfot93wf.png",
    title: "Access Premium Global",
    subtitle: "Motorsport Opportunities",
    description:
      "Connect with top-tier racing teams and showcase your driving talent on the biggest stages.",
    buttonText: "Join as Team",
    buttonLink: "/join/signup?role=team",
  },
  {
    id: 3,
    image:
      "https://i.ibb.co.com/Nn9tPW0s/Gemini-Generated-Image-v4na30v4na30v4na.png",
    title: "Professional Career",
    subtitle: "Racing Grid Access",
    description:
      "Your gateway to professional racing careers. Verified profiles, direct connections, zero hassle.",
    buttonText: "Get Started",
    buttonLink: "/join/signup",
  },
  {
    id: 4,
    image:
      "https://i.ibb.co.com/jPDM9DJk/Gemini-Generated-Image-epf030epf030epf0.png",
    title: "Where High Speed",
    subtitle: "Meets Endless Opportunity",
    description:
      "From karting to Formula racing — find your perfect match in the motorsport ecosystem.",
    buttonText: "Explore Now",
    buttonLink: "/join/signin",
  },
];

const Hero = () => {
  const [activeIndex, setActiveIndex] = useState(0);
  const { data: bannerResponse } = useGetHomeBannersQuery(undefined);

  const slides = useMemo<HeroSlide[]>(() => {
    const bannerData = bannerResponse?.data;

    if (!Array.isArray(bannerData) || bannerData.length === 0) {
      return fallbackSlides;
    }

    return bannerData.map(
      (
        banner: {
          id: number;
          title: string;
          description: string;
          image: string;
        },
        index: number,
      ) => {
        const words = (banner.title || "").trim().split(/\s+/).filter(Boolean);
        const splitIndex = Math.max(1, Math.ceil(words.length / 2));
        const title = words.slice(0, splitIndex).join(" ");
        const subtitle = words.slice(splitIndex).join(" ") || "";

        return {
          id: banner.id,
          image: banner.image,
          title,
          subtitle,
          description: banner.description,
          buttonText: fallbackSlides[index]?.buttonText ?? "Get Started",
          buttonLink: fallbackSlides[index]?.buttonLink ?? "/join/signup",
        };
      },
    );
  }, [bannerResponse?.data]);

  const safeActiveIndex = slides.length > 0 ? activeIndex % slides.length : 0;

  return (
    <section id="home" className="relative h-screen w-full overflow-hidden">
      {/* Background Slider */}
      <Swiper
        modules={[Pagination, Autoplay, EffectFade]}
        effect="fade"
        speed={1000}
        autoplay={{ delay: 5000, disableOnInteraction: false }}
        pagination={{
          clickable: true,
          bulletClass: "swiper-pagination-bullet custom-bullet",
          bulletActiveClass:
            "swiper-pagination-bullet-active custom-bullet-active",
        }}
        loop
        onSlideChange={(swiper) => setActiveIndex(swiper.realIndex)}
        className="absolute inset-0 h-full w-full"
      >
        {slides.map((slide) => (
          <SwiperSlide key={slide.id}>
            <div
              className="h-screen w-full bg-cover bg-center"
              style={{
                backgroundImage: `url(${slide.image})`,
              }}
            >
              {/* Dark Overlay */}
              <div className="absolute inset-0 bg-black/70" />
            </div>
          </SwiperSlide>
        ))}
      </Swiper>

      {/* Overlay Content - reduced z-index or allow pointer events to pass through wrapper */}
      <motion.div
        key={activeIndex}
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="absolute inset-0 z-10 flex items-center pointer-events-none"
      >
        <div className="container mx-auto px-4 pointer-events-auto">
          <div className="max-w-4xl text-white">
            <motion.h1
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-linear-to-r from-white via-primary to-red-600 bg-clip-text text-transparent"
            >
              {slides[safeActiveIndex].title}
            </motion.h1>

            <motion.h2
              variants={itemVariants}
              className="text-5xl md:text-6xl lg:text-7xl font-bold bg-linear-to-r from-white to-red-600 bg-clip-text text-transparent"
            >
              {slides[safeActiveIndex].subtitle}
            </motion.h2>

            <motion.p
              variants={itemVariants}
              className="mt-6 text-lg max-w-2xl text-white/80"
            >
              {slides[safeActiveIndex].description}
            </motion.p>

            <motion.div variants={itemVariants} className="mt-8">
              <Link to={slides[safeActiveIndex].buttonLink}>
                <Button className="px-6 py-5 flex items-center gap-3 group">
                  {slides[safeActiveIndex].buttonText}
                  <MoveRight className="group-hover:translate-x-1 transition" />
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Custom Styles for Dots */}
      <style>{`
    .swiper-pagination {
      position: absolute;
      bottom: 40px !important;
      left: 0 !important;
      width: 100% !important;
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 16px;
      z-index: 20;
      transform: none !important;
    }
    
    .custom-bullet {
      width: 16px; 
      height: 16px;
      background: rgba(255, 255, 255, 0.3);
      border-radius: 50%;
      cursor: pointer;
      transition: all 0.3s ease;
      border: 2px solid transparent;
    }
    
    .custom-bullet:hover {
      background: rgba(220, 38, 38, 0.6);
      transform: scale(1.2);
    }
    
    .custom-bullet-active {
      background: #ff0000 !important;
      transform: scale(1.3);
      box-shadow: 0 0 20px rgba(220, 38, 38, 0.4);
      border-color: rgba(220, 38, 38, 0.2);
      width: 18px;
      height: 18px;
    }
  `}</style>
    </section>
  );
};

export default Hero;
