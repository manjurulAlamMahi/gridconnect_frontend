import { useMediaQuery } from "@/hooks/use-media-query";
import MobileNavigation from "./_components/MobileNavigation";
import Navigation from "./_components/Navigation";
import Logo from "@/components/shared/Logo";

export default function Header() {
  const isMobile = useMediaQuery("(max-width: 768px)");
  return (
    <header className="fixed top-0 z-50 w-full text-accent">
      <nav className="w-full">
        <div className="mx-auto flex w-full items-center justify-between px-4 py-4">
          {isMobile ? (
            <>
              <Logo />
              <MobileNavigation />
            </>
          ) : (
            <Navigation />
          )}
        </div>
      </nav>
    </header>
  );
}
