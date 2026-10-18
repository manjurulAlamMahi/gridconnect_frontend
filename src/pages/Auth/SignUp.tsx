import useModal from "@/components/Modal/useModal";
import BackLink from "@/pages/Join/_components/BackLink";
import HeroImage from "@/assets/images/pexels-apasaric-4512439.jpg";
import TeamForm from "./Team";
import DriverForm from "./DriverForm";
import { useSEO } from "@/hooks/use-seo";

export default function SignUp() {
  const { getParams } = useModal();
  const role = getParams("role") || "driver";
  useSEO({
    title: `Sign Up as ${role === "team" ? "Team" : "Driver"}`,
    description:
      "Join GridConnect and connect with the racing community. Sign up today!",
    canonical: "https://www.gridconnect.app/join/signup",
    ogType: "website",
  });

  return (
    <section className="relative w-full min-h-screen flex items-center justify-center overflow-x-hidden py-0 md:py-8">
      <BackLink
        label="Back"
        to="/join"
        className="mb-6 inline-block fixed top-4 md:top-15 left-10 md:left-20 z-20"
      />
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: `url(${HeroImage})`,
          backgroundSize: "cover",
        }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/75" />
      <div className="absolute inset-0 bg-linear-to-b from-transparent via-black/30 to-black/80" />
      <div className="relative z-10 w-full max-w-full mx-auto px-6 flex justify-center my-8">
        <div className="w-full max-w-4xl">
          <div>{role === "team" ? <TeamForm /> : <DriverForm />}</div>
        </div>
      </div>
    </section>
  );
}
