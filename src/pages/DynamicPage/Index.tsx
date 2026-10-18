import { motion } from "framer-motion";
import { useMemo } from "react";
import { useLocation } from "react-router";
import BackLink from "@/pages/Join/_components/BackLink";
import { Skeleton } from "@/components/ui/skeleton";
import { useSEO } from "@/hooks/use-seo";
import { useGetDynamicPageQuery } from "@/redux/endpoints/home/dynamicPage.api";

const toTitle = (slug: string) =>
  slug
    .split("-")
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");

export default function DynamicPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, "").trim();

  const fallbackTitle = useMemo(() => toTitle(slug || "Page"), [slug]);
  const { data, isLoading, isError } = useGetDynamicPageQuery(slug, {
    skip: !slug,
  });

  const pageTitle = data?.data?.page_title || fallbackTitle;

  useSEO({
    title: pageTitle,
    description: `${pageTitle} - GridConnect`,
    canonical: `https://www.gridconnect.app${pathname}`,
    ogType: "article",
  });

  return (
    <div className="relative min-h-screen bg-[#0d121c] text-white font-sans overflow-hidden">
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] rounded-full bg-primary/5 blur-[120px]" />
      </div>
      <div className="relative z-10 p-6 md:p-12 md:pt-24 pt-16 min-h-screen flex flex-col">
        <BackLink
          label="Back"
          className="mb-8 md:mb-0 md:fixed md:top-12 md:left-12 lg:left-20 z-20"
        />
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-linear-to-b from-white via-white to-white/60 pb-2">
            {pageTitle}
          </h1>
          <div className="h-px max-w-2xl bg-linear-to-r from-primary/0 via-primary to-primary/0 mx-auto mt-6 rounded-full" />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2, ease: "easeOut" }}
          className="flex-grow max-w-container w-full mx-auto backdrop-blur-xl bg-white/[0.02] p-8 md:p-12 lg:p-16 rounded-3xl border border-white/5 shadow-[0_8px_32px_rgba(0,0,0,0.4)] mb-12"
        >
          {isLoading ? (
            <div className="space-y-8">
              {[...Array(4)].map((_, i) => (
                <div key={i} className="space-y-3">
                  <Skeleton className="h-7 w-1/3 bg-white/5 rounded-md mb-4" />
                  <Skeleton className="h-4 w-full bg-white/5 rounded-md" />
                  <Skeleton className="h-4 w-11/12 bg-white/5 rounded-md" />
                  <Skeleton className="h-4 w-10/12 bg-white/5 rounded-md" />
                </div>
              ))}
            </div>
          ) : isError || !data?.data?.page_content ? (
            <div className="text-center py-20 flex flex-col items-center justify-center h-full">
              <p className="text-accent/50 text-lg">
                We could not load this page right now.
                <br />
                Please try again shortly.
              </p>
            </div>
          ) : (
            <div
              className={`prose prose-invert prose-lg max-w-none 
                         text-accent/80 leading-relaxed
                         [&>h1]:text-3xl [&>h1]:font-bold [&>h1]:text-white [&>h1]:mb-6 [&>h1]:mt-10
                         [&>h2]:text-2xl [&>h2]:font-semibold [&>h2]:text-white [&>h2]:mb-4 [&>h2]:mt-8
                         [&>h3]:text-xl [&>h3]:font-medium [&>h3]:text-white [&>h3]:mb-3 [&>h3]:mt-6
                         [&>p]:mb-6 [&>p]:text-[1.05rem] [&>p]:font-light [&>p]:leading-7
                         [&>ul]:mb-6 [&>ul]:list-disc [&>ul]:pl-6 [&>ul>li]:mb-2 [&>ul>li]:text-accent/80
                         [&>ol]:mb-6 [&>ol]:list-decimal [&>ol]:pl-6 [&>ol>li]:mb-2
                         [&>a]:text-primary [&>a]:underline [&>a:hover]:text-primary/80 transition-colors
                         [&>strong]:text-white [&>strong]:font-semibold
                         first:mt-0`}
              dangerouslySetInnerHTML={{ __html: data.data.page_content }}
            />
          )}
        </motion.div>
      </div>
    </div>
  );
}
