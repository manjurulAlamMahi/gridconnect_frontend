import { useSEO } from "@/hooks/use-seo";
import Features from "./_components/CoreFeature";
import Hero from "./_components/Hero";
import HowItWorks from "./_components/HowItWorks";
import Pricing from "./_components/Pricing";
import Subscribe from "./_components/Subscribe";

const Home = () => {
  useSEO({
    title: "Home",
    description:
      "GridConnect – The ultimate platform bridging racing drivers and teams.",
    canonical: "https://www.gridconnect.app/",
    ogImage: "https://www.gridconnect.app/Logo.svg",
    ogType: "website",
    jsonLd: {
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "GridConnect",
      url: "https://www.gridconnect.app/",
      potentialAction: {
        "@type": "SearchAction",
        target:
          "https://www.gridconnect.app/team/dashboard/search-driver?q={search_term_string}",
        "query-input": "required name=search_term_string",
      },
    },
  });

  return (
    <main>
      <Hero />
      {/* <HighlightStats /> */}
      <HowItWorks />
      <Features />
      <Pricing />
      <Subscribe />
    </main>
  );
};
export default Home;
