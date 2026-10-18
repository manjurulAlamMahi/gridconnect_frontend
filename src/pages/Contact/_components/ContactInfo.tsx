"use client";

import { motion, type Variants} from "framer-motion";
import {
  Facebook,
  FilePenLine,
  Globe,
  Instagram,
  Mail,
  MapPin,
  MessageCircle,
  Phone,
  Twitter,
  Youtube,
} from "lucide-react";
import {
  useGetContactInfoQuery,
  useGetSocialMediaQuery,
} from "@/redux/endpoints/home/home.api";

const socialIcons: Record<string, React.ReactNode> = {
  Facebook: <Facebook className="w-5 h-5" />,
  Instagram: <Instagram className="w-5 h-5" />,
  Twitter: <Twitter className="w-5 h-5" />,
  LinkedIn: <Globe className="w-5 h-5" />,
  Blogger: <Globe className="w-5 h-5" />,
  Messenger: <MessageCircle className="w-5 h-5" />,
  Youtube: <Youtube className="w-5 h-5" />,
  Whatsapp: <MessageCircle className="w-5 h-5" />,
};

const cardVariants: Variants = {
  hidden: { opacity: 0, x: 20 },
  visible: {
    opacity: 1,
    x: 0,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const ContactInfo = () => {
  const { data: contactInfoResponse, isLoading: contactLoading } =
    useGetContactInfoQuery();
  const { data: socialMediaResponse, isLoading: socialLoading } =
    useGetSocialMediaQuery();
  const contactInfo = contactInfoResponse?.data?.[0];

  return (
    <div className="space-y-6">
      {/* Contact Information */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-[#1a1a1a] p-8 rounded-xl border border-white/5 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-8 text-lg font-semibold border-b border-white/5 pb-4">
          <div className="p-2 bg-white/5 rounded-lg">
            <FilePenLine />
          </div>
          Contact <span className="text-primary">Information</span>
        </div>

        <div className="space-y-6">
          <InfoItem
            icon={<Mail className="w-4 h-4" />}
            label="Email"
            value={
              contactLoading
                ? "Loading..."
                : (contactInfo?.email ?? "info@gridconnect.com")
            }
          />
          <InfoItem
            icon={<Phone className="w-4 h-4" />}
            label="Phone"
            value={
              contactLoading
                ? "Loading..."
                : (contactInfo?.phone ?? "+44 20 7123 4567")
            }
          />
          <InfoItem
            icon={<MapPin className="w-4 h-4" />}
            label="Address"
            value={
              contactLoading
                ? "Loading..."
                : (contactInfo?.address ?? "123 GridConnect St, London, UK")
            }
          />
        </div>
      </motion.div>

      {/* Social Media */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        transition={{ delay: 0.2 }}
        className="bg-[#1a1a1a] p-8 rounded-xl border border-white/5 shadow-xl"
      >
        <div className="flex items-center gap-2 mb-6 text-lg font-semibold">
          <div className="p-2 bg-white/5 rounded-lg">
            <Globe />
          </div>
          Social Media
        </div>
        <div className="flex flex-wrap gap-4">
          {socialLoading ? (
            <div className="text-gray-400">Loading social media...</div>
          ) : (
            socialMediaResponse?.data?.map((social, idx) => {
              const icon = socialIcons[social.name];
              return (
                <motion.div
                  key={social.id}
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 + idx * 0.1 }}
                >
                  <SocialIcon
                    href={social.url}
                    icon={icon || <Globe className="w-5 h-5" />}
                  />
                </motion.div>
              );
            })
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default ContactInfo;

function InfoItem({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value?: string;
}) {
  return (
    <div className="flex justify-between items-center group">
      <div className="flex items-center gap-3 text-gray-400 group-hover:text-red-500 transition-colors">
        {icon} {label}
      </div>
      <span className="text-right text-gray-200 text-sm font-semibold">
        {value || "Not available"}
      </span>
    </div>
  );
}

function SocialIcon({ icon, href }: { icon: React.ReactNode; href?: string }) {
  return (
    <motion.a
      whileHover={{ scale: 1.1, backgroundColor: "#dc2626", color: "#ffffff" }}
      whileTap={{ scale: 0.9 }}
      href={href || "#"}
      target={href ? "_blank" : undefined}
      rel={href ? "noopener noreferrer" : undefined}
      className="p-2 text-red-600 rounded-lg transition-colors border border-red-600/20 block"
    >
      {icon}
    </motion.a>
  );
}
