"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FaBars, FaTimes, FaHome, FaBookOpen, FaPenAlt, FaTags, FaSearch, FaUser, FaUserTie, FaContao } from "react-icons/fa";
import { FiBookmark, FiFeather } from "react-icons/fi";

export default function BlogNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    const handleResize = () => {
      if (window.innerWidth >= 768) setMenuOpen(false);
    };

    window.addEventListener("scroll", handleScroll);
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  const navItems = [
    { label: "Home", path: "/", icon: <FaHome /> },
    { label: "Articles", path: "/articles", icon: <FaBookOpen /> },
    { label: "Categories", path: "/categories", icon: <FiBookmark /> },
    { label: "Tags", path: "/tags", icon: <FaTags /> },
    { label: "About", path: "/about", icon: <FaUser /> },
    { label: "Profile", path: "/profile", icon: <FaUserTie /> },
  ];

  const mobileMenuVariants = {
    hidden: { x: "100%" },
    visible: {
      x: 0,
      transition: { type: "spring", stiffness: 300, damping: 30 },
    },
    exit: {
      x: "100%",
      transition: { ease: "easeInOut", duration: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        type: "spring",
        stiffness: 400,
        damping: 20,
      },
    }),
  };

  return (
    <nav
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm shadow-sm" : "bg-white dark:bg-gray-900"
      }`}
    >
      <div className='container mx-auto px-4 sm:px-6 py-3 flex justify-between items-center'>
        {/* Logo */}
        <Link href='/' className='flex items-center group'>
          <motion.span
            className='text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent'
            whileHover={{ scale: 1.05 }}
            transition={{ type: "spring", stiffness: 400, damping: 10 }}
          >
            <span className='flex items-center'>
              <FiFeather className='mr-2' />
              BlogVerse
            </span>
          </motion.span>
        </Link>

        {/* Desktop Navigation */}
        <div className='hidden md:flex items-center space-x-1 lg:space-x-2'>
          {navItems.map(({ label, path, icon }, i) => (
            <motion.div key={label} custom={i} initial='hidden' animate='visible' variants={itemVariants}>
              <Link
                href={path}
                className={`relative group flex items-center gap-1.5 px-3 py-2 rounded-lg transition-colors ${
                  pathname === path
                    ? "text-purple-600 dark:text-purple-400 font-medium"
                    : "text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400"
                }`}
              >
                <span className={`${pathname === path ? "text-purple-600" : "opacity-70"}`}>{icon}</span>
                {label}
                <span
                  className={`absolute bottom-0 left-1/2 transform -translate-x-1/2 h-0.5 ${
                    pathname === path ? "w-4/5 bg-purple-600" : "w-0 bg-purple-600 group-hover:w-4/5"
                  } transition-all duration-300`}
                ></span>
              </Link>
            </motion.div>
          ))}

          {/* Write Button */}
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              href='/profile/newpost/'
              className='flex items-center gap-1.5 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-4 py-2 rounded-lg shadow hover:shadow-md transition-all'
            >
              <FaPenAlt className='text-sm' />
              <span className='text-sm font-medium'>Write</span>
            </Link>
          </motion.div>
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          className='md:hidden text-gray-700 dark:text-gray-300 p-2 rounded-lg focus:outline-none'
          onClick={() => setMenuOpen(true)}
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          aria-label='Open menu'
        >
          <FaBars className='text-xl' />
        </motion.button>

        {/* Mobile Sidebar Menu */}
        <AnimatePresence>
          {menuOpen && (
            <>
              <motion.div
                className='fixed h-screen top-0 bottom-0 right-0 left-0 bg-black/30 backdrop-blur-sm z-40'
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setMenuOpen(false)}
              />

              <motion.div
                className='fixed top-0 right-0 w-4/5 max-w-xs z-50 bg-white h-screen dark:bg-gray-800 shadow-xl flex flex-col'
                variants={mobileMenuVariants}
                initial='hidden'
                animate='visible'
                exit='exit'
              >
                <div className='flex justify-between items-center px-6 py-5  border-b border-gray-200 dark:border-gray-700'>
                  <span className='text-xl font-semibold text-gray-900 dark:text-gray-100'>Menu</span>
                  <motion.button
                    className='text-gray-700 dark:text-gray-300 p-1 rounded-full'
                    onClick={() => setMenuOpen(false)}
                    whileHover={{ rotate: 90 }}
                    whileTap={{ scale: 0.9 }}
                    aria-label='Close menu'
                  >
                    <FaTimes className='text-xl' />
                  </motion.button>
                </div>

                <div className='px-4 py-2'>
                  {navItems.map(({ label, path, icon }, i) => (
                    <motion.div key={label} custom={i} initial='hidden' animate='visible' variants={itemVariants}>
                      <Link
                        href={path}
                        className={`flex items-center gap-3 px-4 py-3 text-lg font-medium ${
                          pathname === path
                            ? "bg-purple-50 dark:bg-gray-700 text-purple-600 dark:text-purple-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                        } rounded-lg transition-colors`}
                        onClick={() => setMenuOpen(false)}
                      >
                        <span className={`${pathname === path ? "text-purple-600" : "opacity-70"}`}>{icon}</span>
                        {label}
                        {pathname === path && <span className='ml-auto w-2 h-2 bg-purple-600 rounded-full'></span>}
                      </Link>
                    </motion.div>
                  ))}
                </div>

                <div className='p-4 border-t border-gray-200 dark:border-gray-700 space-y-3'>
                  <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                    <Link
                      href='/profile/newpost/'
                      className='flex items-center justify-center gap-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white px-6 py-3 rounded-lg shadow hover:shadow-md transition-all'
                      onClick={() => setMenuOpen(false)}
                    >
                      <FaPenAlt />
                      <span className='font-medium'>Write Article</span>
                    </Link>
                  </motion.div>
                </div>
              </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    </nav>
  );
}
