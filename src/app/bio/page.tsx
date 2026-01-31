"use client";

import { motion } from "framer-motion";

export default function Bio() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="aspect-3/4 bg-white/5 rounded-2xl overflow-hidden border border-white/10"
        >
          {/* Placeholder for bio image */}
          <div className="w-full h-full bg-neutral-900" />
        </motion.div>
        
        <div className="space-y-6">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-4xl font-bold tracking-tight"
          >
            Shinji No Sekai
          </motion.h1>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="space-y-4 text-muted-foreground leading-relaxed"
          >
            <p>
              I am an audio engineer dedicated to finding the perfect sound. 
              My journey began in the analog era and has evolved into the digital realm, 
              blending classic techniques with modern innovation.
            </p>
            <p>
              Based in Tokyo, I work with artists from around the globe to bring their 
              sonic visions to life. From mixing and mastering to full-scale production, 
              I treat every project with the precision and passion it deserves.
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
