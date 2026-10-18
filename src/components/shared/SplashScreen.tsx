import LogoIcon from "@/assets/Icons/Logo.svg";
import { cn } from "@/lib/utils";

interface SplashScreenProps {
  finishLoading?: boolean;
}

const SplashScreen = ({ finishLoading = false }: SplashScreenProps) => {
  return (
    <div
      className={cn(
        "fixed inset-0 z-50 flex items-center justify-center bg-background transition-all duration-700 ease-in-out",
        finishLoading ? "opacity-0 pointer-events-none" : "opacity-100"
      )}
    >
      <div
        className={cn(
          "flex flex-col items-center transition-transform duration-700",
          finishLoading ? "scale-110" : "scale-100"
        )}
      >
        <img
          src={LogoIcon}
          alt="GridConnect Logo"
          className="w-32 h-32 md:w-48 md:h-48 mb-4 animate-pulse"
        />
        {/* <div className="flex flex-col items-center font-bold text-3xl md:text-4xl text-accent leading-tight">
          <span className="tracking-wide">Grid</span>
          <span className="-mt-2">Connect</span>
        </div> */}
      </div>
    </div>
  );
};

export default SplashScreen;
