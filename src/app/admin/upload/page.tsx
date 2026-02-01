"use client";

import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";
import { ChevronLeft, Upload as UploadIcon, X } from "lucide-react";

export default function AdminUpload() {
  const { user, loading, role } = useAuth();
  const router = useRouter();
  const [dragActive, setDragActive] = useState(false);

  useEffect(() => {
    if (!loading) {
      if (!user) {
        router.push("/login");
      } else if (role !== 'admin') {
         router.push("/dashboard");
      }
    }
  }, [user, loading, role, router]);

  if (loading || !user || role !== 'admin') {
    return null;
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    // Handle files
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <Link href="/admin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors">
        <ChevronLeft size={16} className="mr-1" /> Back to Dashboard
      </Link>

      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Upload New Track</h1>
        <p className="text-muted-foreground mt-1">Add a new track or version for an artist.</p>
      </div>

      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Select Artist</label>
          <select className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary appearance-none">
            <option>Select an artist...</option>
            <option>Eva</option>
            <option>Akira</option>
            <option>Rain</option>
          </select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Track Title</label>
          <input 
            type="text" 
            className="w-full bg-white/5 border border-white/10 rounded-lg px-4 py-3 focus:outline-none focus:ring-1 focus:ring-primary"
            placeholder="e.g. Midnight Drive"
          />
        </div>

        <div 
          className={`border-2 border-dashed rounded-xl p-10 flex flex-col items-center justify-center transition-colors ${
            dragActive ? "border-primary bg-primary/5" : "border-white/10 hover:border-white/20 bg-white/5"
          }`}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
        >
          <UploadIcon size={40} className="text-muted-foreground mb-4" />
          <p className="font-medium text-lg mb-1">Drag and drop audio files</p>
          <p className="text-sm text-muted-foreground mb-4">WAV, MP3, AIFF up to 500MB</p>
          <button className="bg-white/10 hover:bg-white/20 text-foreground px-4 py-2 rounded-lg text-sm font-medium transition-colors">
            Browse Files
          </button>
        </div>

        <div className="flex justify-end pt-4">
          <button className="bg-primary text-white px-6 py-3 rounded-lg font-medium hover:bg-primary/90 transition-colors w-full sm:w-auto">
            Upload Track
          </button>
        </div>
      </div>
    </div>
  );
}
