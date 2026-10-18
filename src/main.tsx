import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { Toaster } from "sonner";
import "./index.css";
import Providers from "./providers";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers />
    <Toaster richColors position="top-right" />
  </StrictMode>
);
