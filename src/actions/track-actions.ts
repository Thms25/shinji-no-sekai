"use server";

import { ObjectId } from "mongodb";
import { revalidatePath } from "next/cache";
import { getDb } from "@/lib/mongodb";

const DB_NAME = process.env.MONGODB_DB_NAME || "Shinji";

export async function addVersion(prevState: any, formData: FormData) {
  const trackId = formData.get("trackId") as string;
  const name = formData.get("name") as string;
  const url = formData.get("url") as string;

  if (!trackId || !name || !url) {
    return { error: "Missing fields: track ID, name, or file URL." };
  }

  try {
    const db = await getDb(DB_NAME);
    const versions = db.collection("versions");
    const tracks = db.collection("tracks");
    const now = new Date().toISOString();

    await versions.insertOne({
      trackId,
      name,
      url,
      createdAt: now,
    });

    await tracks.updateOne(
      { _id: new ObjectId(trackId) },
      {
        $set: {
          updatedAt: now,
          status: "In Progress",
        },
      }
    );

    revalidatePath(`/dashboard/track/${trackId}`);
    return { success: true };
  } catch (e: any) {
    console.error("addVersion error:", e);
    return { error: e.message || "Failed to add version." };
  }
}

export async function addComment(prevState: any, formData: FormData) {
  const trackId = formData.get("trackId") as string;
  const versionId = formData.get("versionId") as string; // Optional if main comment
  const text = formData.get("text") as string;
  const timestamp = formData.get("timestamp")
    ? parseFloat(formData.get("timestamp") as string)
    : null;
  const userId = formData.get("userId") as string;
  const userRole = formData.get("userRole") as string;
  const userName = formData.get("userName") as string;

  if (!trackId || !text || !userId) {
    return { error: "Missing fields" };
  }

  try {
    const db = await getDb(DB_NAME);
    const comments = db.collection("comments");

    const commentData = {
      trackId,
      text,
      userId,
      userName,
      userRole,
      createdAt: new Date().toISOString(),
      solved: false,
      timestamp, // If null, it's a main comment. If set, it's a timestamped comment.
      versionId: versionId || null, // If set, specific to version.
    };

    await comments.insertOne(commentData);

    revalidatePath(`/dashboard/track/${trackId}`);
    return { success: true };
  } catch (e: any) {
    console.error("addComment error:", e);
    return { error: e.message || "Failed to add comment." };
  }
}

