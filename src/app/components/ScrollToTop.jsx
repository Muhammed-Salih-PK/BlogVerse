"use client";

import { motion } from "framer-motion";
import { ChevronUp } from "lucide-react";

export default function ScrollToTop() {
  const scrollToTop = () => {
    if (typeof window !== "undefined") {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  return (
    <motion.button
      onClick={scrollToTop}
      className='fixed bottom-6 right-6 p-3 rounded-full bg-primary text-primary-foreground shadow-lg hover:shadow-xl transition-all z-50'
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
    >
      <ChevronUp className='w-5 h-5' />
    </motion.button>
  );
}
