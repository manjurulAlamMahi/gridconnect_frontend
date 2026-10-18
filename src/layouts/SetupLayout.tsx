import { Outlet } from "react-router";
import { useSEO } from "@/hooks/use-seo";

export default function SetupLayout() {
  useSEO({ noIndex: true });
  return <Outlet />;
}

