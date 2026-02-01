"use client";

import { motion } from "framer-motion";

export default function Work() {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-12 tracking-tight"
      >
        Selected Works
      </motion.h1>
      
      <p className="text-muted-foreground">Projects coming soon.</p>
    </div>
  );
}
