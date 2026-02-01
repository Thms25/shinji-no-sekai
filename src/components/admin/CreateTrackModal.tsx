"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { createTrack } from "@/actions/admin-actions";

export default function CreateTrackModal({ artistId }: { artistId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setError(null);
    try {
        formData.append("artistId", artistId);
        const result = await createTrack(null, formData);
        if (result?.error) {
            setError(result.error);
        } else {
            setIsOpen(false);
            window.location.reload();
        }
    } catch (e: any) {
        setError(e.message);
    } finally {
        setLoading(false);
    }
  }

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="flex items-center justify-center gap-2 bg-primary text-white px-5 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium"
      >
        <Upload size={18} /> New Track
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm">
            <div className="bg-[#1a1a1a] border border-white/10 rounded-xl p-6 w-full max-w-md relative">
                <button 
                    onClick={() => setIsOpen(false)}
                    className="absolute top-4 right-4 text-muted-foreground hover:text-foreground"
                >
                    <X size={20} />
                </button>
                <h2 className="text-xl font-bold mb-4">Create New Track</h2>
                
                {error && (
                    <div className="bg-red-500/10 border border-red-500/20 text-red-500 p-3 rounded-lg mb-4 text-sm">
                        {error}
                    </div>
                )}

                <form action={handleCreate} className="space-y-4">
                    <div>
                        <label className="text-sm font-medium block mb-1">Track Title</label>
                        <input name="title" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2" placeholder="e.g. Midnight Drive" />
                    </div>
                    {/* 
                      Note: We are just creating the track container here first. 
                      Versions will be added inside the track page.
                      Or we could upload the first version here.
                      The user said "add a new track, with the version name in it" -> implies first version creation.
                    */}
                    <div>
                         <label className="text-sm font-medium block mb-1">Initial Version Name</label>
                         <input name="versionName" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2" placeholder="e.g. Mix 1" />
                    </div>
                    {/* Future: Add file upload here. For now let's just create the record and let them upload in the track page or separate step if file handling is complex without a dedicated upload component */ }
                    
                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                    >
                        {loading ? "Creating..." : "Create Track"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </>
  );
}
