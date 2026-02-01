"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export async function addVersion(prevState: any, formData: FormData) {
  const trackId = formData.get("trackId") as string;
  const name = formData.get("name") as string;
  const url = formData.get("url") as string; 

  if (!trackId || !name || !url) {
    return { error: "Missing fields: track ID, name, or file URL." };
  }

  try {
    const versionRef = adminDb.collection("tracks").doc(trackId).collection("versions").doc();
    await versionRef.set({
        name,
        url: url, 
        createdAt: new Date().toISOString(),
    });

    await adminDb.collection("tracks").doc(trackId).update({
        updatedAt: new Date().toISOString(),
        status: "In Progress"
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
