"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { FiFeather, FiHelpCircle } from "react-icons/fi";
import { BookOpen, Home, Tag, User, Settings, Bell, Bookmark, Search, PenTool, Hash, TrendingUp, Users, MessageSquare, Menu, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import ThemeToggle from "./ThemeToggle";

export default function BlogNavbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [notifications] = useState(3);
  const pathname = usePathname();

  const navItems = [
    { label: "Home", path: "/", icon: <Home className='w-4 h-4' /> },
    { label: "Articles", path: "/articles", icon: <BookOpen className='w-4 h-4' /> },
    { label: "Categories", path: "/categories", icon: <Hash className='w-4 h-4' /> },
    { label: "Tags", path: "/tags", icon: <Tag className='w-4 h-4' /> },
    { label: "Trending", path: "/trending", icon: <TrendingUp className='w-4 h-4' /> },
    { label: "Community", path: "/community", icon: <Users className='w-4 h-4' /> },
    { label: "About", path: "/about", icon: <FiHelpCircle className='w-4 h-4' /> },
  ];

  const userMenuItems = [
    { label: "Profile", path: "/profile", icon: <User className='w-4 h-4' /> },
    { label: "Bookmarks", path: "/bookmarks", icon: <Bookmark className='w-4 h-4' /> },
    { label: "Messages", path: "/messages", icon: <MessageSquare className='w-4 h-4' />, badge: 5 },
    { label: "Settings", path: "/settings", icon: <Settings className='w-4 h-4' /> },
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

  const searchVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 400, damping: 25 },
    },
    exit: {
      opacity: 0,
      y: -20,
      transition: { ease: "easeInOut", duration: 0.2 },
    },
  };

  const handleSearch = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      window.location.href = `/search?q=${encodeURIComponent(searchQuery)}`;
    }
  };

  return (
    <>
      <nav
        className={`fixed top-0 w-full z-50 transition-all duration-300 ${"bg-white dark:bg-[#0A0A0A] border-b border-gray-200/30 dark:border-gray-700/30"}`}
      >
        <div className='container mx-auto px-4 sm:px-6 lg:px-8 py-3'>
          <div className='flex items-center justify-between'>
            {/* Logo */}
            <div className='flex items-center gap-4'>
              <Link href='/' className='flex items-center gap-2 group'>
                <motion.div whileHover={{ rotate: 15 }} transition={{ type: "spring", stiffness: 400, damping: 10 }} className='relative'>
                  <div className='absolute inset-0 bg-gradient-to-r from-white/50 to-stone-300/50 rounded-lg blur opacity-30 group-hover:opacity-50 transition-opacity'></div>
                  <div className='relative w-8 h-8 bg-gradient-to-br from-white/50 to-stone-300/50 rounded-lg flex items-center justify-center'>
                    <FiFeather className='w-4 h-4 text-' />
                  </div>
                </motion.div>
                <motion.span
                  className='text-xl font-bold bg-gradient-to-r from-black/80 dark:from-white/80 to-stone-400 bg-clip-text text-transparent'
                  whileHover={{ scale: 1.02 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  BlogVerse
                </motion.span>
              </Link>

              {/* Desktop Navigation */}
              <div className='hidden lg:flex items-center gap-1 ml-8'>
                {navItems.map(({ label, path, icon }) => (
                  <Link
                    key={label}
                    href={path}
                    className={`relative group flex items-center gap-2 px-3 py-2 rounded-lg transition-all ${
                      pathname === path
                        ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 text-blue-600 dark:text-blue-400 font-medium"
                        : "text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-gray-800"
                    }`}
                  >
                    {icon}
                    <span>{label}</span>
                    {pathname === path && (
                      <motion.div
                        className='absolute bottom-0 left-1/2 transform -translate-x-1/2 w-1/2 h-0.5 bg-stone-800/25 dark:bg-stone-50/50 rounded-full'
                        layoutId='navbar-indicator'
                      />
                    )}
                  </Link>
                ))}
              </div>
            </div>

            {/* Right Side Actions */}
            <div className='flex items-center gap-3'>
              {/* Search */}
              <div className='hidden md:block'>
                <div className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4' />
                  <Input
                    type='text'
                    placeholder='Search articles...'
                    className='pl-10 pr-4 py-2 w-64 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    onKeyDown={(e) => e.key === "Enter" && handleSearch(e)}
                  />
                </div>
              </div>

              {/* Mobile Search Button */}
              <motion.button
                className='md:hidden text-gray-600 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:dark:bg-[#0A0A0A]'
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSearchOpen(!searchOpen)}
                aria-label='Search'
              >
                <Search className='w-5 h-5' />
              </motion.button>

              {/* Theme Toggle */}
              <div className='hidden lg:block'>
                <ThemeToggle />
              </div>

              {/* Notifications */}
              <div className='relative'>
                <Button variant='ghost' size='icon' className='relative hover:bg-gray-100 dark:hover:bg-gray-800' aria-label='Notifications'>
                  <Bell className='w-5 h-5' />
                  {notifications > 0 && (
                    <Badge className='absolute -top-1 -right-1 px-1.5 py-0.5 min-w-[18px] h-[18px] text-xs bg-red-500 border-2 border-white dark:border-gray-900'>
                      {notifications}
                    </Badge>
                  )}
                </Button>
              </div>

              {/* Write Button */}
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} className='hidden lg:block'>
                <Button className='gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' asChild>
                  <Link href='/profile'>
                    <PenTool className='w-4 h-4' />
                    <span className='hidden sm:inline'>Write</span>
                  </Link>
                </Button>
              </motion.div>

              {/* User Avatar */}
              <div className='relative'>
                <Link href='/profile'>
                  <Avatar className='h-9 w-9 border-2 border-gray-200 dark:border-gray-700 cursor-pointer hover:border-blue-500 transition-colors flex items-center justify-center'>
                    <User />
                  </Avatar>
                </Link>
              </div>

              {/* Mobile Menu Button */}
              <motion.button
                className='lg:hidden  dark:text-gray-200 p-2'
                onClick={() => setMenuOpen(true)}
                whileTap={{ scale: 0.9 }}
                aria-label='Open menu'
              >
                <Menu className='text-xl text-primary w-7 h-7 hover:bg-gray-100 dark:hover:bg-gray-800 rounded-md' />
              </motion.button>
            </div>
          </div>

          {/* Mobile Search Bar */}
          <AnimatePresence>
            {searchOpen && (
              <motion.div variants={searchVariants} initial='hidden' animate='visible' exit='exit' className='mt-3 md:hidden'>
                <form onSubmit={handleSearch} className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <Input
                    type='text'
                    placeholder='Search articles, tags, or authors...'
                    className='pl-10 pr-20 border-gray-300 dark:border-gray-600 focus:ring-2 focus:ring-blue-500'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    autoFocus
                  />
                  <Button type='submit' size='sm' className='absolute right-1 top-1/2 transform -translate-y-1/2 dark:bg-ededed bg-primary'>
                    Search
                  </Button>
                </form>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </nav>

      {/* Spacer for fixed navbar */}
      <div className='h-16'></div>

      {/* Mobile Sidebar Menu */}
      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              className='fixed inset-0 bg-black/50 backdrop-blur-sm z-40'
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              className='fixed top-0 right-0 w-80 max-w-full h-full z-50 bg-white dark:dark:bg-[#0A0A0A] shadow-2xl flex flex-col'
              variants={mobileMenuVariants}
              initial='hidden'
              animate='visible'
              exit='exit'
            >
              {/* Header */}
              <div className='flex items-center justify-between px-6 py-4 border-b border-gray-200 dark:border-gray-800'>
                <div className='flex items-center gap-3'>
                  <Avatar className='h-10 w-10 border-2 border-blue-500'>
                    <AvatarImage src='https://api.dicebear.com/7.x/avataaars/svg?seed=BlogVerse' />
                    <AvatarFallback className='bg-gradient-to-r from-blue-500 to-purple-500 text-white'>BV</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className='font-semibold text-gray-900 dark:text-white'>Welcome!</div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>BlogVerse Member</div>
                  </div>
                </div>
                <motion.button
                  className='text-gray-500 dark:text-gray-400 p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800'
                  onClick={() => setMenuOpen(false)}
                  whileTap={{ scale: 0.9 }}
                  aria-label='Close menu'
                >
                  <X className='text-xl' />
                </motion.button>
              </div>

              {/* Search in Mobile Menu */}
              <div className='px-6 py-4 border-b border-gray-200 dark:border-gray-800'>
                <form onSubmit={handleSearch} className='relative'>
                  <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400' />
                  <Input
                    type='text'
                    placeholder='Search BlogVerse...'
                    className='pl-10 border-gray-300 dark:border-gray-600'
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                  />
                </form>
              </div>

              {/* Navigation Links */}
              <div className='flex-1 overflow-y-auto py-4 '>
                <div className='px-4'>
                  <div className='mb-6'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2'>Navigation</div>
                    {navItems.map(({ label, path, icon }) => (
                      <Link
                        key={label}
                        href={path}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg mb-1 transition-colors ${
                          pathname === path
                            ? "bg-gradient-to-r from-blue-50 to-purple-50 dark:from-gray-800 dark:to-gray-800 text-blue-600 dark:text-blue-400"
                            : "text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800"
                        }`}
                        onClick={() => setMenuOpen(false)}
                      >
                        {icon}
                        <span className='font-medium'>{label}</span>
                        {pathname === path && <div className='ml-auto w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full'></div>}
                      </Link>
                    ))}
                  </div>

                  <div className='mb-6'>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2'>Account</div>
                    {userMenuItems.map(({ label, path, icon, badge }) => (
                      <Link
                        key={label}
                        href={path}
                        className='flex items-center gap-3 px-4 py-3 rounded-lg mb-1 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors'
                        onClick={() => setMenuOpen(false)}
                      >
                        {icon}
                        <span className='font-medium'>{label}</span>
                        {badge && <Badge className='ml-auto px-2 py-0.5 text-xs bg-red-500 border-0'>{badge}</Badge>}
                      </Link>
                    ))}
                  </div>

                  <div>
                    <div className='text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider px-4 mb-2'>Quick Links</div>
                    <div className='grid grid-cols-2 gap-2 px-4'>
                      <Button variant='outline' className='justify-start gap-2' asChild>
                        <Link href='/help'>
                          <FiHelpCircle />
                          Help Center
                        </Link>
                      </Button>
                      <Button variant='outline' className='justify-start gap-2' asChild>
                        <Link href='/contact'>
                          <MessageSquare />
                          Contact
                        </Link>
                      </Button>
                    </div>
                    <div className='outline mt-2 rounded-md mx-4 flex justify-between items-center p-2 bg-[#adadad]/5 '>
                      <span className="font-semibold">Theme Toggle</span>
                      <div className="outline rounded-full p-1 flex items-center justify-center">
                        <ThemeToggle />
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Footer */}
              <div className='p-6 border-t border-gray-200 dark:border-gray-800'>
                <Button className='w-full gap-2 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' asChild>
                  <Link href='/write' onClick={() => setMenuOpen(false)}>
                    <PenTool className='w-4 h-4' />
                    Write New Article
                  </Link>
                </Button>
                <div className='mt-4 text-center text-sm text-gray-500 dark:text-gray-400'>© 2024 BlogVerse. All rights reserved.</div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
