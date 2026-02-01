"use client";

import { useState } from "react";
import { Upload, X } from "lucide-react";
import { createTrack } from "@/actions/admin-actions";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { app } from "@/lib/firebase";

export default function CreateTrackModal({ artistId }: { artistId: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleCreate(formData: FormData) {
    setLoading(true);
    setError(null);
    setUploadProgress(0);
    
    const file = formData.get("file") as File;
    const title = formData.get("title") as string;
    const versionName = formData.get("versionName") as string;

    if (!file || file.size === 0) {
        setError("Please select an audio file.");
        setLoading(false);
        return;
    }

    try {
        // 1. Upload file to Firebase Storage
        const storage = getStorage(app);
        // Create a reference with a unique path
        const storageRef = ref(storage, `tracks/${artistId}/${Date.now()}_${file.name}`);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed', 
            (snapshot) => {
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                setUploadProgress(progress);
            }, 
            (error) => {
                console.error("Upload error:", error);
                setError("Upload failed: " + error.message);
                setLoading(false);
            }, 
            async () => {
                // 2. Get URL and save to Firestore via Server Action
                const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
                
                // Prepare form data for server action
                // We reuse the existing formData but need to append the URL
                // Note: We can't easily append to the Event's formData if we prevented default, 
                // but here we are constructing a call.
                const serverFormData = new FormData();
                serverFormData.append("title", title);
                serverFormData.append("versionName", versionName);
                serverFormData.append("artistId", artistId);
                serverFormData.append("url", downloadURL);

                const result = await createTrack(null, serverFormData);
                
                if (result?.error) {
                    setError(result.error);
                } else {
                    setIsOpen(false);
                    window.location.reload();
                }
                setLoading(false);
            }
        );

    } catch (e: any) {
        setError(e.message);
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
                    <div>
                         <label className="text-sm font-medium block mb-1">Initial Version Name</label>
                         <input name="versionName" type="text" required className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2" placeholder="e.g. Mix 1" />
                    </div>
                    
                    <div>
                        <label className="text-sm font-medium block mb-1">Audio File</label>
                        <input 
                            name="file" 
                            type="file" 
                            accept="audio/*" 
                            required 
                            className="w-full bg-black/20 border border-white/10 rounded-lg px-3 py-2 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-primary/10 file:text-primary hover:file:bg-primary/20" 
                        />
                    </div>

                    {loading && uploadProgress > 0 && (
                        <div className="w-full bg-white/10 rounded-full h-2.5 mb-4">
                            <div className="bg-primary h-2.5 rounded-full transition-all duration-300" style={{ width: `${uploadProgress}%` }}></div>
                        </div>
                    )}

                    <button 
                        type="submit" 
                        disabled={loading}
                        className="w-full bg-primary text-white py-2 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-50"
                    >
                        {loading ? (uploadProgress < 100 ? `Uploading ${Math.round(uploadProgress)}%` : "Creating Track...") : "Create Track"}
                    </button>
                </form>
            </div>
        </div>
      )}
    </>
  );
}
