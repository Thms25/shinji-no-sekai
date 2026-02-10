"use client";

import { motion } from "framer-motion";
import { useEffect, useState } from "react";
import type { WorkPageContent, WorkArtist } from "@/utils/db/content";
import Link from "next/link";

const FALLBACK_WORK_CONTENT: WorkPageContent = {
  artists: [],
};

function getSpotifyArtistId(artist: WorkArtist): string | null {
  if (artist.spotify_id) return artist.spotify_id;
  if (!artist.spotify_url) return null;
  const m = artist.spotify_url.match(/spotify\.com\/artist\/([a-zA-Z0-9]+)/);
  return m ? m[1] : null;
}

function ArtistCard({ artist }: { artist: WorkArtist }) {
  const spotifyLink =
    artist.spotify_url || (artist.spotify_id ? `https://open.spotify.com/artist/${artist.spotify_id}` : null);
  const spotifyEmbedId = getSpotifyArtistId(artist);

  return (
    <motion.article
      whileHover={{ y: -4 }}
      className="group relative overflow-hidden rounded-2xl border border-white/10 bg-white/5 p-5 sm:p-6 flex flex-col gap-4"
    >
      <div className="flex gap-4">
        {artist.image && (
          <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-white/10">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={artist.image}
              alt={artist.name}
              className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        )}
        <div className="flex-1">
          <h2 className="text-lg font-semibold tracking-tight">
            {artist.name}
          </h2>
          {artist.roles && artist.roles.length > 0 && (
            <div className="mt-1 flex flex-wrap gap-1.5">
              {artist.roles.map((role, idx) => (
                <span
                  key={idx}
                  className="rounded-full bg-white/10 px-2.5 py-0.5 text-xs font-medium text-muted-foreground"
                >
                  {role}
                </span>
              ))}
            </div>
          )}
        </div>
      </div>

      {artist.description && (
        <p className="text-sm text-muted-foreground leading-relaxed">
          {artist.description}
        </p>
      )}

      {spotifyLink && (
        <div className="mt-auto pt-2 space-y-3">
          {spotifyEmbedId && (
            <div className="rounded-xl overflow-hidden bg-[#181818] border border-white/10">
              <iframe
                title={`${artist.name} on Spotify`}
                src={`https://open.spotify.com/embed/artist/${spotifyEmbedId}`}
                width="100%"
                height="152"
                frameBorder="0"
                allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture"
                loading="lazy"
                className="block"
              />
            </div>
          )}
          <Link
            href={spotifyLink}
            target="_blank"
            rel="noreferrer"
            className="inline-flex items-center text-xs font-medium text-primary hover:text-primary/80"
          >
            Listen on Spotify
          </Link>
        </div>
      )}
    </motion.article>
  );
}

export default function Work() {
  const [content, setContent] = useState<WorkPageContent | null>(null);

  useEffect(() => {
    const fetchContent = async () => {
      try {
        const res = await fetch("/api/content?page=work", {
          cache: "no-store",
        });
        if (!res.ok) {
          throw new Error("Failed to load work content");
        }
        const data = await res.json();
        if (data.content) {
          setContent({
            ...FALLBACK_WORK_CONTENT,
            ...data.content,
          });
        }
      } catch (err) {
        console.error(err);
      }
    };

    fetchContent();
  }, []);

  const workContent = content ?? FALLBACK_WORK_CONTENT;
  const hasArtists = workContent.artists.length > 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-4xl font-bold mb-12 tracking-tight"
      >
        Selected Work
      </motion.h1>

      {!hasArtists && (
        <p className="text-muted-foreground">
          Projects coming soon. Check back as new work is added.
        </p>
      )}

      {hasArtists && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
        >
          {workContent.artists.map((artist, idx) => (
            <ArtistCard key={idx} artist={artist} />
          ))}
        </motion.div>
      )}
    </div>
  );
}
