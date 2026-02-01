import { adminDb } from "@/lib/firebase-admin";
import TrackPage from "./track-page";
import { Track, TrackVersion, Comment } from "@/utils/type-utils";

// Force dynamic
export const dynamic = "force-dynamic";

export default async function TrackPageServer({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  
  // Fetch track
  const trackDoc = await adminDb.collection("tracks").doc(id).get();
  if (!trackDoc.exists) {
      return <div>Track not found</div>;
  }
  const trackData = trackDoc.data();
  // Ensure dates are strings for serialization
  const track = { 
      id: trackDoc.id, 
      ...trackData,
      createdAt: trackData?.createdAt?.toString() || "",
      updatedAt: trackData?.updatedAt?.toString() || "",
  } as Track;

  // Fetch versions
  const versionsSnapshot = await adminDb.collection("tracks").doc(id).collection("versions").orderBy("createdAt", "asc").get();
  const versions = versionsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toString() || ""
      };
  }) as TrackVersion[];

  // Fetch comments
  const commentsSnapshot = await adminDb.collection("tracks").doc(id).collection("comments").orderBy("createdAt", "desc").get();
  const comments = commentsSnapshot.docs.map(doc => {
      const data = doc.data();
      return { 
          id: doc.id, 
          ...data,
          createdAt: data.createdAt?.toString() || ""
      };
  }) as Comment[];

  return <TrackPage params={params} track={track} versions={versions} comments={comments} />;
}
