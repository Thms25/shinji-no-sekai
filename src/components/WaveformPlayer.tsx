"use client";

import { useEffect, useRef, useState } from "react";
import WaveSurfer from "wavesurfer.js";
import { Play, Pause, SkipBack, SkipForward } from "lucide-react";

interface WaveformPlayerProps {
  url: string;
  onReady?: () => void;
  onTimeUpdate?: (time: number) => void;
}

export default function WaveformPlayer({ url, onReady, onTimeUpdate }: WaveformPlayerProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const wavesurfer = useRef<WaveSurfer | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  useEffect(() => {
    if (!containerRef.current) return;

    wavesurfer.current = WaveSurfer.create({
      container: containerRef.current,
      waveColor: "#4b5563",
      progressColor: "#3b82f6",
      cursorColor: "#3b82f6",
      barWidth: 2,
      barGap: 3,
      height: 100,
      normalize: true,
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

  const togglePlay = () => {
    if (wavesurfer.current) {
      wavesurfer.current.playPause();
      setIsPlaying(!isPlaying);
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
           <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <SkipBack size={20} />
          </button>
          <button className="p-2 text-muted-foreground hover:text-foreground transition-colors">
            <SkipForward size={20} />
          </button>
        </div>
      </div>
    </div>
  );
}
