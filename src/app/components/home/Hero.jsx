"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  BookOpen,
  TrendingUp,
  Users,
  Search,
  Sparkles,
  Target,
  Clock,
  Eye,
  Heart,
  MessageSquare,
  ChevronRight,
  Rocket,
  PenTool,
  Globe,
} from "lucide-react";

import SearchModal from "../SearchModal";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

const Hero = () => {
  const [currentStat, setCurrentStat] = useState(0);

  const popularTags = [
    { name: "Next.js", articleCount: 86, color: "from-blue-800 to-blue-600" },
    { name: "React", articleCount: 124, color: "from-cyan-800 to-blue-500" },
    { name: "TypeScript", articleCount: 92, color: "from-blue-800 to-indigo-600" },
    { name: "Tailwind", articleCount: 78, color: "from-teal-700 to-emerald-500" },
    { name: "Node.js", articleCount: 65, color: "from-green-800 to-emerald-600" },
    { name: "Web3", articleCount: 42, color: "from-purple-800 to-pink-500" },
  ];

  const stats = [
    { icon: <BookOpen size={20} />, label: "Articles Published", value: "5,280+" },
    { icon: <Users size={20} />, label: "Active Writers", value: "1,240+" },
    { icon: <Eye size={20} />, label: "Monthly Readers", value: "250K+" },
    { icon: <Globe size={20} />, label: "Countries", value: "120+" },
  ];

  const featuredArticles = [
    {
      title: "Building Modern Web Apps with Next.js 14",
      author: "Alex Johnson",
      readTime: "8 min",
      likes: 245,
      tags: ["Next.js", "React", "Web Dev"],
    },
    {
      title: "The Future of React Server Components",
      author: "Sarah Chen",
      readTime: "12 min",
      likes: 189,
      tags: ["React", "RSC", "Performance"],
    },
    {
      title: "TypeScript Best Practices for 2024",
      author: "David Park",
      readTime: "6 min",
      likes: 312,
      tags: ["TypeScript", "Best Practices"],
    },
  ];

  const fadeInUp = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 },
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  // Rotate stats every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStat((prev) => (prev + 1) % stats.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [stats.length]);

  return (
    <div className='relative overflow-hidden bg-gradient-to-br from-background via-background to-primary/5'>
      {/* Animated gradient backgrounds */}
      <div className='absolute inset-0 overflow-hidden'>
        <div className='absolute -top-40 -right-40 w-[500px] h-[500px] bg-gradient-to-br from-primary/20 via-primary/10 to-transparent rounded-full blur-3xl z-0 pointer-events-none' />
        <div className='absolute top-1/2 -left-40 w-[600px] h-[600px] bg-gradient-to-tr from-purple-500/10 via-purple-500/5 to-transparent rounded-full blur-3xl z-0 pointer-events-none' />
        <div className='absolute -bottom-40 right-1/4 w-[400px] h-[400px] bg-gradient-to-tl from-blue-500/10 to-transparent rounded-full blur-3xl z-0 pointer-events-none' />
        <div className='absolute inset-0 bg-grid-white/[0.02] bg-[size:20px_20px]' />
      </div>

      <div className='relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pt-20 lg:pb-32'>
        <div className='flex flex-col lg:flex-row items-center gap-12 lg:gap-16'>
          {/* Left Content */}
          <motion.div className='lg:w-1/2' initial='hidden' animate='visible' variants={staggerContainer}>
            <motion.div variants={fadeInUp} className='mb-8'>
              <Badge className='px-4 py-2 bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border-0'>
                <Sparkles className='w-4 h-4 mr-2' />
                AI-Powered Writing Experience
              </Badge>
            </motion.div>

            <motion.h1 variants={fadeInUp} className='text-5xl sm:text-6xl lg:text-7xl font-bold tracking-tight mb-6'>
              Where <span className='bg-gradient-to-r from-primary to-purple-600 bg-clip-text text-transparent'>Ideas</span> Meet{" "}
              <span className='bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent'>Innovation</span>
            </motion.h1>

            <motion.p variants={fadeInUp} className='text-xl text-muted-foreground mb-8 leading-relaxed max-w-2xl'>
              Join thousands of developers sharing knowledge, building careers, and shaping the future of technology. From tutorials to deep dives,
              find everything you need to grow.
            </motion.p>

            {/* Interactive Stats Carousel */}
            <motion.div variants={fadeInUp} className='mb-8'>
              <div className='relative h-20'>
                <AnimatePresence mode='wait'>
                  <motion.div
                    key={currentStat}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.5 }}
                    className='absolute inset-0'
                  >
                    <div className='flex items-center gap-4'>
                      <div className='p-3 rounded-xl bg-primary/10'>{stats[currentStat].icon}</div>
                      <div>
                        <div className='text-3xl font-bold'>{stats[currentStat].value}</div>
                        <div className='text-sm text-muted-foreground'>{stats[currentStat].label}</div>
                      </div>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
              <div className='flex gap-2 mt-4'>
                {stats.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentStat(index)}
                    className={`w-2 h-2 rounded-full transition-all ${currentStat === index ? "bg-primary w-8" : "bg-muted hover:bg-primary/50"}`}
                  />
                ))}
              </div>
            </motion.div>

            {/* Enhanced Search Bar */}

            <SearchModal />

            {/* Trending Topics */}
            <motion.div variants={fadeInUp} className='mb-8'>
              <div className='flex items-center gap-2 mb-3'>
                <Target className='w-4 h-4 text-primary' />
                <span className='text-sm font-medium text-muted-foreground'>Trending Topics</span>
              </div>
              <div className='flex flex-wrap gap-2'>
                {popularTags.map((tag, index) => (
                  <motion.div
                    key={tag.name}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ y: -2 }}
                  >
                    <Link
                      href={`/tags/${tag.name.toLowerCase()}`}
                      className={`group relative inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r ${tag.color} text-white hover:shadow-lg transition-all duration-300`}
                    >
                      <span className='font-medium'>#{tag.name}</span>
                      <span className='text-xs bg-white/20 px-2 py-0.5 rounded-full'>{tag.articleCount}</span>
                      <div className='absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors rounded-full' />
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* CTA Buttons */}
            <motion.div variants={fadeInUp} className='flex flex-col sm:flex-row gap-4'>
              <Button size='lg' className='gap-3 group' asChild>
                <Link href='/signup'>
                  <PenTool className='w-5 h-5' />
                  Start Writing Free
                  <ArrowRight className='w-5 h-5 group-hover:translate-x-1 transition-transform' />
                </Link>
              </Button>
              <Button size='lg' variant='outline' className='gap-3' asChild>
                <Link href='/articles'>
                  <BookOpen className='w-5 h-5' />
                  Explore Articles
                </Link>
              </Button>
            </motion.div>
          </motion.div>

          {/* Right Content - Interactive Preview */}
          <motion.div className='lg:w-1/2' initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
            <div className='relative'>
              {/* Main Preview Card */}
              <div className='relative bg-gradient-to-br from-background via-background to-primary/5 backdrop-blur-sm border border-primary/20 rounded-2xl shadow-2xl overflow-hidden group'>
                {/* Card Header */}
                <div className='p-6 border-b border-border'>
                  <div className='flex items-center justify-between mb-4'>
                    <div className='flex items-center gap-3'>
                      <div className='w-12 h-12 bg-gradient-to-br from-primary to-primary/60 rounded-full flex items-center justify-center'>
                        <Rocket className='w-6 h-6 text-white' />
                      </div>
                      <div>
                        <div className='font-bold'>Featured Article</div>
                        <div className='text-sm text-muted-foreground'>Just published</div>
                      </div>
                    </div>
                    <Badge className='bg-gradient-to-r from-amber-500 to-orange-500'>
                      <TrendingUp className='w-3 h-3 mr-1' />
                      Trending
                    </Badge>
                  </div>

                  <h3 className='text-xl font-bold mb-3 group-hover:text-primary transition-colors'>The Complete Guide to Modern Web Development</h3>

                  <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                    <span className='flex items-center gap-1'>
                      <Clock className='w-4 h-4' />
                      12 min read
                    </span>
                    <span className='flex items-center gap-1'>
                      <Eye className='w-4 h-4' />
                      2.4K views
                    </span>
                  </div>
                </div>

                {/* Interactive Content Area */}
                <div className='p-6'>
                  <div className='grid grid-cols-3 gap-4 mb-6'>
                    {["Frontend", "Backend", "DevOps"].map((topic) => (
                      <div key={topic} className='p-4 rounded-xl bg-secondary hover:bg-primary/5 transition-colors cursor-pointer group/item'>
                        <div className='text-lg font-bold mb-2'>{topic}</div>
                        <div className='text-xs text-muted-foreground group-hover/item:text-primary transition-colors'>Learn more →</div>
                      </div>
                    ))}
                  </div>

                  {/* Stats Visualization */}
                  <div className='mb-6'>
                    <div className='flex items-center justify-between mb-3'>
                      <span className='text-sm font-medium'>Article Engagement</span>
                      <span className='text-xs text-muted-foreground'>Last 7 days</span>
                    </div>
                    <div className='flex items-end h-24 gap-1'>
                      {[40, 65, 80, 95, 75, 60, 85].map((height, index) => (
                        <div
                          key={index}
                          className='flex-1 bg-gradient-to-t from-primary/20 to-primary/40 rounded-t-lg transition-all hover:opacity-80'
                          style={{ height: `${height}%` }}
                        />
                      ))}
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className='flex items-center justify-between'>
                    <div className='flex gap-3'>
                      <Button size='sm' variant='outline' className='gap-2'>
                        <Heart className='w-4 h-4' />
                        245
                      </Button>
                      <Button size='sm' variant='outline' className='gap-2'>
                        <MessageSquare className='w-4 h-4' />
                        42
                      </Button>
                    </div>
                    <Button size='sm' className='gap-2 group/read'>
                      Read Article
                      <ChevronRight className='w-4 h-4 group-hover/read:translate-x-1 transition-transform' />
                    </Button>
                  </div>
                </div>
              </div>

              {/* Recent Articles List */}
              <div className='mt-8 space-y-3'>
                {featuredArticles.map((article, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 + index * 0.1 }}
                    whileHover={{ x: 4 }}
                  >
                    <div className='p-4 rounded-xl bg-secondary/50 backdrop-blur-sm border border-border hover:border-primary/30 transition-all group'>
                      <div className='flex items-start justify-between'>
                        <div className='flex-1'>
                          <h4 className='font-semibold mb-2 group-hover:text-primary transition-colors'>{article.title}</h4>
                          <div className='flex items-center gap-4 text-sm text-muted-foreground'>
                            <span>By {article.author}</span>
                            <span className='flex items-center gap-1'>
                              <Clock className='w-3 h-3' />
                              {article.readTime}
                            </span>
                            <span className='flex items-center gap-1'>
                              <Heart className='w-3 h-3' />
                              {article.likes}
                            </span>
                          </div>
                        </div>
                        <ChevronRight className='w-5 h-5 text-muted-foreground group-hover:text-primary transition-colors' />
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Scroll Indicator */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1 }}
        className='absolute bottom-8 left-1/2 transform -translate-x-1/2 hidden md:block'
      >
        <div
          className='animate-bounce cursor-pointer flex justify-center items-center flex-col'
          onClick={() => window.scrollTo({ top: window.innerHeight, behavior: "smooth" })}
        >
          <div className='w-6 h-10 border-2 border-primary/30 rounded-full flex justify-center'>
            <div className='w-1 h-3 bg-primary/50 rounded-full mt-2'></div>
          </div>
          <div className='text-xs text-muted-foreground text-center mt-2'>Scroll to explore</div>
        </div>
      </motion.div>
    </div>
  );
};

export default Hero;
