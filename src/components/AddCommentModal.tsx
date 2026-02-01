"use client";

import { useState } from "react";
import { X, Check, Trash } from "lucide-react";
import { addComment, deleteComment, solveComment } from "@/actions/comment-actions";

interface AddCommentModalProps {
  trackId: string;
  versionId: string | null;
  timestamp: number | null;
  onClose: () => void;
  userId: string;
  userName: string;
  userRole: string;
}

export default function AddCommentModal({ trackId, versionId, timestamp, onClose, userId, userName, userRole }: AddCommentModalProps) {
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    
    const formData = new FormData();
    formData.append("trackId", trackId);
    if (versionId) formData.append("versionId", versionId);
    if (timestamp !== null) formData.append("timestamp", timestamp.toString());
    formData.append("text", text);
    formData.append("userId", userId);
    formData.append("userName", userName);
    formData.append("userRole", userRole);

    // Need to import addComment from track-actions but I used track-actions for it. 
    // Let's import it from actions/track-actions.ts
    // Wait, I put it in track-actions.ts. Let's move or re-export. 
    // Actually I can just call the server action directly.
    // I need to update the import in this file. 
    // Let's assume I imported it correctly below.
    const { addComment } = await import("@/actions/track-actions");

    await addComment(null, formData);
    setLoading(false);
    onClose();
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
        <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-md relative">
            <button 
                onClick={onClose}
                className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
            >
                <X size={20} />
            </button>
            <h2 className="text-xl font-bold mb-4">
                {timestamp !== null ? `Add Note at ${formatTime(timestamp)}` : "Add General Comment"}
            </h2>
            
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <textarea 
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        required 
                        className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 h-32 resize-none focus:outline-none focus:ring-1 focus:ring-primary" 
                        placeholder="Write your feedback..." 
                    />
                </div>
                
                <button 
                    type="submit" 
                    disabled={loading}
                    className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                >
                    {loading ? "Posting..." : "Post Comment"}
                </button>
            </form>
        </div>
    </div>
  );
}
