"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { FaBars, FaTachometerAlt, FaBook, FaBriefcase, FaUsers, FaTimes } from "react-icons/fa";

export default function AdminSidebar() {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const adminLinks = [
    { title: "Dashboard", href: "/admin", icon: <FaTachometerAlt /> },
    { title: "Manage blogs", href: "/admin/blogs", icon: <FaBook /> },
    { title: "Manage Jobs", href: "/admin/jobs", icon: <FaBriefcase /> },
    { title: "Applications", href: "/admin/applications", icon: <FaUsers /> },
  ];

  return (
    <>
      {/* Sidebar Toggle Button (Mobile) */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-md bg-emerald-500 text-white md:hidden shadow-lg"
      >
        {isOpen ? <FaTimes size={24} /> : <FaBars size={24} />}
      </button>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-64 bg-white dark:bg-gray-900 shadow-lg p-6 border-r dark:border-gray-800 transition-transform duration-300 z-40 
        ${isOpen ? "translate-x-0" : "-translate-x-64"} md:translate-x-0`}
      >
        <h2 className="text-xl font-bold text-emerald-500 dark:text-emerald-400 mb-6">Admin Panel</h2>

        {/* Navigation Links */}
        <nav className="space-y-4">
          {adminLinks.map((link, index) => (
            <Link key={index} href={link.href} onClick={() => setIsOpen(false)}>
              <div
                className={`flex items-center p-3 rounded-md transition-all duration-300 cursor-pointer
                ${
                  pathname.startsWith(link.href)
                    ? "bg-emerald-500 text-white shadow-md"
                    : "text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-800"
                }
              `}
              >
                <span className="mr-3 text-lg">{link.icon}</span>
                {link.title}
              </div>
            </Link>
          ))}
        </nav>
      </aside>
    </>
  );
}
