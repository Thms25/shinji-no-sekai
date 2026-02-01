"use server";

import { adminAuth, adminDb, admin } from "@/lib/firebase-admin";

export async function createArtist(prevState: any, formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!name || !email || !password) {
    return { error: "All fields are required" };
  }

  try {
    const newUser = await adminAuth.createUser({
      email,
      password,
      displayName: name,
    });

    await adminAuth.setCustomUserClaims(newUser.uid, { role: "artist" });

    await adminDb.collection("users").doc(newUser.uid).set({
      email,
      role: "artist",
      displayName: name,
      createdAt: new Date().toISOString(),
      tracksCount: 0,
    });

    return { success: true, message: `Artist ${name} created successfully.` };
  } catch (error: any) {
    console.error("Error creating artist:", error);
    return { error: error.message };
  }
}

export async function createTrack(prevState: any, formData: FormData) {
    const title = formData.get("title") as string;
    const versionName = formData.get("versionName") as string;
    const artistId = formData.get("artistId") as string;
    const url = formData.get("url") as string;

    if (!title || !versionName || !artistId || !url) {
        return { error: "Missing fields: title, version name, artist, or file URL." };
    }

    try {
        const trackRef = adminDb.collection("tracks").doc();
        await trackRef.set({
            title,
            artistId,
            status: "In Progress",
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
        });

        // Add first version
        await trackRef.collection("versions").add({
            name: versionName,
            url: url, 
            createdAt: new Date().toISOString(),
        });

        // Update artist track count
        await adminDb.collection("users").doc(artistId).update({
            tracksCount: admin.firestore.FieldValue.increment(1)
        });

        return { success: true };
    } catch (e: any) {
        console.error("Create track error:", e);
        return { error: e.message };
    }
}
