"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export async function addVersion(prevState: any, formData: FormData) {
  const trackId = formData.get("trackId") as string;
  const name = formData.get("name") as string;
  // File upload would happen on client to Storage, then url passed here. 
  // For now we simulate or assume a URL is passed or we handle file upload via a separate mechanism later.
  // The user asked for "focus on track uploads".
  // Since we are in a server action, handling big file uploads directly via FormData can be tricky with Vercel/Next limits.
  // Best practice: Client uploads to Firebase Storage directly, gets URL, sends URL to Server Action.
  // For this step, let's assume we receive a URL or just placeholder for now until we implement client-side upload.
  const url = formData.get("url") as string; 

  if (!trackId || !name) {
    return { error: "Missing fields" };
  }

  try {
    const versionRef = adminDb.collection("tracks").doc(trackId).collection("versions").doc();
    await versionRef.set({
        name,
        url: url || "", 
        createdAt: new Date().toISOString(),
    });

    await adminDb.collection("tracks").doc(trackId).update({
        updatedAt: new Date().toISOString(),
        status: "In Progress" // Or update status based on logic
    });
    
    revalidatePath(`/dashboard/track/${trackId}`);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function addComment(prevState: any, formData: FormData) {
    const trackId = formData.get("trackId") as string;
    const versionId = formData.get("versionId") as string; // Optional if main comment
    const text = formData.get("text") as string;
    const timestamp = formData.get("timestamp") ? parseFloat(formData.get("timestamp") as string) : null;
    const userId = formData.get("userId") as string;
    const userRole = formData.get("userRole") as string;
    const userName = formData.get("userName") as string;

    if (!trackId || !text || !userId) {
        return { error: "Missing fields" };
    }

    try {
        const commentData = {
            text,
            userId,
            userName,
            userRole,
            createdAt: new Date().toISOString(),
            solved: false,
            timestamp: timestamp, // If null, it's a main comment. If set, it's a timestamped comment.
            versionId: versionId || null, // If set, specific to version.
        };

        await adminDb.collection("tracks").doc(trackId).collection("comments").add(commentData);
        
        revalidatePath(`/dashboard/track/${trackId}`);
        return { success: true };

    } catch (e: any) {
        return { error: e.message };
    }
}
