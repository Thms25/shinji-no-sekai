"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Clock, Calendar } from "lucide-react";

export interface Track {
  id: string;
  title: string;
  artist: string;
  updatedAt: string;
  status: "In Progress" | "Mixed" | "Mastered";
  duration: string;
}

interface TrackListProps {
  tracks: Track[];
  basePath?: string; // e.g. "/dashboard/track" or "/admin/track"
}

export default function TrackList({ tracks, basePath = "/dashboard/track" }: TrackListProps) {
  return (
    <div className="grid grid-cols-1 gap-4">
      {tracks.map((track, index) => (
        <motion.div
          key={track.id}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 }}
        >
          <Link 
            href={`${basePath}/${track.id}`}
            className="block group bg-white/5 border border-white/10 rounded-xl p-4 hover:border-primary/50 transition-all hover:bg-white/10"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:scale-110 transition-transform">
                  <Play size={20} fill="currentColor" />
                </div>
                <div>
                  <h3 className="font-semibold text-lg group-hover:text-primary transition-colors">{track.title}</h3>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                    <span className="flex items-center gap-1"><Clock size={14} /> {track.duration}</span>
                    <span className="flex items-center gap-1"><Calendar size={14} /> {track.updatedAt}</span>
                    {/* Optionally show artist name if admin view */}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center gap-4">
                <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                  track.status === 'Mastered' ? 'bg-green-500/10 text-green-500 border-green-500/20' :
                  track.status === 'Mixed' ? 'bg-blue-500/10 text-blue-500 border-blue-500/20' :
                  'bg-yellow-500/10 text-yellow-500 border-yellow-500/20'
                }`}>
                  {track.status}
                </span>
              </div>
            </div>
          </Link>
        </motion.div>
      ))}
    </div>
  );
}
