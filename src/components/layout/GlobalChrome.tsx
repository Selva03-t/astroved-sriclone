"use client";

import { usePathname } from "next/navigation";
import Footer from "@/components/layout/Footer";
import AIAssistant from "@/components/ui/AIAssistant";

export default function GlobalChrome() {
  const pathname = usePathname();

  // Hide floating chat + site footer on auth pages and the admin panel,
  // so the login/registration screens look clean.
  const shouldHideOnAuth = pathname?.startsWith("/auth") ?? false;
  const shouldHideOnAdminPanel = pathname?.startsWith("/admin") ?? false;
  const shouldHide = shouldHideOnAuth || shouldHideOnAdminPanel;

  return (
    <>
      {!shouldHide && <div data-global-chrome="assistant"><AIAssistant /></div>}
      {!shouldHide && <Footer />}
    </>
  );
}
