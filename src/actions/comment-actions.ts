"use server";

import { adminDb } from "@/lib/firebase-admin";
import { revalidatePath } from "next/cache";

export async function solveComment(commentId: string, trackId: string, solved: boolean) {
  try {
    await adminDb.collection("tracks").doc(trackId).collection("comments").doc(commentId).update({
        solved
    });
    revalidatePath(`/dashboard/track/${trackId}`);
    return { success: true };
  } catch (e: any) {
    return { error: e.message };
  }
}

export async function deleteComment(commentId: string, trackId: string) {
    try {
      await adminDb.collection("tracks").doc(trackId).collection("comments").doc(commentId).delete();
      revalidatePath(`/dashboard/track/${trackId}`);
      return { success: true };
    } catch (e: any) {
      return { error: e.message };
    }
}
