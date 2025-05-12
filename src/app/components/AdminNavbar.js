"use client";

import ThemeToggle from "@/app/components/ThemeToggle";

export default function AdminNavbar() {
  return (
    <nav className="h-14 bg-white dark:bg-gray-900 shadow-md z-40 md:pl-64 transition-all flex items-center justify-end px-6">
      <ThemeToggle />
    </nav>
  );
}
