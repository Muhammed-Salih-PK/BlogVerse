"use client";
import Link from "next/link";
import { motion } from "framer-motion";
import { containerVariants, itemVariants } from "@/lib/motionVariants";
const Hero = () => {
  return (
    <section className='relative min-h-[80vh] flex items-center justify-center bg-gradient-to-br from-gray-900 via-purple-900 to-violet-800 overflow-hidden px-4 py-20 md:py-32'>
      {/* Decorative elements */}
      <div className='absolute inset-0'>
        {/* Grid pattern overlay */}
        <div className='absolute inset-0 bg-grid-white/[0.05]'></div>

        {/* Floating gradient spheres */}
        <motion.div
          initial={{ x: -100, y: -100, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.5 }}
          className='absolute -top-20 -left-20 w-96 h-96 bg-purple-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float'
        ></motion.div>
        <motion.div
          initial={{ x: 100, y: 100, opacity: 0 }}
          animate={{ x: 0, y: 0, opacity: 0.2 }}
          transition={{ duration: 1.5, delay: 0.8 }}
          className='absolute -bottom-20 -right-20 w-96 h-96 bg-violet-600 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-float-delay'
        ></motion.div>
      </div>

      <div className='container mx-auto max-w-7xl relative z-10'>
        <motion.div initial='hidden' animate='visible' variants={containerVariants} className='flex flex-col items-center text-center'>
          {/* Badge */}
          <motion.div
            variants={itemVariants}
            className='mb-6 inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full border border-white/20'
          >
            <span className='mr-2 text-purple-300'>✨</span>
            <span className='text-sm font-medium text-white'>TRENDING THIS WEEK</span>
          </motion.div>

          {/* Main heading */}
          <motion.h1 variants={itemVariants} className='text-5xl md:text-7xl lg:text-8xl font-bold tracking-tight mb-6'>
            <span className='text-transparent bg-clip-text bg-gradient-to-r from-purple-300 via-pink-300 to-white'>BlogVerse</span>
          </motion.h1>

          {/* Subheading */}
          <motion.p variants={itemVariants} className='text-xl md:text-2xl text-white/80 max-w-3xl mx-auto mb-10 leading-relaxed'>
            Where modern developers share their insights on the latest in tech, design, and innovation.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div variants={itemVariants} className='flex flex-col sm:flex-row gap-4'>
            <Link
              href={"/articles"}
              className='px-8 py-4 bg-white text-gray-900 font-bold rounded-lg hover:bg-gray-100 transition-all duration-300 transform hover:scale-[1.02] shadow-lg hover:shadow-xl'
            >
              Explore Articles
            </Link>
            <Link
              href={"/signup"}
              className='px-8 py-4 bg-transparent text-white font-bold rounded-lg border-2 border-white/30 hover:border-white/60 transition-all duration-300 transform hover:scale-[1.02]'
            >
              Join Community
            </Link>
          </motion.div>
        </motion.div>
      </div>

      {/* Scrolling indicator */}
      <motion.div
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1.5 }}
        className='absolute bottom-10 left-1/2 transform -translate-x-1/2 animate-bounce'
      >
        <svg className='w-8 h-8 text-white/80' fill='none' stroke='currentColor' viewBox='0 0 24 24' xmlns='http://www.w3.org/2000/svg'>
          <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M19 14l-7 7m0 0l-7-7m7 7V3' />
        </svg>
      </motion.div>
    </section>
  );
};

export default Hero;
