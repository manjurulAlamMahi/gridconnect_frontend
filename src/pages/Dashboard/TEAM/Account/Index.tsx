import { ChevronLeft, ChevronRight } from "lucide-react";
import AccountSettings from "./_components/AccountSettings";
import { useSEO } from "@/hooks/use-seo";

export default function HomePage() {
  useSEO({
    title: "Account Settings",
    description: "Manage your account settings and preferences.",
  });

  return (
    <main className="min-h-screen text-white">
      <div className="flex gap-4">
        <p className="flex gap-2.5">
          <span>
            <ChevronLeft className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>{" "}
          <span>
            {" "}
            <ChevronRight className="border-2 border-[#CCD2D8] rounded-[6px] h-6 w-6" />
          </span>
        </p>
        <p className="text-sm font-medium">Account Control</p>
      </div>
      <p className="text-accent/60 mt-5">
        Manage your security settings and account preferences
      </p>
      <div className="w-full mx-auto">
        <h1 className="text-2xl font-semibold mb-6">Account Settings</h1>
        <AccountSettings />
      </div>
    </main>
  );
}
