import { parse } from 'node-html-parser';
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import useModal from "./useModal";
import { useGetTokenPackagesQuery, useBuyTokenMutation } from "@/redux/endpoints/token/token.api";
import { motion, type Variants } from "framer-motion";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";

type TokenPackagesModalProps = {
  role: string;
};

type TokenPackage = {
  key: string;
  title: string;
  subtitle?: string;
  price: string;
  frequency: string;
  popular?: boolean;
};

const itemVariants: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: { duration: 0.5, ease: "easeOut" },
  },
};

const modalVariants: Variants = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.3, ease: "easeOut" },
  },
};

export default function TokenPackagesModal({ role }: TokenPackagesModalProps) {
  const { Modal } = useModal();
  const { data, isLoading, error } = useGetTokenPackagesQuery(
    { role },
    { refetchOnMountOrArgChange: true },
  );
  const [buyToken] = useBuyTokenMutation();
  const [loadingPackageId, setLoadingPackageId] = useState<string | null>(null);

  // console.log('TokenPackagesModal data:', data);
  // console.log('TokenPackagesModal isLoading:', isLoading);
  // console.log('TokenPackagesModal error:', error);

  const handleBuyNow = async (packageId: string) => {
    setLoadingPackageId(packageId);
    try {
      localStorage.setItem("last_token_package_id", packageId);
      const res = await buyToken({ package_id: packageId }).unwrap();
      if (res.data?.checkout_url) {
        window.location.href = res.data.checkout_url;
      } else {
        toast.error("Checkout URL not found");
      }
    } catch (err) {
      const error = err as { data?: { message?: string } };
      toast.error(error?.data?.message || "Failed to initiate purchase");
    } finally {
      setLoadingPackageId(null);
    }
  };

  const apiPackages: TokenPackage[] =
    data?.data?.packages?.map((pack) => ({
      key: pack.id.toString(),
      title: pack.name || "Token Package",
      subtitle: pack.description || undefined,
      price: `$ ${pack.price ? parseFloat(pack.price).toFixed(0) : "0"}`,
      frequency: `for ${pack.tokens} Tokens`,
      popular: pack.is_popular,
    })) || [];

  // console.log('apiPackages:', apiPackages);

  const packages = apiPackages;

  return (
    <Modal
      modalId="package"
      openId="token-packages"
      className="w-[95vw] max-w-4xl bg-[#111114] border border-white/10 rounded-2xl p-0 shadow-2xl"
    >
      <motion.div
        className="p-5 md:p-7"
        variants={modalVariants}
        initial="hidden"
        animate="visible"
      >
        <div className="text-center mb-6">
          <motion.h3
            className="text-xl md:text-2xl font-bold text-white"
            variants={itemVariants}
            initial="hidden"
            animate="visible"
          >
            Buy Tokens
          </motion.h3>
          <p className="text-white/60 text-sm mt-1">
            Select a token package that fits your need
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {isLoading ? (
            [1, 2, 3].map((item) => (
              <div
                key={item}
                className="rounded-xl border border-white/10 bg-[#17171b] p-4 space-y-3"
              >
                <Skeleton className="h-5 w-24 bg-white/10" />
                <Skeleton className="h-4 w-36 bg-white/10" />
                <Skeleton className="h-8 w-28 bg-white/10" />
                <Skeleton className="h-10 w-full rounded-lg bg-white/10" />
              </div>
            ))
          ) : error ? (
            <div className="col-span-full text-center py-8">
              <p className="text-red-400">Failed to load token packages</p>
              <p className="text-white/60 text-sm mt-2">{JSON.stringify(error)}</p>
            </div>
          ) : packages.length === 0 ? (
            <div className="col-span-full text-center py-8">
              <p className="text-white/60">No token packages available</p>
            </div>
          ) : (
            packages.map((pack, index) => (
              <motion.div
                key={pack.key}
                className={`rounded-xl border p-4 bg-[#17171b] ${
                  pack.popular
                    ? "border-primary shadow-[0_0_30px_-20px_rgba(205,5,0,0.8)]"
                    : "border-white/10"
                }`}
                variants={itemVariants}
                initial="hidden"
                animate="visible"
                transition={{ delay: index * 0.1 }}
                whileHover={{
                  scale: 1.02,
                  boxShadow: "0 10px 30px rgba(205,5,0,0.3)",
                  borderColor: "rgba(205,5,0,0.5)",
                }}
                whileTap={{ scale: 0.98 }}
              >
                {pack.popular && (
                  <div className="mb-3 inline-flex rounded-full bg-primary/20 text-primary text-[11px] px-2.5 py-1 font-semibold">
                    Most Popular
                  </div>
                )}

                <motion.h4
                  className="text-white text-lg font-semibold"
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  transition={{ delay: index * 0.1 + 0.2 }}
                >
                  {pack.title}
                </motion.h4>
                {pack.subtitle && (
                  <div className="text-white/60 text-xs mt-2 min-h-24 space-y-1.5">
                    {parse(pack.subtitle)
                      .childNodes.map((node) => node.textContent?.trim())
                      .filter(Boolean)
                      .map((point, idx) => (
                        <div key={idx} className="flex gap-2 items-start">
                          <svg className="w-3.5 h-3.5 mt-0.5 text-primary shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                          </svg>
                          <span>{point}</span>
                        </div>
                      ))}
                  </div>
                )}
                {!pack.subtitle && <div className="min-h-24" />}

                <div className="mt-3 flex items-end gap-1">
                  <span className="text-2xl font-bold text-white">{pack.price}</span>
                  <span className="text-xs text-white/60 mb-1">{pack.frequency}</span>
                </div>

                <Button
                  className="w-full mt-4 h-10 bg-linear-to-b from-primary to-primary/60 hover:brightness-110 cursor-pointer"
                  onClick={() => handleBuyNow(pack.key)}
                  disabled={loadingPackageId === pack.key}
                >
                  {loadingPackageId === pack.key ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Buy Now"
                  )}
                </Button>
              </motion.div>
            ))
          )}
        </div>
      </motion.div>
    </Modal>
  );
}
