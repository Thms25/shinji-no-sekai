"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import RegionsPlugin from "wavesurfer.js/dist/plugins/regions.js";
import { Play, Pause, SkipBack, SkipForward, MessageSquarePlus } from "lucide-react";

interface WaveformPlayerProps {
  url: string;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
  onAddComment?: (time: number) => void;
  comments?: any[]; // Array of comments with timestamps
  activeCommentId?: string | null;
}

export default function WaveformPlayer({ url, onReady, onTimeUpdate, onAddComment, comments = [], activeCommentId }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const regions = useRef<RegionsPlugin | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    // Initialize Regions Plugin
    const wsRegions = RegionsPlugin.create();
    regions.current = wsRegions;

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#4b5563",
      progressColor: "#3b82f6",
      cursorColor: "#3b82f6",
      barWidth: 2,
      barGap: 3,
      height: 100,
      normalize: true,
      plugins: [wsRegions],
    });

    wavesurfer.current.load(url);

    wavesurfer.current.on("ready", () => {
      setDuration(wavesurfer.current?.getDuration() || 0);
      onReady?.();
    });

    wavesurfer.current.on("audioprocess", () => {
      const time = wavesurfer.current?.getCurrentTime() || 0;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    });

    wavesurfer.current.on("seek", () => {
      const time = wavesurfer.current?.getCurrentTime() || 0;
      setCurrentTime(time);
      onTimeUpdate?.(time);
    });

    wavesurfer.current.on("finish", () => {
      setIsPlaying(false);
    });

    return () => {
      wavesurfer.current?.destroy();
    };
  }, [url]);

  // Sync comments to regions/markers
  useEffect(() => {
    if (!regions.current || !wavesurfer.current) return;
    
    regions.current.clearRegions();
    
    comments.forEach(comment => {
        if (comment.timestamp) {
            regions.current?.addRegion({
                start: comment.timestamp,
                end: comment.timestamp, // Marker-like behavior
                color: comment.solved ? "rgba(0, 255, 0, 0.5)" : "rgba(250, 129, 18, 0.8)", // Green if solved, Accent Orange if not
                drag: false,
                resize: false,
                id: comment.id,
                content: "💬", // Optional content
            });
        }
    });

  }, [comments, url]); // Re-run when comments change or url changes (new version)

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
    }
  };

  const handleAddCommentClick = () => {
    if (wavesurfer.current) {
        const time = wavesurfer.current.getCurrentTime();
        wavesurfer.current.pause();
        setIsPlaying(false);
        onAddComment?.(time);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="bg-white/5 border border-white/10 rounded-xl p-6">
      <div ref={containerRef} className="mb-4" />
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            onClick={togglePlay}
            className="h-12 w-12 rounded-full bg-primary text-white flex items-center justify-center hover:bg-primary/90 transition-colors"
          >
            {isPlaying ? <Pause size={24} fill="currentColor" /> : <Play size={24} fill="currentColor" className="ml-1" />}
          </button>
          
          <div className="text-sm font-mono text-muted-foreground">
            {formatTime(currentTime)} / {formatTime(duration)}
          </div>
        </div>

        <div className="flex items-center gap-2">
           <button 
             onClick={handleAddCommentClick}
             className="flex items-center gap-2 px-3 py-2 bg-white/10 hover:bg-white/20 rounded-lg text-sm font-medium transition-colors text-primary"
             title="Add comment at current time"
           >
             <MessageSquarePlus size={18} />
             <span className="hidden sm:inline">Add Note</span>
           </button>
        </div>
      </div>
    </div>
  );
}
