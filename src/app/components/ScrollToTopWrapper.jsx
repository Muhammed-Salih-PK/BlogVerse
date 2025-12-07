"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Wraps page content and automatically scrolls to top
 * whenever the route changes.
 */
export default function ScrollToTopWrapper({ children }) {
  const pathname = usePathname();

  useEffect(() => {
    // Scroll to top on route change
    window.scrollTo({ top: 0, behavior: "auto" });
  }, [pathname]);

  return <>{children}</>;
}
