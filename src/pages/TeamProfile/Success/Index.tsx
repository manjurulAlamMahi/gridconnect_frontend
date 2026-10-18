import backgroundImage from "@/assets/images/GetStarted.svg";
import VerificationReadyStatic from "./_components/Verification_steps";
const SuccessPage = () => {
  return (
    <section className="relative min-h-screen w-screen flex items-center justify-center overflow-hidden py-8">
      {/* Background Layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${backgroundImage})` }}
        aria-hidden="true"
      />
      <div className="absolute inset-0 bg-black/90" aria-hidden="true" />
      <div className="relative z-10 w-full max-w-6xl mx-auto text-center px-4 md:px-6 ">
        <VerificationReadyStatic />
      </div>
    </section>
  );
};
export default SuccessPage;
