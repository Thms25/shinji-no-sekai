"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { Play, Clock, Calendar } from "lucide-react";

// Mock data type
interface Track {
  id: string;
  title: string;
  artist: string;
  updatedAt: string;
  status: "In Progress" | "Mixed" | "Mastered";
  duration: string;
}

const mockTracks: Track[] = [
  { id: "1", title: "Midnight Drive", artist: "Eva", updatedAt: "2024-01-20", status: "Mixed", duration: "3:45" },
  { id: "2", title: "Neon Rain", artist: "Eva", updatedAt: "2024-01-15", status: "In Progress", duration: "4:12" },
  { id: "3", title: "Cyber Funk", artist: "Eva", updatedAt: "2024-01-10", status: "Mastered", duration: "3:30" },
];

export default function Dashboard() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tracks, setTracks] = useState<Track[]>(mockTracks); // In real app, fetch from Firestore based on user.uid

  useEffect(() => {
    if (!loading && !user) {
      router.push("/login");
    }
  }, [user, loading, router]);

  if (loading || !user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Artist Dashboard</h1>
          <p className="text-muted-foreground mt-1">Welcome back, {user.email}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {tracks.map((track, index) => (
          <motion.div
            key={track.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.1 }}
          >
            <Link 
              href={`/dashboard/track/${track.id}`}
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
    </div>
  );
}
