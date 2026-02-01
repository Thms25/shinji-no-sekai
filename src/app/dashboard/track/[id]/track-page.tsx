"use client";

import { useState } from "react";
import WaveformPlayer from "@/components/WaveformPlayer";
import { MessageSquare, Download, ChevronDown, Plus } from "lucide-react";
import AddVersionModal from "@/components/AddVersionModal";
import AddCommentModal from "@/components/AddCommentModal";
import CommentList from "@/components/CommentList";
import { useAuth } from "@/contexts/AuthContext";
import { Track, TrackVersion, Comment } from "@/utils/type-utils";

export default function TrackPage({ 
  track, 
  versions, 
  comments 
}: { 
  params: Promise<{ id: string }>, 
  track: Track, 
  versions: TrackVersion[], 
  comments: Comment[] 
}) {
  const { user, role } = useAuth();
  const [activeVersion, setActiveVersion] = useState<TrackVersion | null>(versions.length > 0 ? versions[versions.length - 1] : null);
  const [isVersionsOpen, setIsVersionsOpen] = useState(false);
  const [isCommentModalOpen, setIsCommentModalOpen] = useState(false);
  const [modalTimestamp, setModalTimestamp] = useState<number | null>(null);

  // Filter comments
  const filteredMainComments = comments.filter(c => !c.timestamp); 
  const filteredVersionComments = activeVersion 
      ? comments.filter(c => c.timestamp && c.versionId === activeVersion.id)
      : [];

  const handleAddComment = (time: number) => {
    setModalTimestamp(time);
    setIsCommentModalOpen(true);
  };

  const openMainCommentModal = () => {
    setModalTimestamp(null);
    setIsCommentModalOpen(true);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">{track?.title || "Untitled Track"}</h1>
          <p className="text-muted-foreground mt-1">Project ID: {track?.id}</p>
        </div>

        <div className="flex items-center gap-4">
          <div className="relative">
            <button 
              onClick={() => setIsVersionsOpen(!isVersionsOpen)}
              className="flex items-center gap-2 bg-white/5 hover:bg-white/10 border border-white/10 px-4 py-2 rounded-lg transition-colors min-w-[200px] justify-between"
            >
              <span className="font-medium">{activeVersion?.name || "No Versions"}</span>
              <ChevronDown size={16} className={`transition-transform ${isVersionsOpen ? "rotate-180" : ""}`} />
            </button>

            {isVersionsOpen && versions.length > 0 && (
              <div className="absolute top-full right-0 mt-2 w-full min-w-[200px] bg-[#1a1a1a] border border-white/10 rounded-lg shadow-xl z-10 overflow-hidden">
                {versions.map((v) => (
                  <button
                    key={v.id}
                    onClick={() => {
                      setActiveVersion(v);
                      setIsVersionsOpen(false);
                    }}
                    className={`w-full text-left px-4 py-3 text-sm hover:bg-white/5 transition-colors flex justify-between items-center ${
                      activeVersion?.id === v.id ? "bg-white/5 text-primary" : ""
                    }`}
                  >
                    <span>{v.name}</span>
                    <span className="text-xs text-muted-foreground">{new Date(v.createdAt).toLocaleDateString()}</span>
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <AddVersionModal trackId={track.id} />
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {activeVersion ? (
             <WaveformPlayer 
                url={activeVersion.url} 
                onAddComment={handleAddComment}
                comments={filteredVersionComments}
             />
          ) : (
             <div className="h-[200px] bg-white/5 rounded-xl flex items-center justify-center text-muted-foreground border border-white/10">
                No versions uploaded yet. Add a version to get started.
             </div>
          )}
          
          <div className="bg-white/5 border border-white/10 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
                <h3 className="text-lg font-semibold">Version Notes</h3>
                {activeVersion && (
                     <button className="flex items-center gap-2 text-sm font-medium bg-primary text-white px-4 py-2 rounded-lg hover:bg-primary/90 transition-colors">
                        <Download size={16} /> Download
                    </button>
                )}
            </div>
            <p className="text-muted-foreground text-sm leading-relaxed">
              {activeVersion ? `Uploaded on ${new Date(activeVersion.createdAt).toLocaleString()}` : "Select a version to see details."}
            </p>
          </div>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-xl p-6 h-fit">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-2">
                <MessageSquare size={20} className="text-primary" />
                <h3 className="text-lg font-semibold">Discussion</h3>
            </div>
            <button onClick={openMainCommentModal} className="p-2 hover:bg-white/10 rounded-full text-primary transition-colors">
                <Plus size={20} />
            </button>
          </div>

          <div className="mb-6">
              <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">General Comments</h4>
              <CommentList comments={filteredMainComments} trackId={track.id} userRole={role || 'artist'} />
          </div>

          {activeVersion && (
              <div>
                  <h4 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3">
                      {activeVersion.name} Notes
                  </h4>
                  <CommentList comments={filteredVersionComments} trackId={track.id} userRole={role || 'artist'} />
              </div>
          )}
        </div>
      </div>

      {isCommentModalOpen && user && (
          <AddCommentModal 
            trackId={track.id}
            versionId={activeVersion?.id || null}
            timestamp={modalTimestamp}
            onClose={() => setIsCommentModalOpen(false)}
            userId={user.uid}
            userName={user.displayName || user.email || "User"}
            userRole={role || 'artist'}
          />
      )}
    </div>
  );
}
