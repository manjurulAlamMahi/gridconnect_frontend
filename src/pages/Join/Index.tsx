import AccountType from "./_components/AccountType";
import BackLink from "./_components/BackLink";
import backgroundImage from "@/assets/images/hero.svg";
import { useSEO } from "@/hooks/use-seo";

const Join = () => {
  useSEO({
    title: "Join",
    description:
      "Connect with the racing community. Choose your role and join GridConnect.",
    canonical: "https://www.gridconnect.app/join",
    ogType: "website",
  });
  return (
    <section>
      <BackLink
        label="Back to Home"
        to="/"
        className="mb-6 inline-block fixed top-15 left-20 z-20"
      />
      <AccountType backgroundImage={backgroundImage} />
    </section>
  );
};

export default Join;
