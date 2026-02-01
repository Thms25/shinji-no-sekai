"use client";

import { useState } from "react";
import { Users, ChevronRight, Search } from "lucide-react";
import Link from "next/link";
import { motion } from "framer-motion";

interface Artist {
  id: string;
  displayName?: string;
  email: string;
  tracksCount?: number;
  role?: string;
}

export default function ArtistList({ initialArtists }: { initialArtists: Artist[] }) {
  const [searchTerm, setSearchTerm] = useState("");
  
  const filteredArtists = initialArtists.filter(artist => 
    (artist.displayName?.toLowerCase() || "").includes(searchTerm.toLowerCase()) ||
    artist.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
        <div className="flex items-center gap-2 mb-6">
          <Users size={20} className="text-primary" />
          <h2 className="text-xl font-semibold">Artists</h2>
        </div>

        <div className="relative mb-6">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground" size={18} />
          <input
            type="text"
            placeholder="Search artists..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-black/20 border border-white/10 rounded-lg pl-10 pr-4 py-2 focus:outline-none focus:ring-1 focus:ring-primary"
          />
        </div>

        {filteredArtists.length === 0 ? (
             <div className="text-center py-10 text-muted-foreground">
                No artists found.
             </div>
        ) : (
            <div className="space-y-2">
            {filteredArtists.map((artist, index) => (
                <motion.div
                key={artist.id}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.05 }}
                >
                <Link 
                    href={`/admin/artist/${artist.id}`}
                    className="flex items-center justify-between p-4 rounded-lg hover:bg-white/5 transition-colors group border border-transparent hover:border-white/10"
                >
                    <div className="flex items-center gap-4">
                    <div className="h-10 w-10 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center text-primary font-bold uppercase">
                        {artist.displayName?.[0] || artist.email[0]}
                    </div>
                    <div>
                        <div className="font-medium group-hover:text-primary transition-colors">{artist.displayName || "No Name"}</div>
                        <div className="text-sm text-muted-foreground">{artist.email}</div>
                    </div>
                    </div>
                    <div className="flex items-center gap-4">
                    <span className="text-sm text-muted-foreground">{artist.tracksCount || 0} tracks</span>
                    <ChevronRight size={18} className="text-muted-foreground group-hover:text-foreground transition-colors" />
                    </div>
                </Link>
                </motion.div>
            ))}
            </div>
        )}
      </div>
  );
}
