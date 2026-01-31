"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-64px)] p-8 sm:p-20 font-sans">
      <main className="flex flex-col gap-8 row-start-2 items-center text-center max-w-3xl">
        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-5xl sm:text-7xl font-bold tracking-tighter"
        >
          SHINJI NO SEKAI
        </motion.h1>
        
        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          className="text-xl text-muted-foreground"
        >
          Audio Engineer & Sound Designer based in Tokyo. 
          Crafting immersive sonic experiences.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
          className="flex gap-4 items-center flex-col sm:flex-row"
        >
          <Link
            href="/work"
            className="rounded-full border border-solid border-transparent transition-colors flex items-center justify-center bg-foreground text-background gap-2 hover:bg-[#383838] hover:text-white dark:hover:bg-[#ccc] text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5"
          >
            View Work
          </Link>
          <Link
            href="/contact"
            className="rounded-full border border-solid border-white/20 transition-colors flex items-center justify-center hover:bg-white/10 text-sm sm:text-base h-10 sm:h-12 px-4 sm:px-5 sm:min-w-44"
          >
            Contact Me <ArrowRight size={16} className="ml-2" />
          </Link>
        </motion.div>
      </main>
    </div>
  );
}
