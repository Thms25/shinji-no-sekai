"use client";

import { useState, use } from "react";
import WaveformPlayer from "@/components/WaveformPlayer";
import { MessageSquare, Clock, Download, ChevronDown } from "lucide-react";
import { motion } from "framer-motion";

// Mock data
const versions = [
  { id: "v1", name: "Mix 1", url: "https://wavesurfer.xyz/wavesurfer-code/examples/audio/mono.mp3", date: "2024-01-10" },
  { id: "v2", name: "Mix 2 (Vocal Up)", url: "https://wavesurfer.xyz/wavesurfer-code/examples/audio/stereo.mp3", date: "2024-01-15" },
  { id: "v3", name: "Master V1", url: "https://wavesurfer.xyz/wavesurfer-code/examples/audio/demo.wav", date: "2024-01-20" },
];

const comments = [
  { id: 1, user: "Eva", time: 12.5, text: "Can we bring up the kick here?", createdAt: "2024-01-21 10:30" },
  { id: 2, user: "Shinji", time: 45.2, text: "Fixed in V2. Check it out.", createdAt: "2024-01-21 11:00" },
];

export default function TrackPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const [activeVersion, setActiveVersion] = useState(versions[versions.length - 1]);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Midnight Drive</h1>
          <p className="text-muted-foreground mt-1">Project ID: {id}</p>
        </div>

        <div className="relative">
          <button 
            onClick={() => setIsVersionsOpen(!isVersionsOpen)}
            className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors min-w-[200px] justify-between"
          >
            <span className="font-medium">{activeVersion.name}</span>
            <ChevronDown size={16} className={`transition-transform ${isVersionsOpen ? "rotate-180" : ""}`} />
          </button>

          {isVersionsOpen && (
            <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
              {versions.map((v) => (
                <button
                  key={v.id}
                  onClick={() => {
                    setActiveVersion(v);
                    setIsVersionsOpen(false);
                  }}
                  className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex justify-between items-center ${
                    activeVersion.id === v.id ? "bg-white/5 text-primary" : ""
                  }`}
                >
                  <span>{v.name}</span>
                  <span className="text-xs text-muted-foreground">{v.date}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <WaveformPlayer url={activeVersion.url} />
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <h3 className="text-lg font-semibold mb-4">Version Notes</h3>
            <p className="text-muted-foreground text-sm leading-relaxed">
              This version includes the vocal adjustments requested. The kick drum has been tightened around 1:20 and the high-end sheen added to the master bus.
            </p>
            <div className="mt-6 flex gap-4">
              <button className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                <Download size={16} /> Download {activeVersion.name}
              </button>
            </div>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit">
          <div className="flex items-center gap-2 mb-6">
            <MessageSquare size={20} className="text-primary" />
            <h3 className="text-lg font-semibold">Comments</h3>
          </div>

          <div className="space-y-4 mb-6 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
            {comments.map((comment) => (
              <div key={comment.id} className="p-3 bg-white/5 rounded-lg border border-white/5">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-medium text-sm text-primary">{comment.user}</span>
                  <span className="text-xs text-muted-foreground flex items-center gap-1">
                    <Clock size={12} /> {formatTime(comment.time)}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground">{comment.text}</p>
              </div>
            ))}
          </div>

          <div className="space-y-3">
            <textarea 
              className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-1 focus:ring-primary resize-none"
              rows={3}
              placeholder="Add a comment at current time..."
            />
            <button className="w-full bg-foreground text-background text-sm font-medium py-2 rounded-lg hover:bg-[#383838] hover:text-white transition-colors">
              Post Comment
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
