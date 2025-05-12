"use client";

import { usePathname } from "next/navigation";
import Navbar from "./Navbar";

export default function NavWrapper() {
  const pathname = usePathname();
  const isAdminRoute = pathname.startsWith("/admin");

  return isAdminRoute ? null : <Navbar />;
}
