"use client";

import { motion } from "framer-motion";

const projects = [
  { id: 1, title: "Neon Genesis", artist: "Eva", genre: "Synthwave" },
  { id: 2, title: "Cyber City", artist: "Akira", genre: "Techno" },
  { id: 3, title: "Midnight Rain", artist: "Rain", genre: "Lo-Fi" },
  { id: 4, title: "Tokyo Drift", artist: "Drift", genre: "Phonk" },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

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
      
      <motion.div 
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
      >
        {projects.map((project) => (
          <motion.div
            key={project.id}
            variants={item}
            className="group relative aspect-square bg-white/5 rounded-lg overflow-hidden border border-white/10 hover:border-white/30 transition-colors cursor-pointer"
          >
            <div className="absolute inset-0 flex flex-col justify-end p-6 bg-linear-to-t from-black/80 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <h3 className="text-xl font-bold">{project.title}</h3>
              <p className="text-sm text-muted-foreground">{project.artist} • {project.genre}</p>
            </div>
            {/* Placeholder for project image */}
            <div className="w-full h-full flex items-center justify-center text-muted-foreground/20 text-6xl font-bold">
              {project.id}
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}
